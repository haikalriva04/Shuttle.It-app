import { neon } from '@neondatabase/serverless';

const SCHEDULES: Record<string, { [key: string]: string[] }> = {
    "Anggrek-Alam Sutera": {
        "Mon-Thu": ["06:05 AM", "07:30 AM", "10:10 AM", "12:10 PM", "14:10 PM", "15:30 PM", "17:30 PM"],
        "Fri":     ["06:05 AM", "07:30 AM", "10:10 AM", "12:40 PM", "14:10 PM", "15:30 PM", "17:30 PM"],
        "Sat":     ["06:05 AM", "07:30 AM", "10:10 AM", "12:10 PM", "15:30 PM"],
    },
    "Alam Sutera-Anggrek": {
        "Mon-Thu": ["07:30 AM", "09:30 AM", "11:30 AM", "13:30 PM", "15:30 PM", "17:30 PM", "19:10 PM"],
        "Fri":     ["07:30 AM", "09:30 AM", "11:10 AM", "13:30 PM", "15:30 PM", "17:30 PM", "19:10 PM"],
        "Sat":     ["07:30 AM", "11:30 AM", "13:30 PM", "15:30 PM", "17:10 PM"],
    },
    "Bekasi-Anggrek": {
        "Mon-Thu": ["07:30 AM", "15:30 PM", "19:10 PM"],
        "Fri":     ["07:30 AM", "13:30 PM", "19:10 PM"],
        "Sat":     ["07:30 AM", "17:10 PM"],
    },
    "Anggrek-Bekasi": {
        "Mon-Thu": ["06:00 AM", "09:30 AM", "17:10 PM"],
        "Fri":     ["06:00 AM", "11:10 AM", "17:10 PM"],
        "Sat":     ["06:00 AM", "11:10 AM"],
    },
};

const LOCATION_MAP: Record<string, string> = {
    "BINUS @ Alam Sutera Campus": "Alam Sutera",
    "BINUS Anggrek Campus": "Anggrek",
    "BINUS @ Bekasi": "Bekasi",
};

export async function GET(request: Request) {
  const sql = neon(`${process.env.DATABASE_URL}`);
  const { searchParams } = new URL(request.url);
  
  const originFull = searchParams.get('origin');
  const destinationFull = searchParams.get('destination');
  const dateStr = searchParams.get('date'); // YYYY-MM-DD

  if (!originFull || !destinationFull || !dateStr) {
    return Response.json({ error: 'Missing parameters' }, { status: 400 });
  }

  const origin = LOCATION_MAP[originFull] || originFull;
  const destination = LOCATION_MAP[destinationFull] || destinationFull;
  const routeKey = `${origin}-${destination}`;

  const date = new Date(dateStr);
  const dayOfWeek = date.getDay();
  
  const scheduleData = SCHEDULES[routeKey];
  let timeSlots: string[] = [];

  if (scheduleData) {
      if (dayOfWeek >= 1 && dayOfWeek <= 4) timeSlots = scheduleData["Mon-Thu"];
      else if (dayOfWeek === 5) timeSlots = scheduleData["Fri"];
      else if (dayOfWeek === 6) timeSlots = scheduleData["Sat"];
  }

  if (timeSlots.length === 0) {
      return Response.json({ data: [] });
  }

  try {
    const bookings = await sql`
      SELECT departure_time, COUNT(*) as count 
      FROM bookings 
      WHERE origin = ${originFull} 
      AND destination = ${destinationFull} 
      AND departure_date = ${dateStr}
      GROUP BY departure_time
    `;

    const MAX_SEATS = 30;

    const result = timeSlots.map(time => {
      const bookedCount = bookings.find((b: any) => b.departure_time === time)?.count || 0;
      const available = MAX_SEATS - Number(bookedCount);
      
      return {
        time: time,
        seats_available: Math.max(0, available),
        is_full: available <= 0
      };
    });

    return Response.json({ data: result });
  } catch (error) {
    console.error("Database Error:", error);
    return Response.json({ error: 'Internal Server Error' }, { status: 500 });
  }
}

export async function POST(request: Request) {
  const sql = neon(`${process.env.DATABASE_URL}`);
  
  try {
    const { 
        user_id, user_name, user_email, 
        origin, destination, date, time, 
        booking_code 
    } = await request.json();

    if (!user_id || !origin || !destination || !date || !time || !booking_code) {
        return Response.json({ error: "Data tidak lengkap" }, { status: 400 });
    }

    const existing = await sql`
        SELECT COUNT(*) as count FROM bookings 
        WHERE origin=${origin} AND destination=${destination} 
        AND departure_date=${date} AND departure_time=${time}
    `;

    if (existing[0].count >= 30) {
        return Response.json({ error: "Maaf, bus sudah penuh!" }, { status: 400 });
    }

    await sql`
        INSERT INTO bookings (
            booking_code, user_id, user_name, user_email, 
            origin, destination, departure_date, departure_time, seats_booked
        )
        VALUES (
            ${booking_code}, ${user_id}, ${user_name}, ${user_email}, 
            ${origin}, ${destination}, ${date}, ${time}, 1
        )
    `;

    return Response.json({ success: true, booking_code: booking_code });

  } catch (error) {
    console.error("Booking Error:", error);
    if (error.code === '23505') { 
        return Response.json({ error: "Booking code duplicate, try again." }, { status: 409 });
    }
    return Response.json({ error: "Gagal memproses booking" }, { status: 500 });
  }
}
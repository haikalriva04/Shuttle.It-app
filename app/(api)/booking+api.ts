import { neon } from "@neondatabase/serverless";

export async function POST(request: Request) {
  try {
    const sql = neon(`${process.env.DATABASE_URL}`);
    const { 
      user_id, username, email, 
      origin, destination, departure_date, departure_time, 
      booking_code 
    } = await request.json();

    if (!user_id || !origin || !departure_date || !booking_code) {
      return Response.json({ error: "Data tidak lengkap" }, { status: 400 });
    }

    const checkTrip = await sql`
      SELECT seats_available 
      FROM trips 
      WHERE origin = ${origin} 
      AND destination = ${destination}
      AND departure_date = ${departure_date}::DATE
      AND departure_time = ${departure_time}
    `;

    if (checkTrip.length === 0) {
        return Response.json({ error: "Jadwal tidak ditemukan" }, { status: 404 });
    }

    const currentSeats = checkTrip[0].seats_available;

    if (currentSeats <= 0) {
        return Response.json({ error: "Kursi Penuh" }, { status: 400 });
    }

    const newBooking = await sql`
      INSERT INTO bookings (
        user_id, username, email, booking_code, 
        origin, destination, departure_date, departure_time, seats_booked
      ) 
      VALUES (
        ${user_id}, ${username}, ${email}, ${booking_code},
        ${origin}, ${destination}, ${departure_date}, ${departure_time}, 1
      )
      RETURNING *;
    `;

    const updatedTrip = await sql`
      UPDATE trips 
      SET seats_available = seats_available - 1,
          status = CASE WHEN (seats_available - 1) <= 0 THEN 'FULL' ELSE 'AVAILABLE' END
      WHERE origin = ${origin} 
      AND destination = ${destination}
      AND departure_date = ${departure_date}::DATE
      AND departure_time = ${departure_time}
      RETURNING seats_available;
    `;

    return Response.json({ data: newBooking[0], remaining_seats: updatedTrip[0].seats_available });

  } catch (error) {
    console.error("Booking Error:", error);
    return Response.json({ error: "Internal Server Error" }, { status: 500 });
  }
}

export async function GET(request: Request) {
    try {
        const sql = neon(`${process.env.DATABASE_URL}`);
        const { searchParams } = new URL(request.url);
        const userId = searchParams.get("user_id");

        if(!userId) {
            return Response.json({ error: "User ID Missing" }, { status: 400 });
        }

        const bookings = await sql`
            SELECT * FROM bookings 
            WHERE user_id = ${userId} 
            ORDER BY created_at DESC
        `;

        return Response.json({ data: bookings });
    } catch (error) {
        console.error(error);
        return Response.json({ error: error }, { status: 500 });
    }
}
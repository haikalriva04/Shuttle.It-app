import { neon } from "@neondatabase/serverless";

export async function POST(request: Request) {
  try {
    const sql = neon(`${process.env.DATABASE_URL}`);
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
            origin, destination, departure_date, departure_time, seats_booked, status
        )
        VALUES (
            ${booking_code}, ${user_id}, ${user_name}, ${user_email}, 
            ${origin}, ${destination}, ${date}, ${time}, 1, 'booked'
        )
    `;

    return Response.json({ success: true, booking_code: booking_code });

  } catch (error: any) {
    console.error("Booking POST Error:", error);
    if (error.code === '23505') { 
        return Response.json({ error: "Terjadi kesalahan (Duplicate Code), coba lagi." }, { status: 409 });
    }
    return Response.json({ error: "Gagal memproses booking" }, { status: 500 });
  }
}

export async function GET(request: Request) {
    try {
        const sql = neon(`${process.env.DATABASE_URL}`);
        const { searchParams } = new URL(request.url);
        
        const userId = searchParams.get("user_id");
        const bookingCode = searchParams.get("booking_code");

        if (bookingCode) {
            const ticket = await sql`
                SELECT * FROM bookings 
                WHERE booking_code = ${bookingCode}
            `;
            return Response.json({ data: ticket });
        }

        if (userId) {
            const bookings = await sql`
                SELECT * FROM bookings 
                WHERE user_id = ${userId} 
                ORDER BY created_at DESC
            `;
            return Response.json({ data: bookings });
        }

        return Response.json({ error: "Missing Parameters" }, { status: 400 });

    } catch (error) {
        console.error("Booking GET Error:", error);
        return Response.json({ error: "Internal Server Error" }, { status: 500 });
    }
}

export async function PATCH(request: Request) {
    try {
        const sql = neon(`${process.env.DATABASE_URL}`);
        const { booking_code } = await request.json();

        if (!booking_code) {
            return Response.json({ error: "Booking code diperlukan" }, { status: 400 });
        }

        const existingTicket = await sql`SELECT * FROM bookings WHERE booking_code = ${booking_code}`;

        if (existingTicket.length === 0) {
            return Response.json({ error: "Tiket tidak ditemukan" }, { status: 404 });
        }

        if (existingTicket[0].status === 'verified') {
            return Response.json({ message: "Tiket sudah diverifikasi sebelumnya", alreadyVerified: true });
        }

        const updatedTicket = await sql`
            UPDATE bookings 
            SET status = 'verified' 
            WHERE booking_code = ${booking_code}
            RETURNING *
        `;

        return Response.json({ 
            success: true, 
            message: "Verifikasi Berhasil", 
            data: updatedTicket[0] 
        });

    } catch (error) {
        console.error("Booking PATCH Error:", error);
        return Response.json({ error: "Gagal memverifikasi tiket" }, { status: 500 });
    }
}

export async function DELETE(request: Request) {
  try {
    const sql = neon(`${process.env.DATABASE_URL}`);
    const { searchParams } = new URL(request.url);
    const booking_code = searchParams.get("booking_code");

    if (!booking_code) {
      return Response.json({ error: "Booking Code Missing" }, { status: 400 });
    }

    const check = await sql`SELECT status FROM bookings WHERE booking_code = ${booking_code}`;
    
    if (check.length > 0 && check[0].status === 'verified') {
        return Response.json({ error: "Tiket sudah diverifikasi, tidak dapat dibatalkan." }, { status: 400 });
    }

    const deletedBooking = await sql`
        DELETE FROM bookings 
        WHERE booking_code = ${booking_code}
        RETURNING *;
    `;

    if (deletedBooking.length === 0) {
        return Response.json({ error: "Booking tidak ditemukan" }, { status: 404 });
    }

    return Response.json({ message: "Booking berhasil dibatalkan" });

  } catch (error) {
    console.error("Booking DELETE Error:", error);
    return Response.json({ error: "Internal Server Error" }, { status: 500 });
  }
}
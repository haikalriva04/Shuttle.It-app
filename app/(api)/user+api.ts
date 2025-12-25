import { neon } from "@neondatabase/serverless";

export async function POST(request: Request) {
  try {
    const sql = neon(`${process.env.DATABASE_URL}`);
    const { name, email, clerkId } = await request.json();

    if (!name || !email || !clerkId) {
      return Response.json(
        { error: "Missing required fields" },
        { status: 400 }
      );
    }

    // SOLUSI: Gunakan ON CONFLICT DO NOTHING (atau UPDATE)
    // Ini akan mencegah error jika user sudah ada di database.
    const response = await sql`
      INSERT INTO users (
        name, 
        email, 
        clerk_id
      ) 
      VALUES (
        ${name}, 
        ${email}, 
        ${clerkId}
      )
      ON CONFLICT (email) DO UPDATE 
      SET clerk_id = EXCLUDED.clerk_id, name = EXCLUDED.name
      RETURNING id, name, email, clerk_id;
    `;

    // Note: Kita menggunakan DO UPDATE agar jika user mendaftar ulang 
    // setelah dihapus di Clerk, Clerk ID yang baru akan ter-update di database lokal.

    return Response.json({ data: response[0] }, { status: 201 });
  } catch (error) {
    console.error("Error creating user:", error);
    return Response.json(
      { error: "Internal Server Error" },
      { status: 500 }
    );
  }
}
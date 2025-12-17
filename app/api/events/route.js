import { NextResponse } from "next/server";
import { Pool } from "pg";

const pool = new Pool({
  connectionString: process.env.DATABASE_URL,
  ssl: {
    rejectUnauthorized: false,
  },
});

export async function GET() {
  try {
    const client = await pool.connect();

    try {
      const result = await client.query(
        `SELECT id, event_name, user_id, properties, created_at 
         FROM events 
         ORDER BY created_at DESC 
         LIMIT 50`
      );

      return NextResponse.json({
        success: true,
        count: result.rows.length,
        events: result.rows,
      });
    } finally {
      client.release();
    }
  } catch (error) {
    console.error("Fetch error:", error);
    return NextResponse.json(
      { error: "Failed to fetch events" },
      { status: 500 }
    );
  }
}

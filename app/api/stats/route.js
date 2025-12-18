import { NextResponse } from "next/server";
import { Pool } from "pg";

const pool = new Pool({
  connectionString: process.env.DATABASE_URL,
  ssl: {
    rejectUnauthorized: false,
  },
});

// GET - Fetch aggregated statistics
export async function GET() {
  try {
    const client = await pool.connect();

    try {
      // Get total events count
      const totalResult = await client.query(
        "SELECT COUNT(*) as total FROM events"
      );

      // Get events grouped by date
      const dailyResult = await client.query(
        `SELECT DATE(created_at) as date, COUNT(*) as count 
         FROM events 
         GROUP BY DATE(created_at) 
         ORDER BY date DESC`
      );

      // Get top events by count
      const topEventsResult = await client.query(
        `SELECT event_name, COUNT(*) as count 
         FROM events 
         GROUP BY event_name 
         ORDER BY count DESC 
         LIMIT 10`
      );

      return NextResponse.json({
        success: true,
        totalEvents: parseInt(totalResult.rows[0].total),
        dailyEvents: dailyResult.rows,
        topEvents: topEventsResult.rows,
      });
    } finally {
      client.release();
    }
  } catch (error) {
    console.error("Fetch error:", error);
    return NextResponse.json(
      { error: "Failed to fetch events", details: error.message },
      { status: 500 }
    );
  }
}

// POST - Track new event
export async function POST(request) {
  try {
    const body = await request.json();
    let { eventName, userId, properties } = body;

    if (!eventName) {
      return NextResponse.json(
        { error: "eventName is required" },
        { status: 400 }
      );
    }

    const client = await pool.connect();

    try {
      await client.query(
        "INSERT INTO events (event_name, user_id, properties) VALUES ($1, $2, $3)",
        [
          eventName,
          userId || "anonymous",
          properties ? JSON.stringify(properties) : null,
        ]
      );

      return NextResponse.json(
        { success: true, message: "Event tracked" },
        {
          headers: {
            "Access-Control-Allow-Origin": "*",
            "Access-Control-Allow-Methods": "POST, GET, OPTIONS",
            "Access-Control-Allow-Headers": "Content-Type",
          },
        }
      );
    } finally {
      client.release();
    }
  } catch (error) {
    console.error("Tracking error:", error);
    return NextResponse.json(
      { error: "Failed to track event", details: error.message },
      { status: 500 }
    );
  }
}

// OPTIONS - CORS preflight
export async function OPTIONS() {
  return NextResponse.json(
    {},
    {
      headers: {
        "Access-Control-Allow-Origin": "*",
        "Access-Control-Allow-Methods": "POST, GET, OPTIONS",
        "Access-Control-Allow-Headers": "Content-Type",
      },
    }
  );
}

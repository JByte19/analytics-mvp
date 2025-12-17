import { NextResponse } from "next/server";
import { Pool } from "pg";

const pool = new Pool({
  connectionString: process.env.DATABASE_URL,
  ssl: {
    rejectUnauthorized: false,
  },
});

// Rate limiting
const MAX_REQUESTS_PER_MINUTE = 1000;
const requestCounts = new Map();

function getRateLimitKey(req) {
  return req.headers.get("x-forwarded-for") || "unknown";
}

function checkRateLimit(key) {
  const now = Date.now();
  const minute = Math.floor(now / 60000);
  const countKey = `${key}:${minute}`;

  const count = requestCounts.get(countKey) || 0;

  if (count >= MAX_REQUESTS_PER_MINUTE) {
    return false;
  }

  requestCounts.set(countKey, count + 1);

  if (requestCounts.size > 10000) {
    const cutoff = minute - 2;
    for (const [k] of requestCounts.entries()) {
      const m = parseInt(k.split(":"));
      if (m < cutoff) requestCounts.delete(k);
    }
  }

  return true;
}

function sanitizeInput(str) {
  if (typeof str !== "string") return str;
  return str.slice(0, 255).trim();
}

function validateEvent(eventName, properties) {
  if (
    typeof eventName !== "string" ||
    eventName.length < 1 ||
    eventName.length > 255
  ) {
    return "Invalid eventName";
  }

  if (properties && typeof properties !== "object") {
    return "Properties must be an object";
  }

  if (properties && JSON.stringify(properties).length > 10000) {
    return "Properties too large";
  }

  return null;
}

export async function POST(request) {
  try {
    const rateLimitKey = getRateLimitKey(request);
    if (!checkRateLimit(rateLimitKey)) {
      return NextResponse.json(
        { error: "Rate limit exceeded" },
        { status: 429 }
      );
    }

    const body = await request.json();
    let { eventName, userId, properties } = body;

    if (!eventName) {
      return NextResponse.json(
        { error: "eventName is required" },
        { status: 400 }
      );
    }

    eventName = sanitizeInput(eventName);
    const validationError = validateEvent(eventName, properties);
    if (validationError) {
      return NextResponse.json({ error: validationError }, { status: 400 });
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
            "Access-Control-Allow-Methods": "POST, OPTIONS",
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
      { error: "Failed to track event" },
      { status: 500 }
    );
  }
}

export async function OPTIONS() {
  return NextResponse.json(
    {},
    {
      headers: {
        "Access-Control-Allow-Origin": "*",
        "Access-Control-Allow-Methods": "POST, OPTIONS",
        "Access-Control-Allow-Headers": "Content-Type",
      },
    }
  );
}

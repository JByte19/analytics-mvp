"use client";

import { useEffect, useState } from "react";

export default function StatsCard() {
  const [stats, setStats] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    async function fetchStats() {
      try {
        const res = await fetch("/api/stats");
        const data = await res.json();
        setStats(data);
      } catch (err) {
        setError(err.message || "Failed to load stats");
      } finally {
        setLoading(false);
      }
    }

    fetchStats();
  }, []);

  if (loading) return <p>Loading stats...</p>;
  if (error) return <p style={{ color: "red" }}>{error}</p>;
  if (!stats) return <p>No data</p>;

  return (
    <div style={{ marginTop: "20px" }}>
      <h2>Dashboard Stats</h2>
      <div
        style={{
          display: "grid",
          gridTemplateColumns: "repeat(3, 1fr)",
          gap: "16px",
          marginBottom: "20px",
        }}
      >
        <div
          style={{
            padding: "16px",
            border: "1px solid #ccc",
            borderRadius: "8px",
            backgroundColor: "#f9f9f9",
          }}
        >
          <p style={{ fontSize: "12px", color: "#666", margin: 0 }}>
            Total Events
          </p>
          <p
            style={{
              fontSize: "24px",
              fontWeight: "bold",
              margin: "4px 0 0 0",
            }}
          >
            {stats.totalEvents}
          </p>
        </div>

        <div
          style={{
            padding: "16px",
            border: "1px solid #ccc",
            borderRadius: "8px",
            backgroundColor: "#f9f9f9",
          }}
        >
          <p style={{ fontSize: "12px", color: "#666", margin: 0 }}>
            Days with Events
          </p>
          <p
            style={{
              fontSize: "24px",
              fontWeight: "bold",
              margin: "4px 0 0 0",
            }}
          >
            {stats.dailyEvents.length}
          </p>
        </div>

        <div
          style={{
            padding: "16px",
            border: "1px solid #ccc",
            borderRadius: "8px",
            backgroundColor: "#f9f9f9",
          }}
        >
          <p style={{ fontSize: "12px", color: "#666", margin: 0 }}>
            Event Types
          </p>
          <p
            style={{
              fontSize: "24px",
              fontWeight: "bold",
              margin: "4px 0 0 0",
            }}
          >
            {stats.topEvents.length}
          </p>
        </div>
      </div>

      <h3>Top Events</h3>
      <table border="1" style={{ width: "100%" }}>
        <thead>
          <tr style={{ backgroundColor: "#f0f0f0" }}>
            <th>Event Name</th>
            <th>Count</th>
          </tr>
        </thead>
        <tbody>
          {stats.topEvents.map((event, idx) => (
            <tr key={idx}>
              <td>{event.event_name}</td>
              <td>{event.count}</td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}

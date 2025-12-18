"use client";

import { useSession, signOut } from "next-auth/react";
import { useRouter } from "next/navigation";
import { useEffect } from "react";

import StatsCard from "../components/StatsCard";
import SDKSnippet from "../components/SDKSnippet";

export default function Dashboard() {
  const { data: session, status } = useSession();
  const router = useRouter();

  useEffect(() => {
    if (status === "loading") return;
    if (!session) {
      router.push("/login");
    }
  }, [session, status, router]);

  if (status === "loading") {
    return (
      <div
        style={{
          display: "flex",
          justifyContent: "center",
          alignItems: "center",
          minHeight: "100vh",
        }}
      >
        <p>Loading...</p>
      </div>
    );
  }

  if (!session) return null;

  return (
    <main
      style={{
        padding: "24px",
        fontFamily: "Arial",
        maxWidth: "1200px",
        margin: "0 auto",
      }}
    >
      {/* HEADER */}
      <div
        style={{
          display: "flex",
          justifyContent: "space-between",
          alignItems: "center",
          marginBottom: "24px",
        }}
      >
        <div>
          <h1>📊 Analytics Dashboard</h1>
          <p style={{ margin: "8px 0", color: "#666" }}>
            Welcome back, {session.user?.email || "User"}!
          </p>
        </div>

        <button
          onClick={() => signOut({ callbackUrl: "/login" })}
          style={{
            padding: "10px 20px",
            backgroundColor: "#dc3545",
            color: "white",
            border: "none",
            borderRadius: "4px",
            cursor: "pointer",
            fontSize: "14px",
          }}
        >
          Sign Out
        </button>
      </div>

      <p>Track events from your website in real-time.</p>

      {/* STATS */}
      <StatsCard />

      {/* SDK SNIPPET */}
      <SDKSnippet />

      {/* API INFO */}
      <div style={{ marginTop: "40px" }}>
        <h3>API Information</h3>

        <div
          style={{
            padding: "20px",
            backgroundColor: "#f9f9f9",
            borderRadius: "8px",
            border: "1px solid #ddd",
          }}
        >
          <p>
            <strong>Tracking Endpoint:</strong>
          </p>

          <code
            style={{
              display: "block",
              padding: "12px",
              backgroundColor: "#2d2d2d",
              color: "#f8f8f2",
              borderRadius: "4px",
              marginTop: "8px",
            }}
          >
            POST http://localhost:3000/api/track
          </code>

          <p style={{ marginTop: "16px" }}>
            <strong>Example Request:</strong>
          </p>

          <pre
            style={{
              padding: "12px",
              backgroundColor: "#2d2d2d",
              color: "#f8f8f2",
              borderRadius: "4px",
              overflow: "auto",
              fontSize: "13px",
            }}
          >
{`{
  "eventName": "button_click",
  "userId": "user123",
  "properties": {
    "page": "homepage",
    "button": "signup"
  }
}`}
          </pre>
        </div>
      </div>
    </main>
  );
}

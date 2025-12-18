"use client";

import { useEffect } from "react";

export default function TestSite() {
  useEffect(() => {
    const script = document.createElement("script");
    script.innerHTML = `
(function() {
  const API_URL = '/api/track';

  function getUserId() {
    let userId = localStorage.getItem('__analytics_user_id');
    if (!userId) {
      userId = 'user_' + Math.random().toString(36).substr(2, 9);
      localStorage.setItem('__analytics_user_id', userId);
    }
    return userId;
  }

  window.analytics = {
    track: async function(eventName, properties = {}) {
      try {
        console.log('Tracking:', eventName, properties);

        const payload = {
          eventName: eventName,
          userId: getUserId(),
          properties: properties
        };

        const response = await fetch(API_URL, {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify(payload)
        });

        const data = await response.json();
        console.log('Response:', data);
      } catch (error) {
        console.error('Analytics error:', error);
      }
    },

    pageView: function() {
      this.track('page_view', {
        title: document.title,
        url: window.location.href
      });
    }
  };

  window.analytics.pageView();
})();
    `;
    document.body.appendChild(script);
  }, []);

  const handleClick = () => {
    if (window.analytics) {
      window.analytics.track("test_button_clicked", { test: true });
      alert("✓ Event tracked! Check your dashboard.");
    }
  };

  const handleFormClick = () => {
    if (window.analytics) {
      window.analytics.track("form_test", { section: "test" });
      alert("✓ Form event tracked!");
    }
  };

  return (
    <div
      style={{
        padding: "40px",
        fontFamily: "Arial",
        maxWidth: "800px",
        margin: "0 auto",
      }}
    >
      <h1>🧪 Test Analytics Site</h1>
      <p>This is a test website to verify that analytics SDK works.</p>

      <div style={{ marginBottom: "20px" }}>
        <button onClick={handleClick}>Click to Track Event</button>
        <button onClick={handleFormClick}>Track Form Event</button>
      </div>

      <div
        style={{
          marginTop: "30px",
          padding: "20px",
          backgroundColor: "#f5f5f5",
        }}
      >
        <h3>📊 How to Test</h3>
        <ol>
          <li>Click the buttons above</li>
          <li>Open DevTools</li>
          <li>
            Go to <b>Network</b>
          </li>
          <li>
            See POST requests to <code>/api/track</code>
          </li>
          <li>Dashboard updates ✅</li>
        </ol>
      </div>
    </div>
  );
}

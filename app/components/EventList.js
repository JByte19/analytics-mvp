export default function EventList() {
  const events = [
    { id: 1, name: "Page View", timestamp: "2025-12-15 10:00" },
    { id: 2, name: "Button Click", timestamp: "2025-12-15 10:05" },
  ];

  return (
    <div>
      <h2>Recent Events</h2>
      <table border="1" style={{ width: "100%", marginTop: "12px" }}>
        <thead>
          <tr style={{ backgroundColor: "#f0f0f0" }}>
            <th>Event</th>
            <th>Time</th>
          </tr>
        </thead>
        <tbody>
          {events.map((event) => (
            <tr key={event.id}>
              <td>{event.name}</td>
              <td>{event.timestamp}</td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}

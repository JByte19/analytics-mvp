import EventList from "./components/EventList";

export default function Home() {
  return (
    <main
      style={{
        padding: "24px",
        fontFamily: "Arial",
        maxWidth: "1200px",
        margin: "0 auto",
      }}
    >
      <h1>📊 Analytics Dashboard</h1>
      <p>Welcome to your analytics platform!</p>
      <p>Track events from your website in real-time.</p>
      <EventList />
    </main>
  );
}

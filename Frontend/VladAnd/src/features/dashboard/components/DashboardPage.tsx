import './dashboard.css';

export function DashboardPage() {
  // The dashboard remains a UI scaffold until a backend endpoint is implemented.
  return (
    <main className="dashboard-page">
      <h1>EduPlatform Dashboard</h1>
      <h2>Welcome back!</h2>
      <section className="dashboard-stats" aria-label="Overview">
        <p>📚 New tasks: 0</p>
        <p>💬 Unread messages: 0</p>
        <p>⏰ Upcoming deadlines: 0</p>
      </section>
    </main>
  );
}

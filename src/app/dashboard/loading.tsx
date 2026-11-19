export default function DashboardLoading() {
  return <div role="status" aria-label="Loading dashboard"><div className="stats-grid">{[0, 1, 2].map(index => <div className="stats-card stats-skeleton" key={index} aria-hidden="true"><div className="skeleton skeleton-line" /></div>)}</div><span className="sr-only">Loading your dashboard…</span></div>;
}

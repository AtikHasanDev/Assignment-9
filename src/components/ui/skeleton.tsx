export function ServiceGridSkeleton() {
  return <div role="status" aria-label="Loading services" className="service-grid">
    {Array.from({ length: 6 }, (_, index) => <div className="skeleton-card" aria-hidden="true" key={index}><div className="skeleton skeleton-image" /><div className="skeleton skeleton-line" /><div className="skeleton skeleton-line short" /></div>)}
    <span className="sr-only">Loading services…</span>
  </div>;
}


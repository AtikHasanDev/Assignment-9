export type ChartItem = { status: string; label: string; value: number };
export function StatusChart({ title, items }: { title: string; items: ChartItem[] }) {
  const maximum = Math.max(1, ...items.map(item => item.value));
  const total = items.reduce((sum, item) => sum + item.value, 0);
  return <section className="dashboard-chart"><h2>{title}</h2><p>{total ? 'A live breakdown of the current records.' : 'Your activity will appear here when records are available.'}</p><dl className="status-bars">{items.map(item => <div className="status-bar-row" key={item.status}><dt>{item.label}</dt><dd><span className="bar-track" aria-hidden="true"><span className={'bar-fill bar-fill--' + item.status} style={{ width: (item.value / maximum * 100) + '%' }} /></span><strong>{item.value}</strong></dd></div>)}</dl></section>;
}

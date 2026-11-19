import { ClipboardList, Wrench, CircleCheck } from 'lucide-react';
const icons = [ClipboardList, Wrench, CircleCheck];
export function StatsCard({ label, value, index }: { label: string; value: number; index: number }) {
  const Icon = icons[index % icons.length];
  return <article className="stats-card"><div><p>{label}</p><strong>{new Intl.NumberFormat('en-US').format(value)}</strong></div><span><Icon size={23} aria-hidden="true" /></span></article>;
}

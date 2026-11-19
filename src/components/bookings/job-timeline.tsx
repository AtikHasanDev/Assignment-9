import { Check } from 'lucide-react';

export type HistoryEntry = { status: string; changedAt: string };
const steps = [ ['requested', 'Requested'], ['accepted', 'Accepted'], ['in-progress', 'In progress'], ['completed', 'Completed'], ['paid', 'Paid'] ];
export function JobTimeline({ status, paymentStatus, history = [] }: { status: string; paymentStatus: string; history?: HistoryEntry[] }) {
  const terminal = status === 'cancelled' || status === 'rejected';
  const current = paymentStatus === 'paid' ? 4 : steps.findIndex(([key]) => key === status);
  const format = (value: string) => {
    const date = new Date(value);
    return Number.isFinite(date.getTime()) ? new Intl.DateTimeFormat('en-GB', { dateStyle: 'medium', timeStyle: 'short', timeZone: 'Asia/Dhaka' }).format(date) + ' (Dhaka)' : '';
  };
  if (terminal) {
    const event = history.findLast(entry => entry.status === status);
    return <p className="job-terminal">{status === 'cancelled' ? 'You cancelled this request.' : 'The technician declined this request.'}{event && <span>{format(event.changedAt)}</span>}</p>;
  }
  return <ol className="job-timeline" aria-label="Repair progress">{steps.map(([key, label], index) => {
    const event = history.findLast(entry => entry.status === key);
    return <li key={key} className={index <= current ? 'step-reached' : ''} aria-current={index === current ? 'step' : undefined}><span className="timeline-marker" aria-hidden="true">{index < current ? <Check size={14} /> : index + 1}</span><div><strong>{label}</strong>{event && <time dateTime={event.changedAt}>{format(event.changedAt)}</time>}{index === current && <span className="sr-only">Current stage</span>}</div></li>;
  })}</ol>;
}

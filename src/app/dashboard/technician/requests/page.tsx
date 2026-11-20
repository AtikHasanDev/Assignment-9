'use client';
import { ProblemPhoto } from '@/components/bookings/problem-photo';
import '@/app/requests.css';
import { useEffect, useState } from 'react';
import Link from 'next/link';
import { authenticatedApiRequest, ApiError } from '@/lib/api';
import { useToast } from '@/components/ui/toast-provider';
import { StatusBadge } from '@/components/ui/status-badge';
import type { Status } from '@/components/ui/status-badge';
import { Button } from '@/components/ui/button';
import { EmptyState } from '@/components/ui/empty-state';
import { ConfirmationDialog } from '@/components/ui/confirmation-dialog';
import { CompleteJobDialog } from '@/components/bookings/complete-job-dialog';
import { JobTimeline } from '@/components/bookings/job-timeline';
import type { HistoryEntry } from '@/components/bookings/job-timeline';

type Job = { _id: string; serviceTitle: string; customerName: string; customerPhone: string; address: string; preferredDate: string; problemDescription: string; problemImage?: string; basePrice: number; finalAmount: number; status: Status; paymentStatus: 'unpaid' | 'paid'; statusHistory: HistoryEntry[] };
const filters = [['all', 'All requests'], ['requested', 'Requested'], ['accepted', 'Accepted'], ['in-progress', 'In progress'], ['completed', 'Completed'], ['rejected', 'Rejected'], ['cancelled', 'Cancelled']];
export default function TechnicianRequests() {
  const notify = useToast();
  const [items, setItems] = useState<Job[]>([]);
  const [filter, setFilter] = useState('all');
  const [attempt, setAttempt] = useState(0);
  const [loading, setLoading] = useState(true);
  const [failure, setFailure] = useState('');
  const [busy, setBusy] = useState(false);
  const [rejecting, setRejecting] = useState<Job | null>(null);
  const [completing, setCompleting] = useState<Job | null>(null);
  useEffect(() => {
    let active = true; setLoading(true); setFailure('');
    authenticatedApiRequest<{ items: Job[] }>('/api/bookings/technician?status=' + filter).then(data => { if (active) setItems(data.items); }).catch(error => { if (active) setFailure(error.message || 'Could not load repair requests.'); }).finally(() => { if (active) setLoading(false); });
    return () => { active = false; };
  }, [filter, attempt]);
  async function update(job: Job, status: string, finalAmount?: number) {
    if (busy) return; setBusy(true);
    try {
      await authenticatedApiRequest('/api/bookings/' + job._id + '/status', { method: 'PATCH', body: JSON.stringify({ status, ...(finalAmount !== undefined ? { finalAmount } : {}) }) });
      notify(status === 'completed' ? 'Repair completed. The customer can now pay.' : 'Job status updated.');
      setRejecting(null); setCompleting(null); setAttempt(value => value + 1);
    } catch (error) {
      notify(error instanceof Error ? error.message : 'Could not update this job.', 'error');
      if (error instanceof ApiError && [404, 409].includes(error.status)) { setRejecting(null); setCompleting(null); setAttempt(value => value + 1); }
    } finally { setBusy(false); }
  }
  return <section><div className="dashboard-page-heading"><div><p className="eyebrow">YOUR REPAIR QUEUE</p><h1>Manage requests</h1><p>Review the problem, keep the customer informed, and move each repair forward.</p></div><Button variant="secondary" disabled={busy || loading} onClick={() => setAttempt(value => value + 1)}>Refresh requests</Button></div><label className="queue-filter" htmlFor="queue-status">Filter by status<select id="queue-status" value={filter} onChange={event => setFilter(event.target.value)} disabled={busy}>{filters.map(([value, label]) => <option key={value} value={value}>{label}</option>)}</select></label>
    {loading ? <p role="status">Loading repair requests…</p> : failure ? <div className="dashboard-error" role="alert"><p>{failure}</p><Button onClick={() => setAttempt(value => value + 1)}>Try again</Button></div> : !items.length ? <EmptyState title="Your queue is clear" description={filter === 'all' ? 'Repair requests for your services will appear here.' : 'No requests match this status. Choose another filter to see more.'} action={filter !== 'all' ? <Button variant="secondary" onClick={() => setFilter('all')}>Show all requests</Button> : <Link className="button" href="/dashboard/technician">Back to overview</Link>} /> : <div className="technician-requests">{items.map(job => <article className="technician-job" key={job._id}><div className="job-header"><div><h2>{job.serviceTitle}</h2><p>{job.customerName}</p></div><div><StatusBadge status={job.status} /> {job.status === 'completed' && <StatusBadge status={job.paymentStatus} />}</div></div><dl className="job-contact"><div><dt>Phone</dt><dd>{job.customerPhone}</dd></div><div><dt>Preferred date</dt><dd>{new Intl.DateTimeFormat('en-GB', { dateStyle: 'medium', timeZone: 'UTC' }).format(new Date(job.preferredDate))}</dd></div><div><dt>Address</dt><dd>{job.address}</dd></div><div><dt>{job.status === 'completed' ? 'Final amount' : 'Starting price'}</dt><dd>{new Intl.NumberFormat('en-US', { style: 'currency', currency: 'USD' }).format(job.status === 'completed' ? job.finalAmount : job.basePrice)}</dd></div></dl><div className="job-problem"><h3>Problem description</h3><p>{job.problemDescription}</p><ProblemPhoto src={job.problemImage} /></div><details className="booking-progress"><summary>View job timeline</summary><JobTimeline status={job.status} paymentStatus={job.paymentStatus} history={job.statusHistory} /></details><div className="job-controls">{job.status === 'requested' && <><Button disabled={busy} onClick={() => update(job, 'accepted')}>Accept request</Button><Button variant="danger" disabled={busy} onClick={() => setRejecting(job)}>Reject request</Button></>}{job.status === 'accepted' && <Button disabled={busy} onClick={() => update(job, 'in-progress')}>Start work</Button>}{job.status === 'in-progress' && <Button disabled={busy} onClick={() => setCompleting(job)}>Mark completed</Button>}</div></article>)}</div>}
    <ConfirmationDialog open={!!rejecting} title="Reject this repair request?" description={rejecting ? 'Reject ' + rejecting.customerName + '’s request for ' + rejecting.serviceTitle + '? This cannot be undone.' : ''} confirmLabel="Reject request" cancelLabel="Keep request" busyLabel="Rejecting…" busy={busy} onConfirm={() => { if (rejecting) update(rejecting, 'rejected'); }} onCancel={() => setRejecting(null)} />
    <CompleteJobDialog job={completing} busy={busy} onComplete={amount => { if (completing) update(completing, 'completed', amount); }} onCancel={() => setCompleting(null)} />
  </section>;
}

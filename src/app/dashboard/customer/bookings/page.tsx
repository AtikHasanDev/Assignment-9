'use client';
import { RecordTable, RecordIdentity } from '@/components/ui/record-table';
import { ProblemPhoto } from '@/components/bookings/problem-photo';
import Link from 'next/link';
import { useEffect, useState } from 'react';
import { authenticatedApiRequest } from '@/lib/api';
import { StatusBadge } from '@/components/ui/status-badge';
import type { Status } from '@/components/ui/status-badge';
import { EmptyState } from '@/components/ui/empty-state';
import { ConfirmationDialog } from '@/components/ui/confirmation-dialog';
import { JobTimeline } from '@/components/bookings/job-timeline';
import type { HistoryEntry } from '@/components/bookings/job-timeline';
import { useToast } from '@/components/ui/toast-provider';
import { Button } from '@/components/ui/button';

type Booking = { _id: string; serviceTitle: string; serviceImage: string; problemImage?: string; technicianName: string; preferredDate: string; basePrice: number; finalAmount: number; status: Status; paymentStatus: 'paid' | 'unpaid'; statusHistory?: HistoryEntry[] };
export default function MyBookings() {
  const notify = useToast();
  const [selected, setSelected] = useState<Booking | null>(null);
  const [busy, setBusy] = useState(false);
  const [items, setItems] = useState<Booking[]>([]);
  const [loading, setLoading] = useState(true);
  const [failure, setFailure] = useState('');
  const [attempt, setAttempt] = useState(0);
  useEffect(() => {
    let active = true;
    setLoading(true); setFailure('');
    authenticatedApiRequest<{ items: Booking[] }>('/api/bookings/my').then(data => { if (active) setItems(data.items); }).catch(error => { if (active) setFailure(error.message || 'Could not load bookings.'); }).finally(() => { if (active) setLoading(false); });
    return () => { active = false; };
  }, [attempt]);
  async function cancelRequest() {
    if (!selected || busy) return;
    setBusy(true);
    try {
      await authenticatedApiRequest('/api/bookings/' + selected._id + '/cancel', { method: 'PATCH' });
      notify('Your repair request has been cancelled.');
      setSelected(null); setAttempt(value => value + 1);
    } catch (error) {
      notify(error instanceof Error ? error.message : 'Cancellation failed. Please try again.', 'error');
      setSelected(null); setAttempt(value => value + 1);
    } finally { setBusy(false); }
  }
  async function pay(booking: Booking) {
    if (busy) return;
    setBusy(true);
    try {
      const { url } = await authenticatedApiRequest<{ url: string }>('/api/payments/checkout', { method: 'POST', body: JSON.stringify({ bookingId: booking._id }) });
      const target = new URL(url);
      if (target.origin !== 'https://checkout.stripe.com' || target.username || target.password) throw new Error('Checkout returned an invalid destination.');
      window.location.assign(target.href);
    } catch (error) {
      notify(error instanceof Error ? error.message : 'Could not start checkout.', 'error');
      setAttempt(value => value + 1);
      setBusy(false);
    }
  }
  return <section><p className="eyebrow">YOUR REPAIR REQUESTS</p><h1>My bookings</h1><p>Follow your repair requests from one place.</p>
    {loading ? <p role="status">Loading your bookings…</p> : failure ? <div role="alert"><p>{failure}</p><button className="button" onClick={() => setAttempt(attempt + 1)}>Try again</button></div> : items.length ? <RecordTable caption="Your repair bookings" columns={['Service', 'Technician', 'Preferred date', 'Base price', 'Final amount', 'Job status', 'Payment']} rows={items.map(item => ({ id: item._id, cells: [<RecordIdentity key="service" image={item.serviceImage} title={item.serviceTitle} />, item.technicianName, new Intl.DateTimeFormat('en-GB', { dateStyle: 'medium', timeZone: 'UTC' }).format(new Date(item.preferredDate)), <span key="base" className="record-money">{new Intl.NumberFormat('en-US', { style: 'currency', currency: 'USD' }).format(item.basePrice)}</span>, item.status === 'completed' ? new Intl.NumberFormat('en-US', { style: 'currency', currency: 'USD' }).format(item.finalAmount) : '—', <StatusBadge key="status" status={item.status} />, <StatusBadge key="payment" status={item.paymentStatus} />] }))}>{items.map(item => <article className="booking-card" key={item._id}>
      <div className="booking-summary"><img src={item.serviceImage} alt="" width={100} height={80} /><div><h2>{item.serviceTitle}</h2><p>{item.technicianName} · {new Intl.DateTimeFormat('en-GB', { dateStyle: 'medium', timeZone: 'UTC' }).format(new Date(item.preferredDate))}</p><StatusBadge status={item.status} /> <StatusBadge status={item.paymentStatus} /></div><div className="booking-price"><span>{item.status === 'completed' ? 'Final amount' : 'Starting price'}</span><strong>{new Intl.NumberFormat('en-US', { style: 'currency', currency: 'USD' }).format(item.status === 'completed' ? item.finalAmount : item.basePrice)}</strong></div></div>
      <div className="booking-actions"><details className="booking-progress"><summary>View repair details and progress</summary><ProblemPhoto src={item.problemImage} /><JobTimeline status={item.status} paymentStatus={item.paymentStatus} history={item.statusHistory} /></details>{item.status === 'requested' && <Button variant="secondary" disabled={busy} onClick={() => setSelected(item)}>Cancel request</Button>}{item.status === 'completed' && item.paymentStatus === 'unpaid' && <Button disabled={busy} onClick={() => pay(item)}>{busy ? 'Please wait…' : 'Pay with Stripe'}</Button>}</div>
    </article>)}</RecordTable> : <EmptyState title="Your first repair starts here" description="Explore our services and tell a technician what needs fixing." action={<Link className="button" href="/services">Find a repair</Link>} />}
    <ConfirmationDialog open={!!selected} title="Cancel this repair request?" description={selected ? 'Cancel your request for ' + selected.serviceTitle + '? This is only possible before the technician accepts it.' : ''} confirmLabel="Cancel request" busy={busy} onConfirm={cancelRequest} onCancel={() => setSelected(null)} />
  </section>;
}

'use client';
import Link from 'next/link';
import { useEffect, useState } from 'react';
import { authenticatedApiRequest } from '@/lib/api';
import { StatusBadge } from '@/components/ui/status-badge';
import type { Status } from '@/components/ui/status-badge';
import { EmptyState } from '@/components/ui/empty-state';

type Booking = { _id: string; serviceTitle: string; serviceImage: string; technicianName: string; preferredDate: string; basePrice: number; finalAmount: number; status: Status; paymentStatus: 'paid' | 'unpaid' };
export default function MyBookings() {
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
  return <section><p className="eyebrow">YOUR REPAIR REQUESTS</p><h1>My bookings</h1><p>Follow your repair requests from one place.</p>
    {loading ? <p role="status">Loading your bookings…</p> : failure ? <div role="alert"><p>{failure}</p><button className="button" onClick={() => setAttempt(attempt + 1)}>Try again</button></div> : items.length ? <div className="booking-list">{items.map(item => <article className="booking-summary" key={item._id}><img src={item.serviceImage} alt="" width={100} height={80} /><div><h2>{item.serviceTitle}</h2><p>{item.technicianName} · {new Intl.DateTimeFormat('en-GB', { dateStyle: 'medium', timeZone: 'UTC' }).format(new Date(item.preferredDate))}</p><StatusBadge status={item.status} /> <StatusBadge status={item.paymentStatus} /></div><strong>{new Intl.NumberFormat('en-US', { style: 'currency', currency: 'USD' }).format(item.status === 'completed' ? item.finalAmount : item.basePrice)}</strong></article>)}</div> : <EmptyState title="Your first repair starts here" description="Explore our services and tell a technician what needs fixing." action={<Link className="button" href="/services">Find a repair</Link>} />}
  </section>;
}

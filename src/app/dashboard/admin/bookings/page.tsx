'use client';
import { ProblemPhoto } from '@/components/bookings/problem-photo';
import { useState } from 'react';
import { useAdminList } from '@/components/admin/use-admin-list';
import { AdminPagination } from '@/components/admin/pagination';
import { JobTimeline } from '@/components/bookings/job-timeline';
import type { HistoryEntry } from '@/components/bookings/job-timeline';
import { StatusBadge } from '@/components/ui/status-badge';
import type { Status } from '@/components/ui/status-badge';
import { Button } from '@/components/ui/button';
import { EmptyState } from '@/components/ui/empty-state';
import '@/app/admin.css';

type Booking = { _id: string; serviceTitle: string; category: string; customerName: string; customerEmail: string; customerPhone: string; technicianName: string; technicianEmail: string; address: string; preferredDate: string; problemDescription: string; problemImage?: string; basePrice: number; finalAmount: number; status: Status; paymentStatus: 'paid' | 'unpaid'; statusHistory: HistoryEntry[]; createdAt: string };
const statuses = [['all', 'All statuses'], ['requested', 'Requested'], ['accepted', 'Accepted'], ['in-progress', 'In progress'], ['completed', 'Completed'], ['rejected', 'Rejected'], ['cancelled', 'Cancelled']];
const money = (value: number) => new Intl.NumberFormat('en-US', { style: 'currency', currency: 'USD' }).format(value);
function date(value: string, time = false) {
  const parsed = new Date(value);
  if (!Number.isFinite(parsed.getTime())) return 'Not provided';
  return new Intl.DateTimeFormat('en-GB', { dateStyle: 'medium', ...(time ? { timeStyle: 'short' as const } : {}), timeZone: time ? 'Asia/Dhaka' : 'UTC' }).format(parsed) + (time ? ' (Dhaka)' : '');
}
export default function AdminBookingsPage() {
  const [status, setStatus] = useState('all');
  const [paymentStatus, setPaymentStatus] = useState('all');
  const list = useAdminList<Booking>('bookings', '&status=' + status + '&paymentStatus=' + paymentStatus);
  return <section><div className="dashboard-page-heading"><div><p className="eyebrow">PLATFORM ACTIVITY</p><h1>All bookings</h1><p>Monitor repair requests, progress, and payment status across the platform. Job actions remain with the customer and assigned technician.</p></div><Button variant="secondary" disabled={list.loading} onClick={list.refresh}>Refresh bookings</Button></div>
    <div className="admin-booking-filters"><label className="admin-filter" htmlFor="booking-status">Job status<select id="booking-status" value={status} onChange={event => { setStatus(event.target.value); list.setPage(1); }}>{statuses.map(([value, label]) => <option key={value} value={value}>{label}</option>)}</select></label><label className="admin-filter" htmlFor="booking-payment">Payment status<select id="booking-payment" value={paymentStatus} onChange={event => { setPaymentStatus(event.target.value); list.setPage(1); }}><option value="all">All payments</option><option value="unpaid">Unpaid</option><option value="paid">Paid</option></select></label></div>
    {list.loading ? <p role="status">Loading bookings…</p> : list.failure ? <div role="alert" className="dashboard-error"><p>{list.failure}</p><Button onClick={list.refresh}>Try again</Button></div> : !list.items.length ? <EmptyState title="No matching bookings" description="Bookings will appear here when customers request services. Try another filter to see more." /> : <><div className="admin-bookings">{list.items.map(booking => <article className="admin-booking" key={booking._id}><div className="admin-booking-heading"><div><h2>{booking.serviceTitle}</h2><p>{booking.category} · Booked {date(booking.createdAt, true)}</p></div><div className="admin-service-labels"><StatusBadge status={booking.status} /><StatusBadge status={booking.paymentStatus} /></div></div><dl className="admin-booking-summary"><div><dt>Customer</dt><dd>{booking.customerName}<span>{booking.customerEmail}</span></dd></div><div><dt>Technician</dt><dd>{booking.technicianName}<span>{booking.technicianEmail}</span></dd></div><div><dt>Preferred date</dt><dd>{date(booking.preferredDate)}</dd></div><div><dt>{booking.status === 'completed' ? 'Final amount' : 'Starting estimate'}</dt><dd>{money(booking.status === 'completed' ? booking.finalAmount : booking.basePrice)}</dd></div></dl><details className="admin-booking-details"><summary>View request details and timeline</summary><p className="admin-booking-id">Booking ID: {booking._id}</p><dl className="admin-booking-summary"><div><dt>Contact phone</dt><dd>{booking.customerPhone}</dd></div><div><dt>Address</dt><dd>{booking.address}</dd></div></dl><h3>Reported problem</h3><p className="admin-service-description">{booking.problemDescription}</p><ProblemPhoto src={booking.problemImage} /><JobTimeline status={booking.status} paymentStatus={booking.paymentStatus} history={booking.statusHistory} /></details></article>)}</div><AdminPagination page={list.page} totalPages={list.totalPages} total={list.total} disabled={list.loading} onChange={list.setPage} /></>}
  </section>;
}

'use client';
import Link from 'next/link';
import { usePaginatedList } from '@/lib/use-paginated-list';
import { AdminPagination } from '@/components/admin/pagination';
import { Button } from '@/components/ui/button';
import { EmptyState } from '@/components/ui/empty-state';
import { StatusBadge } from '@/components/ui/status-badge';
import '@/app/payment-history.css';
import '@/app/admin.css';

type Payment = { _id: string; bookingId: string; serviceTitle: string; transactionId: string; amount: number; currency: string; paidAt: string; customerEmail: string; technicianEmail: string; customerName?: string; technicianName?: string };
function paidDate(value: string) {
  const date = new Date(value);
  return Number.isFinite(date.getTime()) ? new Intl.DateTimeFormat('en-GB', { dateStyle: 'medium', timeStyle: 'short', timeZone: 'Asia/Dhaka' }).format(date) + ' (Dhaka)' : 'Not provided';
}
export function PaymentHistory({ administrator = false }: { administrator?: boolean }) {
  const list = usePaginatedList<Payment>(administrator ? '/api/admin/transactions' : '/api/payments/my');
  return <section><div className="dashboard-page-heading"><div><p className="eyebrow">{administrator ? 'PLATFORM PAYMENTS' : 'YOUR PAYMENT RECORDS'}</p><h1>{administrator ? 'Transactions' : 'Payment history'}</h1><p>{administrator ? 'Review confirmed repair payments across the platform.' : 'View your confirmed repair payments and transaction references.'} Dates are shown in Dhaka time.</p></div><Button variant="secondary" disabled={list.loading} onClick={list.refresh}>Refresh payments</Button></div>
    {administrator && !list.loading && !list.failure && <div className="admin-revenue"><p>Total revenue · all confirmed payments</p><strong>{new Intl.NumberFormat('en-US', { style: 'currency', currency: 'USD' }).format(list.totalRevenue)}</strong></div>}
    {list.loading ? <p role="status">Loading payments…</p> : list.failure ? <div className="dashboard-error" role="alert"><p>{list.failure}</p><Button onClick={list.refresh}>Try again</Button></div> : !list.items.length ? <EmptyState title={administrator ? 'No confirmed payments yet' : 'Your payment history is clear'} description="Confirmed payments will appear here after a completed repair is paid and verified." action={<Link className="button" href={administrator ? '/dashboard/admin/bookings' : '/dashboard/customer/bookings'}>View bookings</Link>} /> : <><div className="payment-history">{list.items.map(payment => <article className="payment-record" key={payment._id}><div className="payment-record-heading"><div><h2>{payment.serviceTitle}</h2><time dateTime={payment.paidAt}>{paidDate(payment.paidAt)}</time></div><div className="payment-record-amount"><strong>{new Intl.NumberFormat('en-US', { style: 'currency', currency: payment.currency.toUpperCase() }).format(payment.amount)}</strong><StatusBadge status="paid" /></div></div><dl><div><dt>Transaction ID</dt><dd>{payment.transactionId}</dd></div><div><dt>Booking ID</dt><dd>{payment.bookingId}</dd></div>{administrator && <div><dt>Customer</dt><dd>{payment.customerName || payment.customerEmail}{payment.customerName && <span>{payment.customerEmail}</span>}</dd></div>}<div><dt>Technician</dt><dd>{payment.technicianName || payment.technicianEmail}{payment.technicianName && <span>{payment.technicianEmail}</span>}</dd></div></dl></article>)}</div><AdminPagination page={list.page} totalPages={list.totalPages} total={list.total} disabled={list.loading} onChange={list.setPage} /></>}
  </section>;
}

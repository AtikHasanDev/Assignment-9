import Link from 'next/link';

export default function PaymentCancelledPage() {
  return <section><p className="eyebrow">CHECKOUT CLOSED</p><h1>Payment not completed</h1><p>You returned from checkout without completing this attempt. Your bookings show the latest confirmed payment status, and you can resume checkout there.</p><Link className="button" href="/dashboard/customer/bookings">Back to my bookings</Link></section>;
}

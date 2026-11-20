'use client';
import { useEffect, useState } from 'react';
import Link from 'next/link';
import { authenticatedApiRequest } from '@/lib/api';
import { Button } from '@/components/ui/button';

type Receipt = { paid: boolean; bookingId: string; amount?: number; transactionId?: string };
export function VerifyPayment({ sessionId }: { sessionId: string }) {
  const [result, setResult] = useState<Receipt | null>(null);
  const [failure, setFailure] = useState('');
  const [busy, setBusy] = useState(true);
  const [attempt, setAttempt] = useState(0);
  useEffect(() => {
    let active = true;
    setBusy(true); setFailure('');
    if (!/^cs_test_[A-Za-z0-9_]+$/.test(sessionId) || sessionId.length > 255) { setFailure('This return link has no valid checkout session.'); setBusy(false); return; }
    authenticatedApiRequest<Receipt>('/api/payments/verify', { method: 'POST', body: JSON.stringify({ sessionId }) })
      .then(data => { if (active) setResult(data); })
      .catch(error => { if (active) setFailure(error.message || 'Payment could not be verified.'); })
      .finally(() => { if (active) setBusy(false); });
    return () => { active = false; };
  }, [sessionId, attempt]);
  return <section><p className="eyebrow">PAYMENT STATUS</p><h1>{busy ? 'Checking payment' : result?.paid && !failure ? 'Payment confirmed' : 'Payment verification'}</h1>
    {busy ? <p role="status">Verifying your payment with Stripe…</p> : failure ? <div role="alert"><p>{failure}</p><Button onClick={() => setAttempt(value => value + 1)}>Try verification again</Button></div> : result?.paid ? <div className="dashboard-chart"><p role="status">Your completed repair has been marked as paid.</p><p>Amount: <strong>{new Intl.NumberFormat('en-US', { style: 'currency', currency: 'USD' }).format(result.amount || 0)}</strong></p><p className="payment-reference">Transaction: {result.transactionId}</p></div> : <div><p role="status">Stripe has not confirmed this payment yet. You can check again or return to your bookings.</p><Button onClick={() => setAttempt(value => value + 1)}>Check again</Button></div>}
    <p><Link className="button button--secondary" href="/dashboard/customer/bookings">Back to my bookings</Link></p>{result?.paid && !failure && !busy && <p><Link href="/dashboard/customer/payments">View payment history</Link></p>}
  </section>;
}

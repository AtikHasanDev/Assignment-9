import { VerifyPayment } from '@/components/payments/verify-payment';

export default async function PaymentSuccessPage({ searchParams }: { searchParams: Promise<{ session_id?: string | string[] }> }) {
  const params = await searchParams;
  return <VerifyPayment sessionId={typeof params.session_id === 'string' ? params.session_id : ''} />;
}

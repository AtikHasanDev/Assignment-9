import Link from 'next/link';
import { getFeaturedServices } from '@/lib/services';
import { ServiceCard } from './service-card';
import { EmptyState } from '@/components/ui/empty-state';

export async function FeaturedServices() {
  let page;
  try { page = await getFeaturedServices(); }
  catch { return <EmptyState title="Repairs are a moment away" description="We couldn’t load our services right now. Please try again shortly." action={<Link className="button button--secondary" href="/">Try again</Link>} />; }
  if (!page.items.length) return <EmptyState title="Our next fixes are on the way" description="Approved repair services will appear here as technicians join FixMate." action={<Link href="/sign-up" className="button button--secondary">Join as a technician</Link>} />;
  return <div className="service-grid">{page.items.map(service => <ServiceCard key={service._id} service={service} />)}</div>;
}

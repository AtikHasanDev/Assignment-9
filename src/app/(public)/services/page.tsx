import type { Metadata } from 'next';
import { EmptyState } from '@/components/ui/empty-state';
import { ButtonLink } from '@/components/ui/button';

export const metadata: Metadata = { title: 'Repair services' };

export default function ServicesPage() {
  return <div className="container page-section"><div className="page-heading"><p className="eyebrow">FIND YOUR FIX</p><h1>Care for every corner<br />of your everyday.</h1><p>Device and home appliance repair, with clear details and payment after completion.</p></div><EmptyState title="Our service directory is coming soon" description="We’re getting FixMate ready. You’ll be able to browse approved repair services here when the directory opens." action={<ButtonLink href="/about" variant="secondary">See how it works</ButtonLink>} /></div>;
}


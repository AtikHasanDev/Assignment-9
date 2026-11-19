import type { Metadata } from 'next';
import { Search, ClipboardList, Wrench, CreditCard } from 'lucide-react';
import { ButtonLink } from '@/components/ui/button';

export const metadata: Metadata = { title: 'How it works' };
const steps = [
  { icon: Search, title: 'Find your repair', text: 'Explore service details, starting prices, coverage areas, and the technician’s experience.' },
  { icon: ClipboardList, title: 'Send a request', text: 'Describe the problem, share your address, and choose a preferred date. The technician reviews your request.' },
  { icon: Wrench, title: 'Follow the work', text: 'See when your request is accepted, when work starts, and when the repair is complete.' },
  { icon: CreditCard, title: 'Pay after completion', text: 'Once the technician completes the job and sets the final amount, pay securely through Stripe Checkout.' },
];

export default function AboutPage() {
  return <div className="container page-section"><div className="page-heading"><p className="eyebrow">HOW FIXMATE WORKS</p><h1>A clear path from<br />broken to better.</h1><p>Finding a repair should be simple. Knowing what happens next should be even simpler.</p></div>
    <div className="steps-grid">{steps.map(({ icon: Icon, title, text }) => <article className="step-card" key={title}><Icon size={30} aria-hidden="true" /><h2>{title}</h2><p>{text}</p></article>)}</div>
    <section className="info-panel" id="payment"><div><p className="eyebrow">YOU STAY IN THE LOOP</p><h2>The work comes first.<br />The payment comes after.</h2><p>A starting price helps you compare services. Your technician sets the final amount when the job is complete. You can cancel while your request is still awaiting acceptance.</p></div><ButtonLink href="/services">Explore services</ButtonLink></section>
  </div>;
}


import { Wrench, ShieldCheck, ClipboardList, CreditCard } from 'lucide-react';
import Link from 'next/link';
import { Suspense } from 'react';
import { FeaturedServices } from '@/components/services/featured-services';
import { ServiceGridSkeleton } from '@/components/ui/skeleton';
import { categories } from '@/lib/constants';
import { HomeHero } from '@/components/services/home-hero';
import { ProfessionalInvitation } from '@/components/services/professional-invitation';

export default function Home() {
  return (
    <div className="site-shell">
      <div>
        <HomeHero />
        <section className="container featured-section"><div className="section-heading"><div><p className="eyebrow">A FRESH START, CLOSE TO HOME</p><h2>Find your next fix.</h2></div><Link className="button button--secondary" href="/services">All services</Link></div><Suspense fallback={<ServiceGridSkeleton />}><FeaturedServices /></Suspense></section>
        <section className="approach" id="our-approach">
          <div className="container">
            <p className="eyebrow">A BETTER WAY TO REPAIR</p>
            <h2>Less uncertainty. More peace of mind.</h2>
            <div className="feature-grid">
              <article><ShieldCheck size={27} /><h3>Know your service</h3><p>Explore repair details, technician profiles, and starting prices before sending a request.</p></article>
              <article><ClipboardList size={27} /><h3>Follow every step</h3><p>Track your job from the first request through acceptance, repair, and completion.</p></article>
              <article><CreditCard size={27} /><h3>Pay after completion</h3><p>Payment opens only after your technician completes the job and sets the final amount.</p></article>
            </div>
          </div>
        </section>
        <section className="container home-steps"><p className="eyebrow">LESS GUESSWORK. MORE CLARITY.</p><h2>Four steps. One less worry.</h2><div className="steps-grid">{[
          ['Find a service', 'Explore service details and starting prices.'], ['Send a request', 'Tell the technician what needs attention.'], ['Get it repaired', 'Follow the job from acceptance to completion.'], ['Pay when it’s done', 'Pay the final amount after the work is complete.'],
        ].map(([title, text]) => <article className="step-card" key={title}><Wrench size={24} aria-hidden="true" /><h3>{title}</h3><p>{text}</p></article>)}</div></section>
        <section className="category-section"><div className="container"><p className="eyebrow">FROM POCKET TO LIVING ROOM</p><h2>Everyday essentials. Expert attention.</h2><div className="category-grid">{categories.map(category => <Link href={'/services?category=' + encodeURIComponent(category)} key={category}><Wrench size={24} aria-hidden="true" /><span>{category}</span></Link>)}</div></div></section>
        <ProfessionalInvitation />
      </div>
    </div>
  );
}



import Link from 'next/link';
import { Search, Smartphone, Laptop, AirVent, Refrigerator, Tv, WashingMachine, PlugZap, Check, Wrench } from 'lucide-react';

const repairs = [
  { label: 'Smartphone', short: 'Phones', Icon: Smartphone },
  { label: 'Laptop & PC', short: 'Laptops & PCs', Icon: Laptop },
  { label: 'AC', short: 'Air conditioners', Icon: AirVent },
  { label: 'Refrigerator', short: 'Refrigerators', Icon: Refrigerator },
  { label: 'TV', short: 'Televisions', Icon: Tv },
  { label: 'Washing Machine', short: 'Washing machines', Icon: WashingMachine },
  { label: 'Electrical', short: 'Electrical', Icon: PlugZap },
];

export function HomeHero() {
  return <section className="repair-hero" aria-labelledby="repair-hero-title">
    <div className="hero-art hero-art-left" aria-hidden="true"><Wrench strokeWidth={1} /><span /></div>
    <div className="hero-art hero-art-right" aria-hidden="true"><span /><span /></div>
    <div className="container hero-center">
      <p className="hero-location">A LITTLE CARE. A LONGER LIFE.</p>
      <h1 id="repair-hero-title">Your things have<br />a <span>second life.</span></h1>
      <p className="hero-subtitle">Find the right repair. Follow every step. Pay when it’s fixed.</p>
      <form action="/services" className="hero-search" role="search">
        <label className="sr-only" htmlFor="home-repair-search">What needs fixing?</label>
        <Search size={22} aria-hidden="true" />
        <input className="d-input" id="home-repair-search" type="search" name="search" placeholder="What needs fixing? Try laptop or AC" maxLength={100} />
        <button className="d-btn d-btn-primary" type="submit" aria-label="Find a repair"><span>Find a repair</span><Search size={21} aria-hidden="true" /></button>
      </form>
      <div className="hero-assurances"><span><Check size={15} />Approved listings</span><span><Check size={15} />Clear job tracking</span><span><Check size={15} />Pay after repair</span></div>
      <nav className="repair-category-rail" aria-label="Find a repair by category">{repairs.map(({ label, short, Icon }) => <Link key={label} href={'/services?category=' + encodeURIComponent(label)}><span><Icon size={30} strokeWidth={1.5} aria-hidden="true" /></span>{short}</Link>)}</nav>
      <div className="hero-popular"><span>Popular fixes</span><Link className="d-badge d-badge-outline" href="/services?search=screen">Cracked screen</Link><Link className="d-badge d-badge-outline" href="/services?category=AC">AC not cooling</Link><Link className="d-badge d-badge-outline" href="/services?category=Laptop%20%26%20PC">Slow laptop</Link><Link className="d-badge d-badge-outline" href="/services">Explore all repairs</Link></div>
      <div className="repair-feature">
        <div className="repair-feature-copy"><span className="feature-kicker"><Wrench size={16} />REPAIR OVER REPLACE</span><h2>Back to working.<br />Back to everyday.</h2><p>For the laptop with all your work on it. The AC you can’t do summer without. Find a little expert help for the things that matter.</p><Link className="d-btn d-btn-secondary" href="/services">Explore repair services</Link></div>
        <div className="repair-feature-photo"><img src="/images/repair-workbench.jpg" alt="Close-up of careful hands servicing the inside of a laptop" fetchPriority="high" width={1400} height={934} /><span><Check size={17} />Good things are worth fixing.</span></div>
      </div>
    </div>
  </section>;
}

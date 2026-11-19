import Link from 'next/link';
import { Brand } from './brand';
import { categories, publicLinks } from '@/lib/constants';

export function Footer() {
  return <footer className="footer-wrap"><div className="container footer-grid">
    <div className="footer-intro"><Brand /><p>A little care. A longer life.<br />Repair services for the things you rely on.</p><Link href="/about#payment">Pay after the work is complete.</Link></div>
    <nav aria-label="Footer navigation"><h2>Explore FixMate</h2>{publicLinks.map(link => <Link href={link.href} key={link.href}>{link.label}</Link>)}</nav>
    <nav aria-label="Repair categories"><h2>Popular repairs</h2>{categories.map(category => <Link key={category} href={'/services?category=' + encodeURIComponent(category)}>{category}</Link>)}</nav>
    <div><h2>Here to help</h2><p>Serving Dhaka, Bangladesh.</p><p>Contact and social channels will be listed when FixMate launches.</p><Link href="/about">Understand the repair process</Link></div>
  </div><div className="container footer-bottom"><span>© {new Date().getFullYear()} FixMate. All rights reserved.</span><span>Repair. Reuse. Repeat.</span></div></footer>;
}


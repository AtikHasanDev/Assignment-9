import Link from 'next/link';
import { Brand } from './brand';
import { categories, publicLinks } from '@/lib/constants';
import { Facebook, Instagram, Linkedin, Github, Mail, Phone, MapPin } from 'lucide-react';

export function Footer() {
  return <footer className="footer-wrap"><div className="container footer-grid">
    <div className="footer-intro"><Brand /><p>A little care. A longer life.<br />Repair services for the things you rely on.</p><Link href="/about#payment">Pay after the work is complete.</Link></div>
    <nav aria-label="Footer navigation"><h2>Explore FixMate</h2>{publicLinks.map(link => <Link href={link.href} key={link.href}>{link.label}</Link>)}</nav>
    <nav aria-label="Repair categories"><h2>Popular repairs</h2>{categories.map(category => <Link key={category} href={'/services?category=' + encodeURIComponent(category)}>{category}</Link>)}</nav>
    <div className="footer-contact"><h2>Here to help</h2><address><a href="mailto:atikhasan.inbox@gmail.com"><Mail size={17} aria-hidden="true" />atikhasan.inbox@gmail.com</a><a href="tel:+8801303783098"><Phone size={17} aria-hidden="true" />+880 1303-783098</a><p><MapPin size={17} aria-hidden="true" />Serving Dhaka, Bangladesh.</p></address><nav className="footer-socials" aria-label="Social platforms"><a href="https://www.facebook.com/" target="_blank" rel="noopener noreferrer" aria-label="Facebook"><Facebook size={20} /></a><a href="https://x.com/" target="_blank" rel="noopener noreferrer" aria-label="X"><span aria-hidden="true" className="x-logo">𝕏</span></a><a href="https://www.instagram.com/" target="_blank" rel="noopener noreferrer" aria-label="Instagram"><Instagram size={20} /></a><a href="https://www.linkedin.com/" target="_blank" rel="noopener noreferrer" aria-label="LinkedIn"><Linkedin size={20} /></a><a href="https://github.com/" target="_blank" rel="noopener noreferrer" aria-label="GitHub"><Github size={20} /></a></nav><Link href="/about">Understand the repair process</Link></div>
  </div><div className="container footer-bottom"><span>© {new Date().getFullYear()} FixMate. All rights reserved.</span><span>Repair. Reuse. Repeat.</span></div></footer>;
}


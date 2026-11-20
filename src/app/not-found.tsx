import Link from 'next/link';
import { Brand } from '@/components/layout/brand';

export default function NotFound() {
  return <main className="container page-section"><Brand /><div className="route-not-found"><p className="eyebrow">404 · PAGE NOT FOUND</p><h1>This page has moved<br />or doesn’t exist.</h1><p>Use the service directory to find a repair, or head back to the home page.</p><div className="route-recovery-actions"><Link className="button" href="/services">Explore services</Link><Link className="button button--secondary" href="/">Back to home</Link></div></div></main>;
}

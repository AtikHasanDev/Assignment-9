import Link from 'next/link';
import { Wrench } from 'lucide-react';
export default function ServiceNotFound() {
  return <div className="container page-section empty-state"><Wrench size={48} aria-hidden="true" /><h1>That repair isn’t available.</h1><p>It may have been removed or paused. Let’s find another service.</p><Link className="button" href="/services">Browse services</Link></div>;
}

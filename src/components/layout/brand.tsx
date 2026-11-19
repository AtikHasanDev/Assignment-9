import Link from 'next/link';
import { Wrench } from 'lucide-react';

export function Brand() {
  return <Link className="brand" href="/" aria-label="FixMate home"><span className="brand-icon"><Wrench size={23} aria-hidden="true" /></span>FixMate<span className="brand-dot" aria-hidden="true">.</span></Link>;
}


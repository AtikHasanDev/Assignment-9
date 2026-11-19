'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { useEffect, useRef, useState } from 'react';
import { Menu, X } from 'lucide-react';
import { Brand } from './brand';
import { publicLinks } from '@/lib/constants';

export function Header() {
  const pathname = usePathname();
  const [open, setOpen] = useState(false);
  const toggle = useRef<HTMLButtonElement>(null);
  useEffect(() => { setOpen(false); }, [pathname]);
  function isActive(href: string) {
    return href === '/' ? pathname === '/' : pathname === href || pathname.startsWith(href + '/');
  }
  return <header className="site-header-wrap" onKeyDown={event => {
    if (event.key === 'Escape' && open) { setOpen(false); toggle.current?.focus(); }
  }}>
    <div className="site-header container">
      <Brand />
      <button ref={toggle} className="menu-toggle" type="button" aria-expanded={open} aria-controls="public-navigation" aria-label={open ? 'Close navigation' : 'Open navigation'} onClick={() => setOpen(!open)}>
        {open ? <X size={24} aria-hidden="true" /> : <Menu size={24} aria-hidden="true" />}
      </button>
      <nav id="public-navigation" aria-label="Main navigation" className={'public-navigation' + (open ? ' is-open' : '')}>
        {publicLinks.map(link => <Link key={link.href} href={link.href} aria-current={isActive(link.href) ? 'page' : undefined} onClick={() => setOpen(false)}>{link.label}</Link>)}
        <Link className="nav-cta" href="/services" onClick={() => setOpen(false)}>Find a repair</Link>
      </nav>
    </div>
  </header>;
}


'use client';
import Link from 'next/link';
import { usePathname, useRouter } from 'next/navigation';
import { useEffect, useRef, useState } from 'react';
import { Menu, X, LayoutDashboard, ClipboardList, CreditCard, PlusCircle, Wrench, Inbox, Users, UserRound, House } from 'lucide-react';
import { useSession } from '@/components/auth/session-provider';
import { AccountMenu } from '@/components/auth/account-menu';
import { ThemeToggle } from '@/components/ui/theme-toggle';
import { Brand } from '@/components/layout/brand';
import { dashboardPath } from '@/lib/auth-navigation';
import { dashboardLinks } from '@/lib/dashboard-navigation';
import type { DashboardRole } from '@/lib/dashboard-navigation';
import '@/app/dashboard.css';

const icons = { overview: LayoutDashboard, bookings: ClipboardList, payments: CreditCard, add: PlusCircle, services: Wrench, requests: Inbox, users: Users };

export default function DashboardLayout({ children }: { children: React.ReactNode }) {
  const { data, isPending, error } = useSession();
  const router = useRouter();
  const pathname = usePathname();
  const [menuOpen, setMenuOpen] = useState(false);
  const toggle = useRef<HTMLButtonElement>(null);
  const sidebar = useRef<HTMLElement>(null);
  useEffect(() => { setMenuOpen(false); }, [pathname]);
  useEffect(() => {
    const desktop = window.matchMedia('(min-width:1001px)');
    const closeOnDesktop = () => { if (desktop.matches) setMenuOpen(false); };
    desktop.addEventListener('change', closeOnDesktop);
    return () => desktop.removeEventListener('change', closeOnDesktop);
  }, []);
  useEffect(() => {
    if (!menuOpen) return;
    const previous = document.body.style.overflow;
    document.body.style.overflow = 'hidden';
    return () => { document.body.style.overflow = previous; };
  }, [menuOpen]);
  useEffect(() => { if (menuOpen) sidebar.current?.querySelector<HTMLAnchorElement>('a')?.focus(); }, [menuOpen]);
  const allowed = !!data && (pathname === dashboardPath(data.user.role) || pathname.startsWith(dashboardPath(data.user.role) + '/') || pathname === '/dashboard/profile' || (data.user.role === 'customer' && (pathname === '/payment/success' || pathname === '/payment/cancel')));
  useEffect(() => {
    if (isPending || error) return;
    if (!data) router.replace('/sign-in?returnTo=' + encodeURIComponent(pathname));
    else if (!allowed) router.replace(dashboardPath(data.user.role));
  }, [data, isPending, error, pathname, allowed, router]);
  if (error) return <main className="container page-section"><h1>Unable to check your session</h1><p>Please check your connection and reload.</p><button className="button" onClick={() => window.location.reload()}>Try again</button></main>;
  if (isPending || !allowed) return <main className="container page-section" role="status">Checking access…</main>;
  const role = (['technician', 'admin'].includes(data!.user.role || '') ? data!.user.role : 'customer') as DashboardRole;
  const closeMenu = () => { setMenuOpen(false); requestAnimationFrame(() => toggle.current?.focus()); };
  return <div className="dashboard-shell" onKeyDown={event => {
    if (!menuOpen) return;
    if (event.key === 'Escape') { event.preventDefault(); closeMenu(); }
    if (event.key === 'Tab') {
      const controls = sidebar.current?.querySelectorAll<HTMLElement>('a[href],button:not([disabled])');
      if (!controls?.length) return;
      const first = controls[0], last = controls[controls.length - 1];
      if (event.shiftKey && document.activeElement === first) { event.preventDefault(); last.focus(); }
      else if (!event.shiftKey && document.activeElement === last) { event.preventDefault(); first.focus(); }
    }
  }}>
    <a className="skip-link" href="#dashboard-main">Skip to dashboard content</a>
    {menuOpen && <button className="dashboard-overlay" aria-label="Close dashboard navigation" onClick={closeMenu} />}
    <aside ref={sidebar} id="dashboard-navigation" className={'dashboard-sidebar' + (menuOpen ? ' is-open' : '')}><div className="sidebar-brand"><Brand /><button className="sidebar-close" aria-label="Close navigation" onClick={closeMenu}><X size={23} /></button></div><p className="sidebar-caption">{role} workspace</p><nav aria-label="Dashboard navigation">{dashboardLinks(role).map(link => {
      const Icon = icons[link.icon];
      return link.ready ? <Link href={link.href} key={link.href} aria-current={pathname === link.href ? 'page' : undefined}><Icon size={20} aria-hidden="true" /><span>{link.label}</span></Link> : <span key={link.href} className="sidebar-unavailable" aria-disabled="true"><Icon size={20} aria-hidden="true" /><span>{link.label}</span><small>Soon</small></span>;
    })}<Link href="/dashboard/profile" aria-current={pathname === '/dashboard/profile' ? 'page' : undefined}><UserRound size={20} aria-hidden="true" />My profile</Link></nav><div className="sidebar-bottom"><p>Clear updates.<br />Payment after completion.</p><Link href="/"><House size={18} aria-hidden="true" />Back to home</Link></div></aside>
    <div className="dashboard-body" inert={menuOpen}><header className="dashboard-topbar"><button ref={toggle} className="dashboard-menu-toggle" aria-label={menuOpen ? 'Close dashboard navigation' : 'Open dashboard navigation'} aria-controls="dashboard-navigation" aria-expanded={menuOpen} onClick={() => setMenuOpen(!menuOpen)}><Menu size={23} /></button><div className="dashboard-identity"><strong>{data!.user.name}</strong><span>{role}</span></div><Link className="dashboard-home-link" href="/">Home</Link><ThemeToggle /><AccountMenu /></header><main id="dashboard-main" tabIndex={-1} className="dashboard-main">{children}</main></div>
  </div>;
}

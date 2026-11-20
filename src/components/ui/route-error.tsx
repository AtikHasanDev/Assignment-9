'use client';
import Link from 'next/link';
import { Button } from './button';

export function RouteError({ retry, dashboard = false }: { retry: () => void; dashboard?: boolean }) {
  return <section className={dashboard ? 'dashboard-error' : 'container page-section'} role="alert"><p className="eyebrow">LET’S TRY THAT AGAIN</p><h1>This page couldn’t load</h1><p>Your connection or the service may be temporarily unavailable. Try loading the page again.</p><div className="route-recovery-actions"><Button onClick={retry}>Try again</Button><Link className="button button--secondary" href={dashboard ? '/dashboard/profile' : '/'}>{dashboard ? 'Go to my profile' : 'Back to home'}</Link></div></section>;
}

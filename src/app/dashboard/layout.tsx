'use client';
import Link from 'next/link';
import { usePathname, useRouter } from 'next/navigation';
import { useEffect } from 'react';
import { useSession } from '@/components/auth/session-provider';
import { AccountMenu } from '@/components/auth/account-menu';
import { Brand } from '@/components/layout/brand';
import { dashboardPath } from '@/lib/auth-navigation';

export default function DashboardLayout({ children }: { children: React.ReactNode }) {
  const { data, isPending, error } = useSession();
  const router = useRouter();
  const pathname = usePathname();
  const allowed = !!data && (pathname === dashboardPath(data.user.role) || pathname.startsWith(dashboardPath(data.user.role) + '/') || pathname === '/dashboard/profile');
  useEffect(() => {
    if (isPending || error) return;
    if (!data) router.replace('/sign-in?returnTo=' + encodeURIComponent(pathname));
    else if (!allowed) router.replace(dashboardPath(data.user.role));
  }, [data, isPending, error, pathname, allowed, router]);
  if (error) return <main className="container page-section"><h1>Unable to check your session</h1><p>Please check your connection and reload.</p><button className="button" onClick={() => window.location.reload()}>Try again</button></main>;
  if (isPending || !allowed) return <main className="container page-section" role="status">Checking access…</main>;
  return <div className="dashboard-foundation"><header className="site-header container"><Brand /><Link href="/">Back to home</Link><AccountMenu /></header><main className="container page-section">{children}</main></div>;
}

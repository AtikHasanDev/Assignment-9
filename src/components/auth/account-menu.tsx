'use client';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { useState } from 'react';
import { authClient } from '@/lib/auth-client';
import { dashboardPath } from '@/lib/auth-navigation';
import { useSession } from './session-provider';
import { useToast } from '@/components/ui/toast-provider';

export function AccountMenu() {
  const { data, isPending, error } = useSession();
  const notify = useToast();
  const router = useRouter();
  const [busy, setBusy] = useState(false);
  async function signOut() {
    setBusy(true);
    try {
      const result = await authClient.signOut();
      if (result.error) throw new Error(result.error.message);
      notify('You’ve signed out.'); router.replace('/'); router.refresh();
    } catch { notify('Sign-out failed. Please try again.', 'error'); }
    finally { setBusy(false); }
  }
  if (isPending) return <span className="account-loading" role="status">Checking session…</span>;
  if (!data) return <div className="account-links"><Link href="/sign-in">Sign in</Link><Link className="nav-cta" href="/sign-up">Sign up</Link>{error && <span className="sr-only">Session check unavailable</span>}</div>;
  return <details className="account-menu"><summary><span className="account-avatar">{data.user.image ? <img src={data.user.image} alt="" width={36} height={36} /> : data.user.name.slice(0, 1).toUpperCase()}</span><span className="sr-only">Open account menu for {data.user.name}</span></summary><div className="account-dropdown"><strong>{data.user.name}</strong><span className="account-role">{data.user.role}</span><Link href={dashboardPath(data.user.role)}>Dashboard</Link><Link href="/dashboard/profile">Update profile</Link><button type="button" disabled={busy} onClick={signOut}>{busy ? 'Signing out…' : 'Sign out'}</button></div></details>;
}

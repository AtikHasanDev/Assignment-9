'use client';
import Link from 'next/link';
import { useEffect, useState } from 'react';
import { useRouter, useSearchParams } from 'next/navigation';
import { Eye, EyeOff } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { useToast } from '@/components/ui/toast-provider';
import { useSession } from './session-provider';
import { authClient } from '@/lib/auth-client';
import { safeReturnTo } from '@/lib/auth-navigation';

export function SignInForm() {
  const router = useRouter();
  const params = useSearchParams();
  const notify = useToast();
  const { data: session, isPending } = useSession();
  const [busy, setBusy] = useState(false);
  const [visible, setVisible] = useState(false);
  const [errors, setErrors] = useState<{ email?: string; password?: string }>({});
  const [failure, setFailure] = useState('');
  useEffect(() => { if (session) router.replace(safeReturnTo(params.get('returnTo'), session.user.role)); }, [session, params, router]);

  async function submit(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault(); if (busy) return;
    const fields = new FormData(event.currentTarget);
    const email = String(fields.get('email') || '').trim().toLowerCase();
    const password = String(fields.get('password') || '');
    const invalid: typeof errors = {};
    if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) invalid.email = 'Enter a valid email address.';
    if (!password) invalid.password = 'Enter your password.';
    setErrors(invalid); setFailure('');
    if (Object.keys(invalid).length) return;
    setBusy(true);
    try {
      const { data, error } = await authClient.signIn.email({ email, password });
      if (error) { const message = error.message || 'Sign-in failed. Check your email and password.'; setFailure(message); notify(message, 'error'); return; }
      notify('Welcome back. You’re signed in.');
      router.replace(safeReturnTo(params.get('returnTo'), data.user.role));
      router.refresh();
    } catch { setFailure('Cannot reach FixMate. Please try again.'); notify('Cannot reach FixMate. Please try again.', 'error'); }
    finally { setBusy(false); }
  }
  if (isPending || session) return <div className="auth-card" role="status">{session ? 'Opening your dashboard…' : 'Checking your session…'}</div>;
  return <form className="auth-card" onSubmit={submit} noValidate aria-busy={busy}><h2>Welcome back</h2><p className="auth-muted">Sign in to pick up where you left off.</p>
    <label className="form-field" htmlFor="signin-email">Email address<input id="signin-email" name="email" type="email" autoComplete="email" disabled={busy} required aria-invalid={!!errors.email} aria-describedby="signin-email-error" /></label><p className="field-error" id="signin-email-error">{errors.email}</p>
    <label className="form-field" htmlFor="signin-password">Password<div className="password-field"><input id="signin-password" name="password" type={visible ? 'text' : 'password'} autoComplete="current-password" disabled={busy} required aria-invalid={!!errors.password} aria-describedby="signin-password-error" /><button type="button" aria-label={visible ? 'Hide password' : 'Show password'} onClick={() => setVisible(!visible)}>{visible ? <EyeOff size={20} /> : <Eye size={20} />}</button></div></label><p className="field-error" id="signin-password-error">{errors.password}</p>
    {failure && <p role="alert" className="form-alert">{failure}</p>}<Button type="submit" disabled={busy} className="auth-submit">{busy ? 'Signing in…' : 'Sign in'}</Button><p className="auth-footnote">New to FixMate? <Link href="/sign-up">Create an account</Link></p>
  </form>;
}

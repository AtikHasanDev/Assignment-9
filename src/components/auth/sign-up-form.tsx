'use client';

import Link from 'next/link';
import { useState } from 'react';
import { UserRound, Wrench, CheckCircle2, Eye, EyeOff } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { useSession } from './session-provider';
import { authClient } from '@/lib/auth-client';

type Errors = Partial<Record<'name' | 'email' | 'password', string>>;

export function SignUpForm() {
  const { data: session, isPending, error: sessionError } = useSession();
  const [role, setRole] = useState<'customer' | 'technician'>('customer');
  const [errors, setErrors] = useState<Errors>({});
  const [message, setMessage] = useState('');
  const [busy, setBusy] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
  const [created, setCreated] = useState(false);

  async function submit(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault();
    if (busy) return;
    const fields = new FormData(event.currentTarget);
    const name = String(fields.get('name') || '').trim();
    const email = String(fields.get('email') || '').trim().toLowerCase();
    const password = String(fields.get('password') || '');
    const nextErrors: Errors = {};
    if (!name) nextErrors.name = 'Enter your full name.';
    if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) nextErrors.email = 'Enter a valid email address.';
    if (password.length < 6 || password.length > 128 || !/[A-Z]/.test(password) || !/[a-z]/.test(password)) nextErrors.password = 'Use 6–128 characters with an uppercase and a lowercase letter.';
    setErrors(nextErrors); setMessage('');
    if (Object.keys(nextErrors).length) return;
    setBusy(true);
    try {
      // role is server-owned; the server hook validates this registration choice.
      const result = await authClient.signUp.email({ name, email, password, ...{ role } });
      if (result.error) { setMessage(result.error.message || 'Unable to create your account. Please try again.'); return; }
      setCreated(true);
      await authClient.getSession();
    } catch { setMessage('Cannot reach FixMate. Check your connection and try again.'); }
    finally { setBusy(false); }
  }

  if (isPending) return <div className="auth-card" role="status">Checking your session…</div>;
  if (created || session) return <div className="auth-card auth-success" role="status"><CheckCircle2 size={40} aria-hidden="true" /><h2>{created ? 'Your account is ready' : 'You’re already signed in'}</h2><p>{created ? 'Welcome to FixMate. Your account has been created successfully.' : 'You can explore our repair services with your existing account.'}</p><Link className="button" href="/services">Explore services</Link></div>;

  return <form className="auth-card" onSubmit={submit} noValidate aria-busy={busy}>
    <h2>Create your account</h2><p className="auth-muted">Choose how you want to use FixMate.</p>
    <fieldset className="role-choices" disabled={busy}><legend>I’m here to</legend>
      <label className={role === 'customer' ? 'role-choice selected' : 'role-choice'}><input type="radio" name="role" value="customer" checked={role === 'customer'} onChange={() => setRole('customer')} /><UserRound size={23} aria-hidden="true" /><strong>Find a repair</strong><span>Customer</span></label>
      <label className={role === 'technician' ? 'role-choice selected' : 'role-choice'}><input type="radio" name="role" value="technician" checked={role === 'technician'} onChange={() => setRole('technician')} /><Wrench size={23} aria-hidden="true" /><strong>Offer my skills</strong><span>Technician</span></label>
    </fieldset>
    <label className="form-field" htmlFor="signup-name">Full name<input id="signup-name" name="name" autoComplete="name" required maxLength={100} disabled={busy} aria-invalid={!!errors.name} aria-describedby={errors.name ? 'name-error' : undefined} /></label>{errors.name && <p id="name-error" className="field-error">{errors.name}</p>}
    <label className="form-field" htmlFor="signup-email">Email address<input id="signup-email" name="email" type="email" autoComplete="email" required disabled={busy} aria-invalid={!!errors.email} aria-describedby={errors.email ? 'email-error' : undefined} /></label>{errors.email && <p id="email-error" className="field-error">{errors.email}</p>}
    <label className="form-field" htmlFor="signup-password">Password<div className="password-field"><input id="signup-password" name="password" type={showPassword ? 'text' : 'password'} autoComplete="new-password" required maxLength={128} disabled={busy} aria-invalid={!!errors.password} aria-describedby="password-help password-error" /><button type="button" aria-label={showPassword ? 'Hide password' : 'Show password'} onClick={() => setShowPassword(!showPassword)}>{showPassword ? <EyeOff size={20} /> : <Eye size={20} />}</button></div></label>
    <p id="password-help" className="form-help">At least 6 characters, including uppercase and lowercase letters.</p><p id="password-error" className="field-error">{errors.password}</p>
    {(message || sessionError) && <p role="alert" className="form-alert">{message || 'Session check unavailable. You can still try creating an account.'}</p>}
    <Button type="submit" disabled={busy} className="auth-submit">{busy ? 'Creating your account…' : 'Create account'}</Button>
    <p className="auth-footnote">Already have an account? <Link href="/sign-in">Sign in</Link></p>
  </form>;
}

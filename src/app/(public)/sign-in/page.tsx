import type { Metadata } from 'next';
import { Suspense } from 'react';
import { SignInForm } from '@/components/auth/sign-in-form';
import '@/app/auth.css';

export const metadata: Metadata = { title: 'Sign in' };
export default function SignInPage() {
  return <div className="container auth-layout"><section className="auth-intro"><p className="eyebrow">GOOD TO SEE YOU AGAIN</p><h1>Your next fix<br />starts here.</h1><p>One place for your repair requests, job updates, and payments after completion.</p></section><Suspense fallback={<div className="auth-card" role="status">Loading sign-in…</div>}><SignInForm /></Suspense></div>;
}

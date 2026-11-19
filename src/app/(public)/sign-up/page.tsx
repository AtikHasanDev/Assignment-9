import type { Metadata } from 'next';
import { ShieldCheck, ClipboardList, CreditCard } from 'lucide-react';
import { SignUpForm } from '@/components/auth/sign-up-form';
import '@/app/auth.css';

export const metadata: Metadata = { title: 'Create an account' };

export default function SignUpPage() {
  return <div className="container auth-layout"><section className="auth-intro"><p className="eyebrow">WELCOME TO FIXMATE</p><h1>A fresh start<br />for your everyday.</h1><p>Find the help you need, or bring your repair skills to the people who need them.</p><ul className="auth-benefits"><li><ShieldCheck size={22} />Service details before you book</li><li><ClipboardList size={22} />Clear updates at every step</li><li><CreditCard size={22} />Payment after completion</li></ul></section><SignUpForm /></div>;
}

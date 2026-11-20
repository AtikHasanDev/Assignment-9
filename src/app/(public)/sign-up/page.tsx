import type { Metadata } from 'next';
import { ShieldCheck, ClipboardList, CreditCard, Wrench, UserRound } from 'lucide-react';
import { SignUpForm } from '@/components/auth/sign-up-form';
import '@/app/auth.css';

export const metadata: Metadata = { title: 'Create an account' };

export default async function SignUpPage({ searchParams }: { searchParams: Promise<Record<string, string | string[] | undefined>> }) {
  const query = await searchParams;
  const initialRole = query.role === 'technician' ? 'technician' : 'customer';
  const professional = initialRole === 'technician';
  return <div className="container auth-layout"><section className="auth-intro"><p className="eyebrow">{professional ? 'BUILD YOUR BUSINESS WITH FIXMATE' : 'WELCOME TO FIXMATE'}</p><h1>{professional ? <>Put your repair<br />skills to work.</> : <>A fresh start<br />for your everyday.</>}</h1><p>{professional ? 'Create your technician account, introduce your expertise, and submit your first repair service for approval.' : 'Find the help you need, or bring your repair skills to the people who need them.'}</p><ul className="auth-benefits">{professional ? <><li><UserRound size={22} />Build your professional profile</li><li><Wrench size={22} />List the services you offer</li><li><ClipboardList size={22} />Manage requests and repair progress</li></> : <><li><ShieldCheck size={22} />Service details before you book</li><li><ClipboardList size={22} />Clear updates at every step</li><li><CreditCard size={22} />Payment after completion</li></>}</ul></section><SignUpForm key={initialRole} initialRole={initialRole} /></div>;
}

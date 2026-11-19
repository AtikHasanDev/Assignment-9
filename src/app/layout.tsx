import type { Metadata } from 'next';
import './globals.css';
import { SessionProvider } from '@/components/auth/session-provider';

export const metadata: Metadata = {
  title: { default: 'FixMate | Repair made simple', template: '%s | FixMate' },
  description: 'Find device and home appliance repair services, track your repair, and pay after completion.',
};

export default function RootLayout({ children }: Readonly<{ children: React.ReactNode }>) {
  return <html lang="en" data-scroll-behavior="smooth"><body><SessionProvider>{children}</SessionProvider></body></html>;
}


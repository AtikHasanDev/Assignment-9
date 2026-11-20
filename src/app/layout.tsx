import type { Metadata } from 'next';
import '@fontsource-variable/dm-sans';
import '@fontsource-variable/manrope';
import './library.css';
import './globals.css';
import './refresh.css';
import { SessionProvider } from '@/components/auth/session-provider';
import { ToastProvider } from '@/components/ui/toast-provider';

export const metadata: Metadata = {
  title: { default: 'FixMate | Repair made simple', template: '%s | FixMate' },
  description: 'Find device and home appliance repair services, track your repair, and pay after completion.',
};

export default function RootLayout({ children }: Readonly<{ children: React.ReactNode }>) {
  return <html lang="en" data-theme="fixmate" data-scroll-behavior="smooth"><body><ToastProvider><SessionProvider>{children}</SessionProvider></ToastProvider></body></html>;
}


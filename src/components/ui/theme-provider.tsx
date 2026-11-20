'use client';

import { ThemeProvider as NextThemesProvider } from 'next-themes';

export function ThemeProvider({ children }: { children: React.ReactNode }) {
  return <NextThemesProvider attribute="data-theme" value={{ light: 'fixmate', dark: 'fixmate-dark' }} storageKey="fixmate-theme" defaultTheme="system" enableSystem>{children}</NextThemesProvider>;
}

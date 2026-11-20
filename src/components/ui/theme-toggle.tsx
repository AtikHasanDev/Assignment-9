'use client';

import { useEffect, useState } from 'react';
import { useTheme } from 'next-themes';
import { Moon, Sun } from 'lucide-react';

export function ThemeToggle() {
  const { resolvedTheme, setTheme } = useTheme();
  const [mounted, setMounted] = useState(false);
  useEffect(() => setMounted(true), []);
  const dark = mounted && resolvedTheme === 'dark';
  const label = mounted ? `Switch to ${dark ? 'light' : 'dark'} mode` : 'Toggle color theme';
  return <button className="theme-toggle" type="button" onClick={() => setTheme(dark ? 'light' : 'dark')} aria-label={label} aria-pressed={dark} title={label} disabled={!mounted}><span className="theme-toggle-thumb">{dark ? <Moon size={21} aria-hidden="true" /> : <Sun size={21} aria-hidden="true" />}</span></button>;
}

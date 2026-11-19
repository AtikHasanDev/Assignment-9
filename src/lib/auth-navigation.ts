export function dashboardPath(role?: string | null) {
  return '/dashboard/' + (role === 'admin' || role === 'technician' ? role : 'customer');
}

export function safeReturnTo(value: string | null | undefined, role?: string | null) {
  const fallback = dashboardPath(role);
  if (!value || !value.startsWith('/') || value.startsWith('//') || /[\\\u0000-\u0020]/.test(value)) return fallback;
  try {
    const url = new URL(value, 'https://fixmate.invalid');
    if (url.origin !== 'https://fixmate.invalid' || /^\/sign-(in|up)(\/|$)/.test(url.pathname)) return fallback;
    if (url.pathname.startsWith('/dashboard/') && url.pathname !== '/dashboard/profile' && !url.pathname.startsWith(fallback + '/') && url.pathname !== fallback) return fallback;
    return url.pathname + url.search + url.hash;
  } catch { return fallback; }
}

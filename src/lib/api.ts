const apiBase = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:5000';

export class ApiError extends Error {
  constructor(message: string, public status: number) { super(message); this.name = 'ApiError'; }
}

export async function apiRequest<T>(path: string, options: RequestInit = {}): Promise<T> {
  if (!path.startsWith('/api/') || path.includes('://')) throw new Error('API path must start with /api/.');
  const headers = new Headers(options.headers);
  if (options.body && !(options.body instanceof FormData)) headers.set('Content-Type', 'application/json');
  const response = await fetch(apiBase + path, { ...options, headers, credentials: 'include', cache: 'no-store' });
  const data = await response.json().catch(() => null);
  if (!response.ok) throw new ApiError(data?.message || 'The request could not be completed.', response.status);
  return data as T;
}


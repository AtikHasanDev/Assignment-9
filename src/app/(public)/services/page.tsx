import type { Metadata } from 'next';
import { getServices } from '@/lib/services';
import type { ServicePage } from '@/lib/services';
import { ServiceDirectory } from '@/components/services/service-directory';
import '@/app/services.css';

export const metadata: Metadata = { title: 'Repair services' };

export default async function ServicesPage({ searchParams }: { searchParams: Promise<Record<string, string | string[] | undefined>> }) {
  const query = await searchParams;
  const params = new URLSearchParams({ limit: '12' });
  for (const key of ['search', 'category', 'serviceMode', 'sort', 'page']) {
    if (typeof query[key] === 'string' && query[key]) params.set(key, query[key]);
  }
  let result: ServicePage | null = null;
  let failure = '';
  try { result = await getServices(params); }
  catch { failure = 'Services could not be loaded. Check your filters or try again shortly.'; }
  return <ServiceDirectory result={result} failure={failure} query={query} />;
}

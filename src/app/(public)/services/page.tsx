import type { Metadata } from 'next';
import Link from 'next/link';
import { categories } from '@/lib/constants';
import { getServices } from '@/lib/services';
import { ServiceCard } from '@/components/services/service-card';
import type { ServicePage } from '@/lib/services';
import '@/app/services.css';
import { EmptyState } from '@/components/ui/empty-state';
import { ButtonLink } from '@/components/ui/button';

export const metadata: Metadata = { title: 'Repair services' };

export default async function ServicesPage({ searchParams }: { searchParams: Promise<Record<string, string | string[] | undefined>> }) {
  const query = await searchParams;
  const value = (key: string) => typeof query[key] === 'string' ? query[key] as string : '';
  const params = new URLSearchParams({ limit: '12' });
  for (const key of ['search', 'category', 'serviceMode', 'sort', 'page']) if (value(key)) params.set(key, value(key));
  let result: ServicePage | null = null;
  let failure = '';
  try { result = await getServices(params); } catch { failure = 'Services could not be loaded. Check your filters or try again shortly.'; }
  const pageLink = (page: number) => { const next = new URLSearchParams(params); next.delete('limit'); next.set('page', String(page)); return '/services?' + next.toString(); };
  const pageNumbers = result ? Array.from(new Set([1, result.page - 1, result.page, result.page + 1, result.totalPages])).filter(p => p >= 1 && p <= result!.totalPages).sort((a,b) => a-b) : [];
  return <div className="container page-section"><div className="page-heading"><p className="eyebrow">FIND YOUR FIX</p><h1>Care for every corner<br />of your everyday.</h1><p>Find a service that fits your device, your home, and your day.</p></div>
    <form action="/services" method="get" className="service-filters" aria-label="Search and filter services" key={params.toString()}>
      <label>Search services<input name="search" type="search" placeholder="Try AC, laptop, or screen repair" defaultValue={value('search')} maxLength={100} /></label>
      <label>Category<select name="category" defaultValue={value('category')}><option value="">All categories</option>{categories.map(category => <option key={category}>{category}</option>)}</select></label>
      <label>Service mode<select name="serviceMode" defaultValue={value('serviceMode')}><option value="">Any mode</option><option>Home Visit</option><option>Shop Drop-off</option></select></label>
      <label>Sort by<select name="sort" defaultValue={value('sort') || 'newest'}><option value="newest">Newest first</option><option value="price-asc">Price: low to high</option><option value="price-desc">Price: high to low</option></select></label>
      <button className="button" type="submit">Find services</button><Link className="clear-filters" href="/services">Reset filters</Link>
    </form>
    {failure ? <EmptyState title="Let’s try that again" description={failure} action={<ButtonLink href={'/services?' + params.toString()} variant="secondary">Try again</ButtonLink>} /> : result && <>
      <div className="results-heading"><p role="status"><strong>{result.total}</strong> {result.total === 1 ? 'service' : 'services'} found</p><span>Pay after completion</span></div>
      {result.items.length ? <div className="service-grid">{result.items.map(service => <ServiceCard key={service._id} service={service} />)}</div> : <EmptyState title="No repairs match just yet" description="Try another category, a shorter search, or reset the filters." action={<ButtonLink href="/services" variant="secondary">Show all services</ButtonLink>} />}
      {result.totalPages > 1 && <nav className="pagination" aria-label="Service result pages">{result.page > 1 && <Link href={pageLink(result.page - 1)}>Previous</Link>}{pageNumbers.map((number, index) => <span key={number}>{index > 0 && number - pageNumbers[index-1] > 1 && <span aria-hidden="true">…</span>}<Link href={pageLink(number)} aria-label={'Page ' + number} aria-current={number === result.page ? 'page' : undefined}>{number}</Link></span>)}{result.page < result.totalPages && <Link href={pageLink(result.page + 1)}>Next</Link>}</nav>}
    </>}
  </div>;
}


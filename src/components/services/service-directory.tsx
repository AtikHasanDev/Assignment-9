import Link from 'next/link';
import { Search, SlidersHorizontal, ShieldCheck, CreditCard, Clock, Check, Wrench, X, Smartphone, Laptop, AirVent, Refrigerator, Tv, WashingMachine, PlugZap } from 'lucide-react';
import { categories } from '@/lib/constants';
import { ServiceCard } from './service-card';
import { EmptyState } from '@/components/ui/empty-state';
import { ButtonLink } from '@/components/ui/button';
import type { ServicePage } from '@/lib/services';
import '@/app/directory.css';

const categoryIcons = [Smartphone, Laptop, AirVent, Refrigerator, Tv, WashingMachine, PlugZap];

export function ServiceDirectory({ result, failure, query }: { result: ServicePage | null; failure: string; query: Record<string, string | string[] | undefined> }) {
  const value = (key: string) => typeof query[key] === 'string' ? query[key] as string : '';
  const params = new URLSearchParams();
  for (const key of ['search', 'category', 'serviceMode', 'sort', 'page']) if (value(key)) params.set(key, value(key));
  const browseLink = (key: string, nextValue: string) => { const next = new URLSearchParams(params); next.delete('page'); if (nextValue) next.set(key, nextValue); else next.delete(key); return '/services' + (next.size ? '?' + next.toString() : '') + '#repair-listings'; };
  const pageLink = (page: number) => { const next = new URLSearchParams(params); next.set('page', String(page)); return '/services?' + next.toString() + '#repair-listings'; };
  const pages = result ? Array.from(new Set([1, result.page - 1, result.page, result.page + 1, result.totalPages])).filter(p => p >= 1 && p <= result.totalPages).sort((a,b) => a-b) : [];
  const filters = [['search', value('search')], ['category', value('category')], ['serviceMode', value('serviceMode')]].filter(([,v]) => v);
  return <div className="repair-directory">
    <section className="directory-banner">
      <div className="container directory-banner-inner">
        <div className="directory-banner-copy"><nav aria-label="Breadcrumb"><Link href="/">Home</Link><span>/</span><span aria-current="page">Repair services</span></nav><p className="eyebrow">THE RIGHT HANDS FOR YOUR REPAIR</p><h1>Life happens.<br />We help you fix it.</h1><p>From a cracked screen to an AC on its last cool breath. Explore repair services for your home and everything in it.</p><a className="d-btn d-btn-secondary" href="#repair-listings">Find your service</a></div>
        <div className="directory-banner-photo"><img src="/images/repair-workbench.jpg" alt="Technician carefully working on the components inside a laptop" width={1400} height={934} fetchPriority="high" /><div className="directory-photo-note"><span><Wrench size={22} /></span><div><strong>A repair worth making.</strong><small>A little care. A longer life.</small></div></div></div>
      </div>
    </section>
    <div className="directory-benefits"><div className="container"><span><ShieldCheck size={19} />Admin-approved listings</span><span><Clock size={19} />Track every repair step</span><span><CreditCard size={19} />Pay after completion</span></div></div>
    <div className="container directory-content" id="repair-listings">
      <div className="directory-intro"><div><p className="eyebrow">WHAT NEEDS A LITTLE ATTENTION?</p><h2>Find your kind of fix.</h2></div><p>Choose a category, compare starting prices,<br />and meet the technician behind the service.</p></div>
      <nav className="directory-categories" aria-label="Service categories"><Link href={browseLink('category', '')} aria-current={!value('category') ? 'page' : undefined}><Wrench size={20} />All repairs</Link>{categories.map((category,index) => { const Icon = categoryIcons[index]; return <Link href={browseLink('category',category)} key={category} aria-current={value('category') === category ? 'page' : undefined}><Icon size={20} />{category}</Link>; })}</nav>
      <div className="directory-layout">
        <aside className="directory-sidebar"><form id="repair-filters" action="/services#repair-listings" method="get" aria-label="Search and filter services" key={params.toString()} className="directory-filter-form"><h3><SlidersHorizontal size={19} />Refine your search</h3><label htmlFor="directory-search">Search services<div className="directory-search-field"><Search size={18} aria-hidden="true" /><input className="d-input" id="directory-search" name="search" type="search" placeholder="Laptop, screen, AC…" defaultValue={value('search')} maxLength={100} /></div></label><label htmlFor="directory-category">Category<select id="directory-category" name="category" defaultValue={value('category')}><option value="">All categories</option>{categories.map(category => <option key={category}>{category}</option>)}</select></label><label htmlFor="directory-mode">Service mode<select id="directory-mode" name="serviceMode" defaultValue={value('serviceMode')}><option value="">Any mode</option><option>Home Visit</option><option>Shop Drop-off</option></select></label><label htmlFor="directory-sort">Sort by<select id="directory-sort" name="sort" defaultValue={value('sort') || 'newest'}><option value="newest">Newest first</option><option value="price-asc">Price: low to high</option><option value="price-desc">Price: high to low</option></select></label><button className="d-btn d-btn-primary" type="submit">Apply filters</button><Link className="directory-reset" href="/services#repair-listings">Reset all filters</Link></form><div className="directory-help"><span><ShieldCheck size={25} /></span><h3>Know what comes next.</h3><p>Your technician sets the final amount when the repair is complete. That’s when payment opens.</p><Link href="/about#payment">How FixMate works</Link></div></aside>
        <section className="directory-results" aria-label="Repair service results"><div className="directory-results-heading"><div><h3>{value('category') || 'All repair services'}</h3><p role="status">{result ? <>Showing {result.total ? (result.page-1)*12+1 : 0}–{Math.min(result.page*12,result.total)} of <strong>{result.total}</strong> services</> : 'Services are temporarily unavailable'}</p></div><span className="directory-approval"><Check size={14} />Approved & available</span></div>
          {filters.length > 0 && <div className="directory-active-filters" aria-label="Active filters">{filters.map(([key,label]) => <Link key={key} href={browseLink(key,'')} aria-label={'Remove ' + label + ' filter'}>{label}<X size={14} /></Link>)}</div>}
          {failure ? <EmptyState title="Let’s try that again" description={failure} action={<ButtonLink href={'/services?' + params.toString()} variant="secondary">Try again</ButtonLink>} /> : result && <>{result.items.length ? <div className="service-grid directory-grid">{result.items.map(service => <ServiceCard key={service._id} service={service} />)}</div> : <EmptyState title="No repairs match just yet" description="Try a different category or a shorter search, or reset your filters." action={<ButtonLink href="/services" variant="secondary">Show all services</ButtonLink>} />}{result.totalPages > 1 && <nav className="pagination" aria-label="Service result pages">{result.page > 1 && <Link href={pageLink(result.page-1)}>Previous</Link>}{pages.map((page,index) => <span key={page}>{index>0 && page-pages[index-1]>1 && <span aria-hidden="true">…</span>}<Link href={pageLink(page)} aria-label={'Page '+page} aria-current={page===result.page?'page':undefined}>{page}</Link></span>)}{result.page<result.totalPages && <Link href={pageLink(result.page+1)}>Next</Link>}</nav>}</>}
        </section>
      </div>
    </div>
    <section className="directory-bottom-note container"><div><Wrench size={30} /><div><h2>A few details. A clearer repair.</h2><p>Open a service to see what’s included, where the technician works, and how long it may take.</p></div></div><Link className="d-btn d-btn-outline" href="/about">How it works</Link></section>
  </div>;
}


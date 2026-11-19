'use client';
import Link from 'next/link';
import { useEffect, useState } from 'react';
import { useSession } from '@/components/auth/session-provider';
import { authenticatedApiRequest } from '@/lib/api';
import { StatsCard } from './stats-card';
import { StatusChart } from './status-chart';
import type { ChartItem } from './status-chart';
import type { DashboardRole } from '@/lib/dashboard-navigation';

type OverviewData = { role: DashboardRole; stats: { label: string; value: number }[]; chart: { title: string; items: ChartItem[] } };
export function DashboardOverview({ role }: { role: DashboardRole }) {
  const { data: session } = useSession();
  const [data, setData] = useState<OverviewData | null>(null);
  const [loading, setLoading] = useState(true);
  const [failure, setFailure] = useState('');
  const [attempt, setAttempt] = useState(0);
  useEffect(() => {
    let active = true;
    setLoading(true); setFailure(''); setData(null);
    authenticatedApiRequest<OverviewData>('/api/dashboard/' + role).then(result => { if (active) setData(result); }).catch(error => { if (active) setFailure(error.message || 'Could not load your overview.'); }).finally(() => { if (active) setLoading(false); });
    return () => { active = false; };
  }, [role, attempt]);
  return <section><div className="dashboard-page-heading"><div><p className="eyebrow">YOUR FIXMATE WORKSPACE</p><h1>Welcome back{session?.user.name ? ', ' + session.user.name.split(' ')[0] : ''}.</h1><p>{role === 'customer' ? 'Every repair, with a clear next step.' : role === 'technician' ? 'Your services and repair jobs at a glance.' : 'A clear view of your platform and moderation queue.'}</p></div><button className="button button--secondary" disabled={loading} onClick={() => setAttempt(value => value + 1)}>Refresh overview</button></div>
    {loading ? <div className="stats-grid" role="status" aria-label="Loading overview">{[0,1,2].map(index => <div className="stats-card stats-skeleton" key={index} aria-hidden="true"><div className="skeleton skeleton-line" /></div>)}</div> : failure ? <div className="dashboard-error" role="alert"><h2>Your overview could not be loaded.</h2><p>{failure}</p><button className="button" onClick={() => setAttempt(value => value + 1)}>Try again</button></div> : data && <><div className="stats-grid">{data.stats.map((stat, index) => <StatsCard key={stat.label} {...stat} index={index} />)}</div><StatusChart {...data.chart} /><div className="dashboard-next"><h2>{role === 'customer' ? 'Ready for your next repair?' : 'Keep your account up to date.'}</h2><p>{role === 'customer' ? 'Browse services, compare the details, and send a repair request.' : 'A complete profile helps people know who they’re working with.'}</p><Link className="button" href={role === 'customer' ? '/services' : '/dashboard/profile'}>{role === 'customer' ? 'Find a service' : 'View profile'}</Link></div></>}
  </section>;
}

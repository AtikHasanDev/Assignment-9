import { notFound } from 'next/navigation';
import { DashboardOverview } from '@/components/dashboard/overview';
import type { DashboardRole } from '@/lib/dashboard-navigation';

export default async function OverviewPage({ params }: { params: Promise<{ role: string }> }) {
  const { role } = await params;
  if (!['customer', 'technician', 'admin'].includes(role)) notFound();
  return <DashboardOverview role={role as DashboardRole} />;
}

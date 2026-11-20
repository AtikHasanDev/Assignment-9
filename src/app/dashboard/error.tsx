'use client';
import { RouteError } from '@/components/ui/route-error';

export default function DashboardError({ retry }: { error: unknown; retry: () => void }) { return <RouteError retry={retry} dashboard />; }

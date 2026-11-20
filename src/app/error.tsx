'use client';
import { RouteError } from '@/components/ui/route-error';

export default function ErrorPage({ retry }: { error: unknown; retry: () => void }) { return <RouteError retry={retry} />; }

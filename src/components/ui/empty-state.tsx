import { Wrench } from 'lucide-react';
import type { ReactNode } from 'react';

export function EmptyState({ title, description, action }: { title: string; description: string; action?: ReactNode }) {
  return <div className="empty-state"><span className="empty-state-icon"><Wrench size={30} aria-hidden="true" /></span><h2>{title}</h2><p>{description}</p>{action}</div>;
}


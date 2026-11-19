'use client';
import { useState } from 'react';
import { useAdminList } from '@/components/admin/use-admin-list';
import { AdminPagination } from '@/components/admin/pagination';
import { authenticatedApiRequest, ApiError } from '@/lib/api';
import { Button } from '@/components/ui/button';
import { ConfirmationDialog } from '@/components/ui/confirmation-dialog';
import { EmptyState } from '@/components/ui/empty-state';
import { StatusBadge } from '@/components/ui/status-badge';
import { useToast } from '@/components/ui/toast-provider';
import type { RepairService } from '@/lib/services';
import '@/app/admin.css';

type Approval = 'pending' | 'approved' | 'rejected';
type ModeratedService = RepairService & { approvalStatus: Approval; isAvailable: boolean };
export default function ServiceApprovalPage() {
  const [filter, setFilter] = useState('pending');
  const list = useAdminList<ModeratedService>('services', '&approvalStatus=' + filter);
  const [decision, setDecision] = useState<{ service: ModeratedService; status: 'approved' | 'rejected' } | null>(null);
  const [busy, setBusy] = useState(false);
  const notify = useToast();
  async function moderate() {
    if (!decision || busy) return;
    setBusy(true);
    try {
      await authenticatedApiRequest('/api/admin/services/' + decision.service._id + '/approval', { method: 'PATCH', body: JSON.stringify({ approvalStatus: decision.status }) });
      notify('Service ' + decision.status + '.'); setDecision(null); list.refresh();
    } catch (error) {
      notify(error instanceof Error ? error.message : 'Could not update approval.', 'error');
      if (error instanceof ApiError && [404, 409].includes(error.status)) { setDecision(null); list.refresh(); }
    } finally { setBusy(false); }
  }
  return <section><div className="dashboard-page-heading"><div><p className="eyebrow">QUALITY CONTROL</p><h1>Service approval</h1><p>Review service details before approving them. Public listings show only approved, available services.</p></div><Button variant="secondary" disabled={busy || list.loading} onClick={list.refresh}>Refresh services</Button></div>
    <label className="admin-filter" htmlFor="approval-filter">Approval status<select id="approval-filter" value={filter} disabled={busy} onChange={event => { setFilter(event.target.value); list.setPage(1); }}><option value="pending">Pending</option><option value="approved">Approved</option><option value="rejected">Rejected</option><option value="all">All services</option></select></label>
    {list.loading ? <p role="status">Loading services…</p> : list.failure ? <div role="alert" className="dashboard-error"><p>{list.failure}</p><Button onClick={list.refresh}>Try again</Button></div> : !list.items.length ? <EmptyState title="No services to review" description="No services match the selected approval status." /> : <><div className="admin-services">{list.items.map(service => <article className="admin-service" key={service._id}><img src={service.image} width={220} height={170} alt={service.title} /><div className="admin-service-content"><div className="admin-service-labels"><StatusBadge status={service.approvalStatus} /><span>{service.isAvailable ? 'Available' : 'Paused'}</span></div><h2>{service.title}</h2><p>{service.technicianName} · {service.technicianEmail}</p><dl><div><dt>Category</dt><dd>{service.category}</dd></div><div><dt>Starting price</dt><dd>{new Intl.NumberFormat('en-US', { style: 'currency', currency: 'USD' }).format(service.basePrice)}</dd></div><div><dt>Mode / area</dt><dd>{service.serviceMode} · {service.serviceArea}</dd></div><div><dt>Duration</dt><dd>{service.estimatedDuration}</dd></div></dl><details><summary>Read full description</summary><p className="admin-service-description">{service.description}</p></details><div className="admin-service-actions"><Button disabled={busy || service.approvalStatus === 'approved'} onClick={() => setDecision({ service, status: 'approved' })}>Approve</Button><Button variant="danger" disabled={busy || service.approvalStatus === 'rejected'} onClick={() => setDecision({ service, status: 'rejected' })}>Reject</Button></div></div></article>)}</div><AdminPagination page={list.page} totalPages={list.totalPages} total={list.total} disabled={busy || list.loading} onChange={list.setPage} /></>}
    <ConfirmationDialog open={!!decision} title={decision?.status === 'approved' ? 'Approve this service?' : 'Reject this service?'} description={decision ? (decision.status === 'approved' ? 'Approve “' + decision.service.title + '”? It will appear publicly when available.' : 'Reject “' + decision.service.title + '”? It will be hidden from public listings.') : ''} confirmLabel={decision?.status === 'approved' ? 'Approve service' : 'Reject service'} cancelLabel="Keep current status" busyLabel="Updating…" busy={busy} onConfirm={moderate} onCancel={() => setDecision(null)} />
  </section>;
}

'use client';
import { RecordTable, RecordIdentity } from '@/components/ui/record-table';
import { useEffect, useState } from 'react';
import Link from 'next/link';
import { authenticatedApiRequest, ApiError } from '@/lib/api';
import { ServiceEditor } from '@/components/services/service-editor';
import type { ServiceFields } from '@/components/services/service-editor';
import { Button } from '@/components/ui/button';
import { ConfirmationDialog } from '@/components/ui/confirmation-dialog';
import { EmptyState } from '@/components/ui/empty-state';
import { StatusBadge } from '@/components/ui/status-badge';
import { useToast } from '@/components/ui/toast-provider';
import '@/app/my-services.css';

type OwnedService = ServiceFields & { _id: string; approvalStatus: 'pending' | 'approved' | 'rejected'; isAvailable: boolean };
export default function MyServicesPage() {
  const [items, setItems] = useState<OwnedService[]>([]);
  const [loading, setLoading] = useState(true);
  const [failure, setFailure] = useState('');
  const [attempt, setAttempt] = useState(0);
  const [busy, setBusy] = useState(false);
  const [editing, setEditing] = useState<OwnedService | null>(null);
  const [deleting, setDeleting] = useState<OwnedService | null>(null);
  const notify = useToast();
  useEffect(() => {
    let active = true;
    setLoading(true); setFailure('');
    authenticatedApiRequest<{ items: OwnedService[] }>('/api/services/my')
      .then(data => { if (active) setItems(data.items); })
      .catch(error => { if (active) setFailure(error.message || 'Could not load your services.'); })
      .finally(() => { if (active) setLoading(false); });
    return () => { active = false; };
  }, [attempt]);
  async function mutate(service: OwnedService, remove = false) {
    if (busy) return;
    setBusy(true);
    try {
      await authenticatedApiRequest('/api/services/' + service._id + (remove ? '' : '/availability'), {
        method: remove ? 'DELETE' : 'PATCH', ...(!remove ? { body: JSON.stringify({ isAvailable: !service.isAvailable }) } : {}),
      });
      notify(remove ? 'Service deleted.' : service.isAvailable ? 'Service paused.' : 'Service availability restored.');
      setDeleting(null); setAttempt(value => value + 1);
    } catch (error) {
      notify(error instanceof Error ? error.message : 'Could not update your service.', 'error');
      if (error instanceof ApiError && [404, 409].includes(error.status)) { setDeleting(null); setAttempt(value => value + 1); }
    } finally { setBusy(false); }
  }
  if (editing) return <ServiceEditor key={editing._id} initial={editing} serviceId={editing._id} onSaved={() => { setEditing(null); setAttempt(value => value + 1); }} onCancel={() => setEditing(null)} />;
  return <section><div className="dashboard-page-heading"><div><p className="eyebrow">YOUR REPAIR CATALOGUE</p><h1>My services</h1><p>Keep your offerings current. Editing sends a service back for approval; availability controls whether an approved service can be requested.</p></div><Link className="button" href="/dashboard/technician/add-service">Add a service</Link></div>
    <Button variant="secondary" disabled={loading || busy} onClick={() => setAttempt(value => value + 1)}>Refresh services</Button>
    {loading ? <p role="status">Loading your services…</p> : failure ? <div role="alert" className="dashboard-error"><p>{failure}</p><Button onClick={() => setAttempt(value => value + 1)}>Try again</Button></div> : !items.length ? <EmptyState title="Your catalogue starts here" description="Add your first repair service and submit it for administrator approval." action={<Link className="button" href="/dashboard/technician/add-service">Add a service</Link>} /> : <RecordTable caption="Your repair services" columns={['Service', 'Category', 'Starting price', 'Approval', 'Availability']} rows={items.map(service => ({ id: service._id, cells: [<RecordIdentity key="service" image={service.image} title={service.title} subtitle={service.serviceMode} />, service.category, new Intl.NumberFormat('en-US', { style: 'currency', currency: 'USD' }).format(service.basePrice), <StatusBadge key="approval" status={service.approvalStatus} />, service.isAvailable ? 'Available' : 'Paused'] }))}>{items.map(service => <article className="owned-service" key={service._id}>
      <img src={service.image} width={240} height={180} alt={service.title} />
      <div className="owned-service-body"><div className="owned-service-status"><StatusBadge status={service.approvalStatus} /><span>{service.isAvailable ? 'Available' : 'Paused'}</span></div><h2>{service.title}</h2><p>{service.category} · {service.serviceMode}</p><p>{service.serviceArea} · {service.estimatedDuration}</p><strong>{new Intl.NumberFormat('en-US', { style: 'currency', currency: 'USD' }).format(service.basePrice)} starting price</strong><p className="owned-service-description">{service.description}</p>
        <div className="owned-service-actions"><Button variant="secondary" disabled={busy} onClick={() => setEditing(service)}>Edit service</Button><Button variant="secondary" disabled={busy} onClick={() => mutate(service)}>{service.isAvailable ? 'Pause service' : 'Make available'}</Button><Button variant="danger" disabled={busy} onClick={() => setDeleting(service)}>Delete</Button>{service.approvalStatus === 'approved' && service.isAvailable && <Link href={'/services/' + service._id}>View public page</Link>}</div>
      </div>
    </article>)}</RecordTable>}
    <ConfirmationDialog open={!!deleting} title="Delete this service?" description={deleting ? 'Permanently delete “' + deleting.title + '”? Existing repair bookings keep their saved service details. This cannot be undone.' : ''} confirmLabel="Delete service" cancelLabel="Keep service" busyLabel="Deleting…" busy={busy} onConfirm={() => { if (deleting) mutate(deleting, true); }} onCancel={() => setDeleting(null)} />
  </section>;
}

'use client';
import { useRef, useState } from 'react';
import { authenticatedApiRequest } from '@/lib/api';
import { categories } from '@/lib/constants';
import { Button } from '@/components/ui/button';
import { ImageUpload } from '@/components/ui/image-upload';
import { useToast } from '@/components/ui/toast-provider';
import '@/app/profile.css';
import '@/app/service-editor.css';

export type ServiceFields = { title: string; description: string; category: string; basePrice: number; estimatedDuration: string; serviceMode: string; serviceArea: string; image: string };

export function ServiceEditor({ initial, serviceId, onSaved, onCancel }: { initial?: ServiceFields; serviceId?: string; onSaved?: () => void; onCancel?: () => void }) {
  const form = useRef<HTMLFormElement>(null);
  const [image, setImage] = useState(initial?.image || '');
  const [uploading, setUploading] = useState(false);
  const [busy, setBusy] = useState(false);
  const [failure, setFailure] = useState('');
  const [created, setCreated] = useState('');
  const notify = useToast();

  async function submit(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault();
    if (busy || uploading) return;
    setFailure(''); setCreated('');
    if (!image) { setFailure('Upload a service image before submitting.'); return; }
    const values = new FormData(event.currentTarget);
    const text = (key: string) => String(values.get(key) || '').trim();
    const fields = { title: text('title'), description: text('description'), category: text('category'), basePrice: Number(text('basePrice')), estimatedDuration: text('estimatedDuration'), serviceMode: text('serviceMode'), serviceArea: text('serviceArea'), image };
    for (const [label, value, min, max] of [
      ['Title', fields.title, 5, 120], ['Description', fields.description, 20, 5000],
      ['Estimated duration', fields.estimatedDuration, 2, 80], ['Service area', fields.serviceArea, 2, 160],
    ] as const) {
      if (value.length < min || value.length > max) { setFailure(`${label} must contain ${min}–${max} characters.`); return; }
    }
    if (!Number.isFinite(fields.basePrice) || fields.basePrice <= 0 || fields.basePrice > 100000 || Math.abs(fields.basePrice * 100 - Math.round(fields.basePrice * 100)) > 0.00001) {
      setFailure('Enter a starting price between $0.01 and $100,000, with at most two decimal places.'); return;
    }
    setBusy(true);
    try {
      const service = await authenticatedApiRequest<{ title?: string }>('/api/services' + (serviceId ? '/' + serviceId : ''), { method: serviceId ? 'PATCH' : 'POST', body: JSON.stringify(fields) });
      if (!serviceId) { form.current?.reset(); setImage(''); setCreated(service.title || fields.title); }
      notify(serviceId ? 'Service updated and awaiting approval.' : 'Service submitted for approval.');
      onSaved?.();
    } catch (error) {
      const message = error instanceof Error ? error.message : 'Could not create your service.';
      setFailure(message); notify(message, 'error');
    } finally { setBusy(false); }
  }

  return <section><p className="eyebrow">GROW YOUR REPAIR BUSINESS</p><h1>{serviceId ? 'Edit service' : 'Add a service'}</h1><p>{serviceId ? 'Saving changes sends your service back for administrator approval before it appears in public listings again.' : 'Describe what you repair and where you work. New services need administrator approval before customers can find them.'}</p>
    {created && <div className="profile-saved" role="status"><strong>{created}</strong> was submitted for approval. You can add another service below.</div>}
    <form ref={form} className="profile-editor service-editor" onSubmit={submit} aria-busy={busy || uploading}>
      <ImageUpload label="Service image" value={image} onChange={setImage} onBusyChange={setUploading} disabled={busy} successMessage="Service image uploaded. Complete the details and submit for approval." />
      <fieldset disabled={busy || uploading} className="profile-form-grid">
        <legend className="sr-only">Service details</legend>
        <label className="profile-wide" htmlFor="service-title">Service title<input id="service-title" name="title" defaultValue={initial?.title} required minLength={5} maxLength={120} placeholder="e.g. Laptop keyboard repair" /></label>
        <label htmlFor="service-category">Category<select id="service-category" name="category" required defaultValue={initial?.category || ''}><option value="" disabled>Choose a category</option>{categories.map(category => <option key={category}>{category}</option>)}</select></label>
        <label htmlFor="service-price">Starting price (USD)<input id="service-price" name="basePrice" defaultValue={initial?.basePrice} type="number" required min="0.01" max="100000" step="0.01" placeholder="25.00" /></label>
        <label htmlFor="service-mode">Service mode<select id="service-mode" name="serviceMode" required defaultValue={initial?.serviceMode || ''}><option value="" disabled>Choose a mode</option><option>Home Visit</option><option>Shop Drop-off</option></select></label>
        <label htmlFor="service-duration">Estimated duration<input id="service-duration" name="estimatedDuration" defaultValue={initial?.estimatedDuration} required minLength={2} maxLength={80} placeholder="e.g. 2–3 hours" /></label>
        <label className="profile-wide" htmlFor="service-area">Service area<input id="service-area" name="serviceArea" defaultValue={initial?.serviceArea} required minLength={2} maxLength={160} placeholder="e.g. Mirpur, Dhaka" /></label>
        <label className="profile-wide" htmlFor="service-description">Description<textarea id="service-description" name="description" defaultValue={initial?.description} required rows={6} minLength={20} maxLength={5000} placeholder="Explain the repair, what is included, and anything customers should know." /></label>
      </fieldset>
      <p className="service-editor-note">The starting price is an estimate. Customers pay the final amount after their repair is completed.</p>
      {failure && <p role="alert" className="form-alert">{failure}</p>}
      <Button type="submit" disabled={busy || uploading}>{busy ? 'Submitting service…' : uploading ? 'Wait for upload…' : (serviceId ? 'Save and resubmit' : 'Submit for approval')}</Button>{onCancel && <Button className="service-cancel" variant="secondary" disabled={busy || uploading} onClick={onCancel}>Cancel editing</Button>}
    </form>
  </section>;
}

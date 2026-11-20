'use client';
import Link from 'next/link';
import { useState } from 'react';
import { useSession } from '@/components/auth/session-provider';
import { useToast } from '@/components/ui/toast-provider';
import { authenticatedApiRequest, ApiError } from '@/lib/api';
import { Button } from '@/components/ui/button';
import { ImageUpload } from '@/components/ui/image-upload';
import '@/app/profile.css';

function today() {
  const parts = new Intl.DateTimeFormat('en-US', { timeZone: 'Asia/Dhaka', year: 'numeric', month: '2-digit', day: '2-digit' }).formatToParts(new Date());
  return ['year', 'month', 'day'].map(type => parts.find(part => part.type === type)?.value).join('-');
}

export function RepairRequest({ serviceId }: { serviceId: string }) {
  const { data, isPending, error } = useSession();
  const notify = useToast();
  const [open, setOpen] = useState(false);
  const [busy, setBusy] = useState(false);
  const [done, setDone] = useState(false);
  const [failure, setFailure] = useState('');
  const [errors, setErrors] = useState<Record<string, string>>({});
  const [problemImage, setProblemImage] = useState('');
  const [uploading, setUploading] = useState(false);
  if (isPending) return <p role="status">Checking your account…</p>;
  if (error) return <p role="alert">Your session could not be checked. Please reload and try again.</p>;
  if (!data) return <Link className="button request-button" href={'/sign-in?returnTo=' + encodeURIComponent('/services/' + serviceId)}>Sign in to request repair</Link>;
  if (data.user.role !== 'customer') return <p className="request-notice">Only customers can request a repair. You’re signed in as a {data.user.role}.</p>;
  if (done) return <div role="status"><h2>Request sent</h2><p>Your technician will review the problem and your preferred date.</p><Link className="button request-button" href="/dashboard/customer/bookings">View my bookings</Link></div>;

  async function submit(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault(); if (busy || uploading) return;
    const fields = new FormData(event.currentTarget);
    const customerPhone = String(fields.get('customerPhone') || '').trim();
    const address = String(fields.get('address') || '').trim();
    const preferredDate = String(fields.get('preferredDate') || '');
    const problemDescription = String(fields.get('problemDescription') || '').trim();
    const next: Record<string, string> = {};
    const digits = customerPhone.replace(/\D/g, '');
    if (!/^\+?[\d\s()-]+$/.test(customerPhone) || digits.length < 7 || digits.length > 15) next.customerPhone = 'Enter a valid phone number.';
    if (address.length < 10 || address.length > 500) next.address = 'Enter an address between 10 and 500 characters.';
    if (!preferredDate || preferredDate < today()) next.preferredDate = 'Choose today or a future date.';
    if (problemDescription.length < 20 || problemDescription.length > 3000) next.problemDescription = 'Describe the problem in 20–3000 characters.';
    setErrors(next); setFailure('');
    if (Object.keys(next).length) return;
    setBusy(true);
    try {
      await authenticatedApiRequest('/api/bookings', { method: 'POST', body: JSON.stringify({ serviceId, customerPhone, address, preferredDate, problemDescription, ...(problemImage ? { problemImage } : {}) }) });
      setDone(true); notify('Your repair request has been sent.');
    } catch (error) {
      const message = error instanceof ApiError ? error.message : 'Could not send your request. Please try again.';
      setFailure(message); notify(message, 'error');
    } finally { setBusy(false); }
  }

  if (!open) return <Button className="request-button" onClick={() => setOpen(true)}>Request repair</Button>;
  return <form className="repair-form" onSubmit={submit} noValidate aria-busy={busy || uploading}><h2>Tell us what needs fixing</h2><p>Your preferred date is subject to the technician accepting the request.</p>
    <label htmlFor="repair-name">Name<input id="repair-name" value={data.user.name} readOnly /></label>
    <label htmlFor="repair-email">Email<input id="repair-email" type="email" value={data.user.email} readOnly /></label>
    <label htmlFor="repair-phone">Phone<input id="repair-phone" name="customerPhone" type="tel" autoComplete="tel" defaultValue={data.user.phone || ''} maxLength={24} disabled={busy} required aria-invalid={!!errors.customerPhone} aria-describedby="phone-error" /></label><p className="request-field-error" id="phone-error">{errors.customerPhone}</p>
    <label htmlFor="repair-address">Service / pickup address<textarea id="repair-address" name="address" autoComplete="street-address" rows={2} maxLength={500} required disabled={busy} aria-invalid={!!errors.address} aria-describedby="address-error" /></label><p className="request-field-error" id="address-error">{errors.address}</p>
    <label htmlFor="repair-date">Preferred date<input id="repair-date" name="preferredDate" type="date" min={today()} required disabled={busy} aria-invalid={!!errors.preferredDate} aria-describedby="date-error" /></label><p className="request-field-error" id="date-error">{errors.preferredDate}</p>
    <label htmlFor="repair-problem">What’s wrong?<textarea id="repair-problem" name="problemDescription" rows={4} minLength={20} maxLength={3000} required disabled={busy} placeholder="Describe the symptoms and when the problem started." aria-invalid={!!errors.problemDescription} aria-describedby="problem-error" /></label><p className="request-field-error" id="problem-error">{errors.problemDescription}</p>
    {failure && <p className="request-failure" role="alert">{failure}</p>}
    <div className="repair-photo-upload"><ImageUpload label="Damage photo (optional)" value={problemImage} onChange={setProblemImage} onBusyChange={setUploading} disabled={busy} successMessage="Damage photo uploaded. It will be attached when you send the repair request." /><p>You can send your request without a photo.</p></div>
    <Button type="submit" className="request-button" disabled={busy || uploading}>{busy ? 'Sending request…' : uploading ? 'Uploading photo…' : 'Send repair request'}</Button><Button variant="secondary" disabled={busy || uploading} onClick={() => setOpen(false)} className="request-button">Close form</Button>
  </form>;
}

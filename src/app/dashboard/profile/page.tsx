'use client';
import { useState } from 'react';
import { useSession } from '@/components/auth/session-provider';
import { useToast } from '@/components/ui/toast-provider';
import { ImageUpload } from '@/components/ui/image-upload';
import { Button } from '@/components/ui/button';
import { authenticatedApiRequest } from '@/lib/api';
import '@/app/profile.css';

type ProfileFields = { name: string; phone: string; area: string; bio: string; image: string };
export default function ProfilePage() {
  const { data, refetch } = useSession();
  if (!data) return null;
  const user = data.user;
  return <section><p className="eyebrow">YOUR ACCOUNT</p><h1>Update profile</h1><p>Keep your contact details and repair experience up to date.</p><ProfileEditor key={user.id} email={user.email} role={user.role || 'customer'} initial={{ name: user.name, phone: user.phone || '', area: user.area || '', bio: user.bio || '', image: user.image || '' }} refresh={async () => { await refetch(); }} /></section>;
}

function ProfileEditor({ initial, email, role, refresh }: { initial: ProfileFields; email: string; role: string; refresh: () => Promise<void> }) {
  const [fields, setFields] = useState(initial);
  const [errors, setErrors] = useState<Record<string, string>>({});
  const [busy, setBusy] = useState(false);
  const [uploading, setUploading] = useState(false);
  const [failure, setFailure] = useState('');
  const [saved, setSaved] = useState(false);
  const notify = useToast();
  function update(key: keyof ProfileFields, value: string) { setFields(previous => ({ ...previous, [key]: value })); setSaved(false); }
  async function submit(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault(); if (busy || uploading) return;
    const data = Object.fromEntries(Object.entries(fields).map(([key, value]) => [key, value.trim()])) as ProfileFields;
    const invalid: Record<string, string> = {};
    if (data.name.length < 2 || data.name.length > 100) invalid.name = 'Enter your name in 2–100 characters.';
    const digits = data.phone.replace(/\D/g, '');
    if (data.phone && (!/^\+?[\d\s()-]+$/.test(data.phone) || digits.length < 7 || digits.length > 15 || data.phone.length > 24)) invalid.phone = 'Enter a valid phone number.';
    if (data.area.length > 160) invalid.area = 'Area must be at most 160 characters.';
    if (data.bio.length > 2000) invalid.bio = 'Bio must be at most 2000 characters.';
    setErrors(invalid); setFailure(''); if (Object.keys(invalid).length) return;
    setBusy(true); setSaved(false);
    try {
      await authenticatedApiRequest('/api/users/profile', { method: 'PATCH', body: JSON.stringify(data) });
      setFields(data); setSaved(true);
      await refresh();
      notify('Your profile has been updated.');
    } catch (error) { const message = error instanceof Error ? error.message : 'Could not update your profile.'; setFailure(message); notify(message, 'error'); }
    finally { setBusy(false); }
  }
  return <form className="profile-editor" onSubmit={submit} noValidate aria-busy={busy || uploading}><ImageUpload value={fields.image} onChange={url => update('image', url)} onBusyChange={setUploading} disabled={busy} /><div className="profile-form-grid">
    <label htmlFor="profile-name">Full name<input id="profile-name" value={fields.name} onChange={event => update('name', event.target.value)} maxLength={100} autoComplete="name" disabled={busy || uploading} required aria-invalid={!!errors.name} aria-describedby="profile-name-error" /><span className="field-error" id="profile-name-error">{errors.name}</span></label>
    <label htmlFor="profile-phone">Phone<input id="profile-phone" value={fields.phone} onChange={event => update('phone', event.target.value)} type="tel" autoComplete="tel" maxLength={24} disabled={busy || uploading} aria-invalid={!!errors.phone} aria-describedby="profile-phone-error" /><span className="field-error" id="profile-phone-error">{errors.phone}</span></label>
    <label htmlFor="profile-email">Email<input id="profile-email" value={email} type="email" readOnly /></label><label htmlFor="profile-role">Role<input id="profile-role" value={role} readOnly /></label>
    <label htmlFor="profile-area" className="profile-wide">City / service area<input id="profile-area" value={fields.area} onChange={event => update('area', event.target.value)} maxLength={160} disabled={busy || uploading} aria-invalid={!!errors.area} aria-describedby="profile-area-error" /><span className="field-error" id="profile-area-error">{errors.area}</span></label>
    <label htmlFor="profile-bio" className="profile-wide">About you<textarea id="profile-bio" value={fields.bio} onChange={event => update('bio', event.target.value)} rows={5} maxLength={2000} disabled={busy || uploading} placeholder="Technicians: tell customers about your skills and experience." aria-invalid={!!errors.bio} aria-describedby="profile-bio-error" /><span className="field-error" id="profile-bio-error">{errors.bio}</span></label>
  </div>{failure && <p className="form-alert" role="alert">{failure}</p>}{saved && !failure && <p className="profile-saved" role="status">Your changes have been saved.</p>}<Button type="submit" disabled={busy || uploading}>{busy ? 'Saving profile…' : uploading ? 'Wait for upload…' : 'Save profile'}</Button></form>;
}

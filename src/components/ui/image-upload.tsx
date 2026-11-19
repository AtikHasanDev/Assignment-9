'use client';
import { useId, useRef, useState } from 'react';
import { uploadImage } from '@/lib/upload-image';
import { useToast } from './toast-provider';
import { Button } from './button';

export function ImageUpload({ value, onChange, onBusyChange, disabled = false, label = 'Profile photo', successMessage = 'Photo uploaded. Save your profile to apply it.' }: {
  value: string; onChange: (url: string) => void; onBusyChange: (busy: boolean) => void; disabled?: boolean; label?: string; successMessage?: string;
}) {
  const id = useId();
  const input = useRef<HTMLInputElement>(null);
  const [busy, setBusy] = useState(false);
  const [failure, setFailure] = useState('');
  const notify = useToast();
  async function select(file?: File) {
    if (!file || disabled || busy) return;
    setBusy(true); onBusyChange(true); setFailure('');
    try { onChange(await uploadImage(file)); notify(successMessage); }
    catch (error) { const message = error instanceof Error ? error.message : 'Image upload failed.'; setFailure(message); notify(message, 'error'); }
    finally { setBusy(false); onBusyChange(false); if (input.current) input.current.value = ''; }
  }
  return <div className="profile-photo-control"><label htmlFor={id}>{label}</label><div className="profile-photo-row">{value ? <img src={value} width={90} height={90} alt={'Selected ' + label.toLowerCase()} /> : <span className="photo-placeholder">No photo</span>}<div><input ref={input} id={id} type="file" accept="image/png,image/jpeg,image/webp" disabled={disabled || busy} onChange={event => select(event.target.files?.[0])} aria-describedby={id + '-help' + (failure ? ' ' + id + '-error' : '')} /><p id={id + '-help'}>PNG, JPEG, or WebP. Maximum 5 MB.</p>{value && <Button variant="secondary" disabled={disabled || busy} onClick={() => { onChange(''); setFailure(''); }}>Remove photo</Button>}</div></div>{busy && <p role="status">Uploading image…</p>}{failure && <p id={id + '-error'} role="alert" className="field-error">{failure}</p>}</div>;
}

'use client';
import { useEffect, useId, useRef, useState } from 'react';
import { Button } from '@/components/ui/button';

export function CompleteJobDialog({ job, busy, onComplete, onCancel }: {
  job: { _id: string; serviceTitle: string; basePrice: number } | null; busy: boolean; onComplete: (amount: number) => void; onCancel: () => void;
}) {
  const dialog = useRef<HTMLDialogElement>(null);
  const field = useRef<HTMLInputElement>(null);
  const id = useId();
  const [failure, setFailure] = useState('');
  useEffect(() => {
    if (job && !dialog.current?.open) { setFailure(''); dialog.current?.showModal(); if (field.current) field.current.value = String(job.basePrice); }
    if (!job && dialog.current?.open) dialog.current.close();
  }, [job]);
  function submit(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault(); if (busy) return;
    const text = field.current?.value || '';
    const amount = Number(text);
    if (!/^\d+(\.\d{1,2})?$/.test(text) || amount <= 0 || amount > 100000) { setFailure('Enter a positive USD amount with at most two decimal places.'); return; }
    setFailure(''); onComplete(amount);
  }
  return <dialog ref={dialog} className="confirmation-dialog complete-job-dialog" aria-labelledby={id + '-title'} onCancel={event => { event.preventDefault(); if (!busy) onCancel(); }}><form onSubmit={submit} noValidate aria-busy={busy}><h2 id={id + '-title'}>Complete this repair</h2><p>{job?.serviceTitle}. The customer can pay this amount after you mark the job completed.</p><label htmlFor={id + '-amount'}>Final amount (USD)</label><input autoFocus ref={field} id={id + '-amount'} type="number" min="0.01" max="100000" step="0.01" inputMode="decimal" required disabled={busy} aria-describedby={id + '-error'} aria-invalid={!!failure} /><p id={id + '-error'} className="amount-error">{failure}</p><div className="dialog-actions"><Button variant="secondary" disabled={busy} onClick={onCancel}>Keep in progress</Button><Button type="submit" disabled={busy}>{busy ? 'Completing…' : 'Mark completed'}</Button></div></form></dialog>;
}

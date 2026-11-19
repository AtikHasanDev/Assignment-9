'use client';
import { useEffect, useId, useRef } from 'react';
import { Button } from './button';

export function ConfirmationDialog({ open, title, description, confirmLabel, busy = false, onConfirm, onCancel }: {
  open: boolean; title: string; description: string; confirmLabel: string; busy?: boolean; onConfirm: () => void; onCancel: () => void;
}) {
  const dialog = useRef<HTMLDialogElement>(null);
  const titleId = useId(), descriptionId = useId();
  useEffect(() => {
    const element = dialog.current;
    if (open && !element?.open) element?.showModal();
    if (!open && element?.open) element.close();
  }, [open]);
  return <dialog ref={dialog} className="confirmation-dialog" aria-labelledby={titleId} aria-describedby={descriptionId} onCancel={event => { event.preventDefault(); if (!busy) onCancel(); }}>
    <h2 id={titleId}>{title}</h2><p id={descriptionId}>{description}</p><div className="dialog-actions"><Button autoFocus variant="secondary" disabled={busy} onClick={onCancel}>Keep request</Button><Button variant="danger" disabled={busy} onClick={onConfirm}>{busy ? 'Cancelling…' : confirmLabel}</Button></div>
  </dialog>;
}

'use client';

import { Children, Fragment, useId, useState, useSyncExternalStore, type ReactNode } from 'react';
import '@/app/record-table.css';

const desktopQuery = '(min-width: 1001px)';
const subscribe = (listener: () => void) => { const media = window.matchMedia(desktopQuery); media.addEventListener('change', listener); return () => media.removeEventListener('change', listener); };
const desktopSnapshot = () => window.matchMedia(desktopQuery).matches;
const serverSnapshot = () => false;

type Row = { id: string; cells: ReactNode[] };

export function RecordTable({ caption, columns, rows, children, detailLabel = 'Details & actions' }: { caption: string; columns: string[]; rows: Row[]; children: ReactNode; detailLabel?: string }) {
  const desktop = useSyncExternalStore(subscribe, desktopSnapshot, serverSnapshot);
  const [expanded, setExpanded] = useState<Set<string>>(() => new Set());
  const tableId = useId();
  const details = Children.toArray(children);
  if (!desktop) return <div className="record-mobile-list">{children}</div>;
  return <div className="record-table-region" role="region" aria-label={caption} tabIndex={0}><table className="d-table record-table"><caption className="sr-only">{caption}</caption><thead><tr>{columns.map(column => <th scope="col" key={column}>{column}</th>)}<th scope="col">{detailLabel}</th></tr></thead><tbody>{rows.map((row,index) => {
    const open = expanded.has(row.id);
    const detailId = tableId + '-' + row.id;
    return <Fragment key={row.id}><tr>{row.cells.map((cell,cellIndex) => <td key={cellIndex}>{cell}</td>)}<td><button type="button" className="record-detail-button" aria-expanded={open} aria-controls={detailId} onClick={() => setExpanded(previous => { const next = new Set(previous); if (next.has(row.id)) next.delete(row.id); else next.add(row.id); return next; })}>{open ? 'Close details' : detailLabel}<span aria-hidden="true">{open ? '−' : '+'}</span></button></td></tr><tr id={detailId} hidden={!open} className="record-detail-row"><td colSpan={columns.length+1}>{open && details[index]}</td></tr></Fragment>;
  })}</tbody></table></div>;
}

export function RecordIdentity({ image, title, subtitle }: { image?: string; title: string; subtitle?: ReactNode }) {
  return <div className="record-identity">{image && <img src={image} alt="" width={54} height={44} loading="lazy" />}<div><strong>{title}</strong>{subtitle && <span>{subtitle}</span>}</div></div>;
}

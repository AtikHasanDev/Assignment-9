import { Button } from '@/components/ui/button';

export function AdminPagination({ page, totalPages, total, disabled, onChange }: { page: number; totalPages: number; total: number; disabled: boolean; onChange: (page: number) => void }) {
  return <nav className="admin-pagination" aria-label="Results pages"><Button variant="secondary" disabled={disabled || page <= 1} onClick={() => onChange(page - 1)}>Previous</Button><span aria-live="polite">Page {page} of {Math.max(1, totalPages)} · {total} records</span><Button variant="secondary" disabled={disabled || page >= totalPages} onClick={() => onChange(page + 1)}>Next</Button></nav>;
}

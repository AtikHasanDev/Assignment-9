'use client';
import { useState } from 'react';
import { useSession } from '@/components/auth/session-provider';
import { useAdminList } from '@/components/admin/use-admin-list';
import { AdminPagination } from '@/components/admin/pagination';
import { authenticatedApiRequest, ApiError } from '@/lib/api';
import { Button } from '@/components/ui/button';
import { ConfirmationDialog } from '@/components/ui/confirmation-dialog';
import { EmptyState } from '@/components/ui/empty-state';
import { useToast } from '@/components/ui/toast-provider';
import '@/app/admin.css';

type Role = 'customer' | 'technician' | 'admin';
type Account = { _id: string; name: string; email: string; role: Role; image?: string; createdAt?: string };
export default function ManageUsersPage() {
  const list = useAdminList<Account>('users');
  const { data } = useSession();
  const [selection, setSelection] = useState<Record<string, Role>>({});
  const [changing, setChanging] = useState<{ account: Account; role: Role } | null>(null);
  const [busy, setBusy] = useState(false);
  const notify = useToast();
  async function changeRole() {
    if (!changing || busy) return;
    setBusy(true);
    try {
      await authenticatedApiRequest('/api/admin/users/' + changing.account._id + '/role', { method: 'PATCH', body: JSON.stringify({ role: changing.role }) });
      notify('User role updated.'); setChanging(null); setSelection({}); list.refresh();
    } catch (error) {
      notify(error instanceof Error ? error.message : 'Could not change role.', 'error');
      if (error instanceof ApiError && [403, 404].includes(error.status)) { setChanging(null); list.refresh(); }
    } finally { setBusy(false); }
  }
  return <section><div className="dashboard-page-heading"><div><p className="eyebrow">ADMINISTRATION</p><h1>Manage users</h1><p>Review registered accounts and their access. Your own role is protected.</p></div><Button variant="secondary" disabled={busy || list.loading} onClick={() => { setSelection({}); list.refresh(); }}>Refresh users</Button></div>
    {list.loading ? <p role="status">Loading users…</p> : list.failure ? <div role="alert" className="dashboard-error"><p>{list.failure}</p><Button onClick={list.refresh}>Try again</Button></div> : !list.items.length ? <EmptyState title="No accounts found" description="Registered users will appear here." /> : <><div className="admin-users">{list.items.map(account => {
      const self = account._id === data?.user.id;
      const role = selection[account._id] || account.role;
      return <article className="admin-user" key={account._id}><div className="admin-user-identity">{account.image ? <img className="admin-user-avatar" src={account.image} alt="" width={48} height={48} /> : <span className="admin-user-avatar" aria-hidden="true">{account.name.slice(0, 1)}</span>}<div><h2>{account.name}</h2><p>{account.email}</p><p className="admin-user-joined">Joined: {account.createdAt && Number.isFinite(new Date(account.createdAt).getTime()) ? new Intl.DateTimeFormat('en-GB', { dateStyle: 'medium', timeZone: 'Asia/Dhaka' }).format(new Date(account.createdAt)) : 'Not recorded'}</p><span className="admin-role">Current role: {account.role}{self ? ' · You' : ''}</span></div></div><div className="admin-role-controls"><label htmlFor={'role-' + account._id}>Account role<select id={'role-' + account._id} value={role} disabled={busy || self} onChange={event => setSelection(previous => ({ ...previous, [account._id]: event.target.value as Role }))}><option value="customer">Customer</option><option value="technician">Technician</option><option value="admin">Administrator</option></select></label><Button disabled={busy || self || role === account.role} onClick={() => setChanging({ account, role })}>Update role</Button></div></article>;
    })}</div><AdminPagination page={list.page} totalPages={list.totalPages} total={list.total} disabled={busy || list.loading} onChange={page => { setSelection({}); list.setPage(page); }} /></>}
    <ConfirmationDialog open={!!changing} title="Change account access?" description={changing ? 'Change ' + changing.account.name + ' (' + changing.account.email + ') from ' + changing.account.role + ' to ' + changing.role + '?' + (changing.role === 'admin' ? ' This grants administrator access to users and service approvals.' : ' Their dashboard and permitted actions will change.') : ''} confirmLabel="Change role" cancelLabel="Keep current role" busyLabel="Updating…" busy={busy} onConfirm={changeRole} onCancel={() => setChanging(null)} />
  </section>;
}

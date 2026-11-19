const labels = {
  requested: 'Requested', accepted: 'Accepted', 'in-progress': 'In progress',
  completed: 'Completed', rejected: 'Rejected', cancelled: 'Cancelled',
  pending: 'Pending', approved: 'Approved', paid: 'Paid', unpaid: 'Unpaid',
} as const;

export type Status = keyof typeof labels;

export function StatusBadge({ status }: { status: Status }) {
  return <span className={'status-badge status-badge--' + status}>{labels[status]}</span>;
}


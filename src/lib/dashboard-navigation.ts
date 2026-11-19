export type DashboardRole = 'customer' | 'technician' | 'admin';
export type DashboardLink = { href: string; label: string; icon: 'overview' | 'bookings' | 'payments' | 'add' | 'services' | 'requests' | 'users'; ready: boolean };
export function dashboardLinks(role: DashboardRole): DashboardLink[] {
  const base = '/dashboard/' + role;
  const overview: DashboardLink = { href: base, label: 'Overview', icon: 'overview', ready: true };
  if (role === 'customer') return [overview,
    { href: base + '/bookings', label: 'My bookings', icon: 'bookings', ready: true },
    { href: base + '/payments', label: 'Payment history', icon: 'payments', ready: false },
  ];
  if (role === 'technician') return [overview,
    { href: base + '/add-service', label: 'Add a service', icon: 'add', ready: false },
    { href: base + '/my-services', label: 'My services', icon: 'services', ready: false },
    { href: base + '/requests', label: 'Manage requests', icon: 'requests', ready: true },
  ];
  return [overview,
    { href: base + '/users', label: 'Manage users', icon: 'users', ready: false },
    { href: base + '/services', label: 'Service approval', icon: 'services', ready: false },
    { href: base + '/bookings', label: 'All bookings', icon: 'bookings', ready: false },
    { href: base + '/transactions', label: 'Transactions', icon: 'payments', ready: false },
  ];
}

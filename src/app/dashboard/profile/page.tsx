'use client';
import { useSession } from '@/components/auth/session-provider';

export default function ProfilePage() {
  const { data } = useSession();
  if (!data) return null;
  const user = data.user;
  return <section><p className="eyebrow">YOUR ACCOUNT</p><h1>My profile</h1><div className="dashboard-chart profile-summary"><div className="profile-avatar">{user.image ? <img src={user.image} alt="" width={80} height={80} /> : user.name.slice(0, 1).toUpperCase()}</div><h2>{user.name}</h2><dl>{[['Email', user.email], ['Role', user.role], ['Phone', user.phone], ['Area', user.area], ['Bio', user.bio]].map(([label, value]) => <div key={label}><dt>{label}</dt><dd>{value || 'Not provided'}</dd></div>)}</dl></div></section>;
}

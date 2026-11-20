import Link from 'next/link';
import { Wrench, Check } from 'lucide-react';

export function ProfessionalInvitation() {
  return <section className="professional-invitation" aria-labelledby="professional-heading"><div className="container professional-inner"><div className="professional-emblem" aria-hidden="true"><Wrench size={61} strokeWidth={1.3} /></div><div className="professional-copy"><p className="eyebrow">GOOD WITH REPAIRS?</p><h2 id="professional-heading">Your skills. Someone’s fresh start.</h2><p>Bring your expertise to FixMate. Create a technician profile, list your repair services, and manage your work in one place.</p><ul><li><Check size={16} />Your own service listings</li><li><Check size={16} />Clear job management</li></ul></div><Link className="d-btn d-btn-secondary professional-button" href="/sign-up?role=technician">Register as a Professional</Link></div></section>;
}

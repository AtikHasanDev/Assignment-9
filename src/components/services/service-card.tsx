import Link from 'next/link';
import { MapPin, Clock, UserRound } from 'lucide-react';
import type { RepairService } from '@/lib/services';

export function ServiceCard({ service }: { service: RepairService }) {
  return <article className="service-card"><div className="service-photo"><img src={service.image} alt={service.title} loading="lazy" /><span>{service.category}</span></div><div className="service-card-body"><p className="service-mode">{service.serviceMode}</p><h3>{service.title}</h3><p className="service-meta"><MapPin size={16} aria-hidden="true" />{service.serviceArea}</p><p className="service-meta"><Clock size={16} aria-hidden="true" />{service.estimatedDuration}</p><p className="service-meta"><UserRound size={16} aria-hidden="true" />{service.technicianName}</p><div className="service-card-bottom"><span>From <strong>{new Intl.NumberFormat('en-US', { style: 'currency', currency: 'USD' }).format(service.basePrice)}</strong></span><Link href={'/services/' + service._id} aria-label={'View details for ' + service.title}>View details</Link></div></div></article>;
}

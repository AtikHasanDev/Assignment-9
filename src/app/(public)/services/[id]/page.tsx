import type { Metadata } from 'next';
import Link from 'next/link';
import { notFound } from 'next/navigation';
import { MapPin, Clock, Wrench, ShieldCheck } from 'lucide-react';
import { getService } from '@/lib/services';
import { RepairRequest } from '@/components/services/repair-request';
import '@/app/service-details.css';

export const metadata: Metadata = { title: 'Repair service details' };
export default async function ServiceDetailsPage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;
  const service = await getService(id);
  if (!service) notFound();
  const technician = service.technician;
  return <div className="container page-section"><Link href="/services" className="back-link">Back to services</Link><div className="service-detail-layout"><article><div className="detail-image"><img src={service.image} alt={service.title} /></div><p className="eyebrow detail-category">{service.category}</p><h1 className="detail-title">{service.title}</h1><div className="detail-facts"><span><Wrench size={18} />{service.serviceMode}</span><span><Clock size={18} />{service.estimatedDuration}</span><span><MapPin size={18} />{service.serviceArea}</span></div><section className="detail-description"><h2>What’s included</h2><p>{service.description}</p></section><section className="technician-summary"><div className="technician-heading">{technician?.image ? <img src={technician.image} alt="" width={64} height={64} /> : <span className="technician-initial">{(technician?.name || service.technicianName).slice(0, 1).toUpperCase()}</span>}<div><p className="eyebrow">YOUR TECHNICIAN</p><h2>{technician?.name || service.technicianName}</h2><p>{technician?.area || service.serviceArea}</p></div></div><p>{technician?.bio || 'This technician offers repair services in the area listed above.'}</p></section></article><aside className="booking-aside"><div className="detail-price"><span>Starting at</span><strong>{new Intl.NumberFormat('en-US', { style: 'currency', currency: 'USD' }).format(service.basePrice)}</strong><p>The final amount is set after the repair is complete.</p></div><div className="detail-promise"><ShieldCheck size={22} aria-hidden="true" /><span>Request now. Pay after completion.</span></div><RepairRequest serviceId={service._id} /></aside></div></div>;
}

export type RepairService = {
  _id: string; title: string; category: string; description: string; image: string;
  basePrice: number; estimatedDuration: string; serviceMode: string; serviceArea: string;
  technicianName: string; technicianEmail: string;
};
export type ServicePage = { items: RepairService[]; total: number; page: number; totalPages: number };
export type ServiceDetails = RepairService & { technician: { name: string; image?: string; area?: string; bio?: string } | null };

export async function getService(id: string): Promise<ServiceDetails | null> {
  if (!/^[a-f\d]{24}$/i.test(id)) return null;
  const base = process.env.API_URL || process.env.NEXT_PUBLIC_API_URL || 'http://localhost:5000';
  const response = await fetch(base + '/api/services/' + id, { cache: 'no-store', signal: AbortSignal.timeout(8000) });
  if (response.status === 404) return null;
  if (!response.ok) throw new Error('Service details are temporarily unavailable.');
  return response.json();
}

export async function getFeaturedServices(): Promise<ServicePage> {
  return getServices(new URLSearchParams({ sort: 'newest', limit: '6' }));
}

export async function getServices(params: URLSearchParams): Promise<ServicePage> {
  const base = process.env.API_URL || process.env.NEXT_PUBLIC_API_URL || 'http://localhost:5000';
  const response = await fetch(base + '/api/services?' + params.toString(), { cache: 'no-store', signal: AbortSignal.timeout(8000) });
  if (response.status === 400) throw new Error('Some search options are invalid. Reset your filters and try again.');
  if (!response.ok) throw new Error('Services are unavailable.');
  return response.json();
}

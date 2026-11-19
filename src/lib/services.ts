export type RepairService = {
  _id: string; title: string; category: string; description: string; image: string;
  basePrice: number; estimatedDuration: string; serviceMode: string; serviceArea: string;
  technicianName: string; technicianEmail: string;
};
export type ServicePage = { items: RepairService[]; total: number; page: number; totalPages: number };

export async function getFeaturedServices(): Promise<ServicePage> {
  const base = process.env.API_URL || process.env.NEXT_PUBLIC_API_URL || 'http://localhost:5000';
  const response = await fetch(base + '/api/services?sort=newest&limit=6', { cache: 'no-store', signal: AbortSignal.timeout(8000) });
  if (!response.ok) throw new Error('Services are unavailable.');
  return response.json();
}

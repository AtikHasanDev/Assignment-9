'use client';
import { usePaginatedList } from '@/lib/use-paginated-list';

export function useAdminList<T>(resource: string, query = '') {
  return usePaginatedList<T>('/api/admin/' + resource, query);
}

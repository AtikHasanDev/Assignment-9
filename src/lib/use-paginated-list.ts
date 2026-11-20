'use client';
import { useEffect, useState } from 'react';
import { authenticatedApiRequest } from '@/lib/api';

export function usePaginatedList<T>(path: string, query = '') {
  const [items, setItems] = useState<T[]>([]);
  const [page, setPage] = useState(1);
  const [total, setTotal] = useState(0);
  const [totalPages, setTotalPages] = useState(0);
  const [totalRevenue, setTotalRevenue] = useState(0);
  const [loading, setLoading] = useState(true);
  const [failure, setFailure] = useState('');
  const [attempt, setAttempt] = useState(0);
  useEffect(() => {
    let active = true;
    setLoading(true); setFailure('');
    authenticatedApiRequest<{ items: T[]; total: number; totalPages: number; totalRevenue?: number }>(path + '?page=' + page + '&limit=12' + query)
      .then(data => {
        if (!active) return;
        if (page > Math.max(1, data.totalPages)) { setPage(Math.max(1, data.totalPages)); return; }
        setItems(data.items); setTotal(data.total); setTotalPages(data.totalPages);
        setTotalRevenue(data.totalRevenue || 0);
      })
      .catch(error => { if (active) setFailure(error.message || 'Could not load records.'); })
      .finally(() => { if (active) setLoading(false); });
    return () => { active = false; };
  }, [path, query, page, attempt]);
  return { items, page, setPage, total, totalPages, totalRevenue, loading, failure, refresh: () => setAttempt(value => value + 1) };
}

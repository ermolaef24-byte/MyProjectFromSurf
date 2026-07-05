import { useState, useEffect, useCallback } from 'react';
import { listSlots, listInstructors } from '../api/slots';
import type { SlotSummary, SlotFilters, Instructor } from '../api/types';

export function useSlots() {
  const [slots, setSlots] = useState<SlotSummary[]>([]);
  const [total, setTotal] = useState(0);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [instructors, setInstructors] = useState<Instructor[]>([]);
  const [filters, setFilters] = useState<SlotFilters>({ limit: 50, offset: 0 });

  const fetchSlots = useCallback(async (f: SlotFilters) => {
    setLoading(true);
    setError(null);
    try {
      const data = await listSlots(f);
      const items = Array.isArray(data?.items) ? data.items : [];
      setSlots(items);
      setTotal(data?.meta?.total ?? 0);
    } catch (e) {
      console.error('[useSlots] error fetching slots:', e);
      setError(e instanceof Error ? e.message : 'Ошибка загрузки');
      setSlots([]);
    } finally {
      setLoading(false);
    }
  }, []);

  const fetchInstructors = useCallback(async () => {
    try {
      const data = await listInstructors();
      setInstructors(Array.isArray(data?.items) ? data.items : []);
    } catch {
      // ignore
    }
  }, []);

  useEffect(() => {
    fetchInstructors();
  }, [fetchInstructors]);

  useEffect(() => {
    fetchSlots(filters);
  }, [filters, fetchSlots]);

  const updateFilters = useCallback((patch: Partial<SlotFilters>) => {
    setFilters(f => ({ ...f, ...patch, offset: 0 }));
  }, []);

  const resetFilters = useCallback(() => {
    setFilters({ limit: 50, offset: 0 });
  }, []);

  return {
    slots,
    total,
    loading,
    error,
    instructors,
    filters,
    updateFilters,
    resetFilters,
    refresh: () => fetchSlots(filters),
  };
}

import { api } from './client';
import type { SlotListResponse, Slot, SlotFilters, InstructorListResponse } from './types';

export function listSlots(filters: SlotFilters = {}): Promise<SlotListResponse> {
  const params: Record<string, string | string[] | number | boolean | undefined> = {};

  if (filters.date_from) params.date_from = filters.date_from;
  if (filters.date_to) params.date_to = filters.date_to;
  if (filters.route_type?.length) params.route_type = filters.route_type;
  if (filters.instructor_id?.length) params.instructor_id = filters.instructor_id;
  if (filters.only_available) params.only_available = true;
  if (filters.limit !== undefined) params.limit = filters.limit;
  if (filters.offset !== undefined) params.offset = filters.offset;

  return api.get<SlotListResponse>('/slots', params);
}

export function getSlot(id: string): Promise<Slot> {
  return api.get<Slot>(`/slots/${id}`);
}

export function listInstructors(): Promise<InstructorListResponse> {
  return api.get<InstructorListResponse>('/instructors');
}

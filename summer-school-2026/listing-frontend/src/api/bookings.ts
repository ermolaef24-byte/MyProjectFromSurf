import { api } from './client';
import type { BookingListResponse } from './types';

interface CreateBookingRequest {
  slot_id: string;
  seats_count: number;
  rental_count: number;
}

export function listBookings(status?: string): Promise<BookingListResponse> {
  const params = status ? { status } : undefined;
  return api.get<BookingListResponse>('/bookings', params as Record<string, string>);
}

export function getBooking(id: string): Promise<unknown> {
  return api.get(`/bookings/${id}`);
}

export function createBooking(data: CreateBookingRequest, idempotencyKey: string): Promise<{ id: string; price: { total: number } }> {
  return api.post('/bookings', data, { 'Idempotency-Key': idempotencyKey });
}

export function cancelBooking(id: string): Promise<void> {
  return api.post(`/bookings/${id}/cancel`);
}

export interface Route {
  id: string;
  name: string;
  type: 'novice' | 'experienced';
  capacity_cap: number;
  duration_min: number;
}

export interface Instructor {
  id: string;
  name: string;
}

export type SlotStatus = 'scheduled' | 'cancelled';

export interface SlotSummary {
  id: string;
  start_at: string;
  route: Route;
  instructor: Instructor;
  total_seats: number;
  free_seats: number;
  free_rental_boards: number;
  price: number;
  rental_price: number;
  status: SlotStatus;
}

export interface Slot extends SlotSummary {
  meeting_point: string;
  meeting_point_lat: number;
  meeting_point_lng: number;
}

export interface PaginationMeta {
  limit: number;
  offset: number;
  total: number;
}

export interface SlotListResponse {
  items: SlotSummary[];
  meta: PaginationMeta;
}

export interface InstructorListResponse {
  items: Instructor[];
  meta: PaginationMeta;
}

export type BookingStatus = 'active' | 'cancelled' | 'late_cancel';

export interface Booking {
  id: string;
  slot: SlotSummary;
  seats_count: number;
  rental_count: number;
  price: number;
  status: BookingStatus;
  created_at: string;
}

export interface BookingListResponse {
  items: Booking[];
  meta: PaginationMeta;
}

export interface ApiError {
  code: string;
  message: string;
  details?: {
    available_seats?: number;
    available_rental_boards?: number;
  };
}

export interface SlotFilters {
  date_from?: string;
  date_to?: string;
  route_type?: string[];
  instructor_id?: string[];
  only_available?: boolean;
  limit?: number;
  offset?: number;
}

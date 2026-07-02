import axios from "axios";

// Base URL of the backend API. Override in Vercel via NEXT_PUBLIC_API_URL.
export const API_BASE_URL =
  process.env.NEXT_PUBLIC_API_URL ?? "https://carrier-erp-mvp.onrender.com/api/v1";

export const api = axios.create({
  baseURL: API_BASE_URL,
  timeout: 30_000, // Render free tier can cold-start; give it room
});

// ─── Response shapes (mirror backend) ─────────────────────────────────────────

export interface Paginated<T> {
  data: T[];
  meta: { total: number; page: number; limit: number; totalPages: number };
}

export type BookingStatus =
  | "PENDING"
  | "CONFIRMED"
  | "ROLLED_OVER"
  | "CANCELLED"
  | "COMPLETED";

export interface Vessel {
  id: string;
  name: string;
  imo: string;
  flagState: string;
  vesselType: string;
  teuCapacity: number;
  status: string;
}

export interface Customer {
  id: string;
  name: string;
  code: string;
  country: string;
  tier: string;
}

export interface Booking {
  id: string;
  bookingRef: string;
  pol: string;
  pod: string;
  teu: number;
  status: BookingStatus;
  customer?: Customer;
  voyage?: { id: string; voyageNo: string; vessel?: Vessel };
  createdAt: string;
}

export interface BillOfLading {
  id: string;
  blNumber: string;
  status: "DRAFT" | "ISSUED" | "SURRENDERED" | "CANCELLED" | "AMENDED";
  amendmentSeq: number;
}

// ─── Fetchers ─────────────────────────────────────────────────────────────────

export async function fetchVessels() {
  const { data } = await api.get<Paginated<Vessel>>("/vessels", { params: { limit: 100 } });
  return data;
}

export async function fetchBookings() {
  const { data } = await api.get<Paginated<Booking>>("/bookings", { params: { limit: 100 } });
  return data;
}

export async function fetchBillsOfLading() {
  const { data } = await api.get<Paginated<BillOfLading>>("/documentation/bills-of-lading", {
    params: { limit: 100 },
  });
  return data;
}

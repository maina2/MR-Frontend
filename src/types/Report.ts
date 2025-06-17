export interface Report {
  id: number;
  parcel_id: string;
  customer_name: string;
  delivery_address: string;
  delivery_city: string;
  created_at: string;
  delivered_at?: string;
}
export interface PaginatedReports {
  count: number;
  next: string | null;
  previous: string | null;
  results: Report[];
}

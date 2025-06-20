export interface SearchResult {
  type: "Delivery";
  id: number;
  parcel_id: string;
  customer_name: string;
  customer_phone: string;
  delivery_address: string;
  delivery_postal_code: string | null;
  delivery_city: string;
  delivery_status: "pending" | "in_transit" | "delivered" | "cancelled";
  delivery_cost: string;
  created_at: string;
  delivered_at: string | null;
}

export interface SearchResponse {
  results: SearchResult[];
}

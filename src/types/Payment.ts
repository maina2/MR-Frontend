export type Payment = {
  parcel_id: string;
  customer_name: string;
  delivery_status: "pending" | "in_transit" | "delivered" | "cancelled";
  delivery_cost: string | null;
  delivered_at: string | null;
};

export type PaginatedPayments = {
  count: number;
  next: string | null;
  previous: string | null;
  results: Payment[];
};
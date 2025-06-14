export type Customer = {
  customer_name: string;
  customer_phone: string;
  delivery_address: string;
  delivery_status: "pending" | "in_transit" | "delivered" | "cancelled";
  delivered_at: string | null;
};

export type PaginatedCustomers = {
  count: number;
  next: string | null;
  previous: string | null;
  results: Customer[];
};
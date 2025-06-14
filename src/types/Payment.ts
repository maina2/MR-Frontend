export type Payment = {
  parcel_id: string;
  customer_name: string;
  delivery_cost: number | null;
  delivered_at: string | null;
};
export type Payment = {
  parcel_id: string;
  customer_name: string;
//   status: 'pending' | 'in_transit' | 'delivered' | 'cancelled';
  delivery_cost: number | null;
  delivered_at: string | null;
};
export type Customer = {
  id: number;
  name: string;
  phone: string;
  address: string;
  postal_code: string;
  city: string;
}

export type Delivery = {
  id: number;
  parcel_id: string;
  customer: Customer | null;
  delivery_address: string | null;
  delivery_postal_code: string | null;
  delivery_city: string | null;
  delivery_status: 'pending' | 'in_transit' | 'delivered' | 'cancelled';
  created_at: string | null;
  delivered_at: string | null;
};
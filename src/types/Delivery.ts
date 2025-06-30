export type Delivery = {
  id: number;
  parcel_id: string;
  customer_name: string;
  customer_phone: string;
  delivery_address: string;
  delivery_town: string;
  delivery_route: 'Langata' | 'Ngong' | 'Jogoo' | 'Mombasa' | 'Thika' | 'Waiyaki' | 'Kiambu' | 'Limuru' | 'Ardhwings_Kodek' | 'Lower_Kabete' | 'Peponi' | null;
  delivery_status: 'pending' | 'in_transit' | 'delivered' | 'cancelled';
  delivery_cost: string | null;
  created_at: string;
  delivered_at: string | null;
  is_paid: boolean;
};

export type PaginatedDeliveries = {
  count: number;
  next: string | null;
  previous: string | null;
  results: Delivery[];
};

export type MpesaTransaction = {
  id: number;
  delivery: number;
  checkout_request_id: string;
  phone_number: string;
  amount: string;
  status: 'initiated' | 'completed' | 'failed' | 'cancelled';
  transaction_date: string;
  mpesa_receipt_number: string | null;
  result_code: string | null;
  result_desc: string | null;
};
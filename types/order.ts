// types/order.ts

export interface Size {
  id: number;
  name: string;
  stock: number;
}

export interface OrderItem {
  id?: number;
  quantity: number;
  unitPrice: number;
  totalPrice: number;
  sizeId?: number;
  size?: Size; // Beden bilgisi eklendi
  product: {
    id: number;
    title: string;
    mainImage: string;
    category: string;
    description: string;
  };
}

export interface Address {
  id?: number;
  type: "shipping" | "billing";
  firstName?: string;
  lastName?: string;
  address: string;
  district?: string;
  city: string;
  zip?: string;
  phone?: string;
  country: string;
  tcno?: string;
}

export interface FormattedOrder {
  id: number;
  user: {
    id?: number;
    name: string;
    surname: string;
    email: string;
  };
  totalPrice: number; // TL cinsinden (API'den kuruştan çevrilmiş olarak gelir)
  paidPrice: number; // TL cinsinden (API'den kuruştan çevrilmiş olarak gelir)
  paymentMethod?: string;
  transactionId?: string | null;
  status: "pending" | "paid" | "shipped" | "delivered" | "cancelled";
  createdAt: string;
  updatedAt: string;
  items: OrderItem[];
  addresses: Address[];
  currency?: string;
  installment?: number; // Taksit sayısı
  discountAmount?: number | null; // İndirim tutarı (TL)
  couponCode?: string | null; // Kullanılan kupon kodu
}

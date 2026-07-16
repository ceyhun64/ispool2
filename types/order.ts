// types/order.ts - Prisma Schema'ya Tam Uyumlu

export interface Size {
  id: number;
  value: string; // Schema'da "value" olarak tanımlı (örn: "36", "XL", "Standart")
  sortOrder?: number;
  isActive?: boolean;
  createdAt?: string;
  updatedAt?: string;
}

export interface OrderItem {
  id: number;
  orderId: number;
  productId: number;
  quantity: number;
  unitPrice: number; // Float - Schema'da Float
  totalPrice: number; // Float - Schema'da Float
  iyziTransactionId?: string | null; // İyzico transaction ID
  customImage?: string | null; // Özel tasarım resmi
  sizeId?: number | null; // Beden ID
  size?: Size | null; // Beden bilgisi (relation)
  product: {
    id: number;
    title: string;
    mainImage: string;
    price?: number;
    description?: string;
    categoryId?: number;
    brandId?: number;
  };
}

export interface OrderAddress {
  id: number;
  orderId: number;
  type: string; // "shipping" | "billing"
  firstName: string;
  lastName: string;
  address: string;
  district: string;
  city: string;
  zip: string; // Posta kodu - Schema'da String
  phone: string;
  country: string;
  tcno?: string | null; // TC Kimlik No veya Vergi Numarası - VarChar(11)
  billingType?: "bireysel" | "kurumsal" | null; // Sadece type "billing" için
}

export interface User {
  id: number;
  name: string;
  surname: string;
  email: string;
  phone?: string | null;
  role?: "USER" | "ADMIN";
  createdAt?: string;
  updatedAt?: string;
}

export interface FormattedOrder {
  id: number;
  userId: number;
  status: "pending" | "paid" | "shipped" | "delivered" | "cancelled"; // OrderStatus enum
  totalPrice: number; // Int - Kuruştan TL'ye çevrilmiş (API response'da)
  paidPrice: number; // Int - Kuruştan TL'ye çevrilmiş (API response'da)
  currency: string; // String - "TRY", "USD", "EUR"
  installment: number; // Int - Taksit sayısı (default: 1)
  iyziPaymentId?: string | null; // İyzico payment ID
  paymentMethod: string; // "iyzipay", "credit_card", "bank_transfer"
  transactionId?: string | null; // İşlem numarası
  couponCode?: string | null; // Kupon kodu
  discountAmount?: number | null; // Float - İndirim tutarı (TL)
  createdAt: string; // DateTime - ISO string
  updatedAt: string; // DateTime - ISO string

  // Relations
  user: User;
  items: OrderItem[];
  addresses: OrderAddress[];
}

// API'den gelen ham order response tipi (kuruş cinsinden fiyatlar)
export interface RawOrderFromDB {
  id: number;
  userId: number;
  status: "pending" | "paid" | "shipped" | "delivered" | "cancelled";
  totalPrice: number; // Int - Kuruş cinsinden
  paidPrice: number; // Int - Kuruş cinsinden
  currency: string;
  installment: number;
  iyziPaymentId?: string | null;
  paymentMethod: string;
  transactionId?: string | null;
  couponCode?: string | null;
  discountAmount?: number | null;
  createdAt: Date;
  updatedAt: Date;
  user: User;
  items: OrderItem[];
  addresses: OrderAddress[];
}

// Sipariş oluşturma request body tipi
export interface CreateOrderRequest {
  userId: number;
  basketItems: BasketItem[];
  shippingAddress: AddressInput;
  billingAddress: AddressInput;
  totalPrice: number;
  paidPrice: number;
  baseTotalPrice?: number;
  currency?: string;
  paymentMethod?: string;
  transactionId?: string;
  firstName?: string;
  lastName?: string;
  email?: string;
  paymentCard: PaymentCard;
  buyer: Buyer;
  installment?: number;
  couponCode?: string;
  discountAmount?: number;
}

export interface BasketItem {
  id: number;
  productId?: number;
  name: string;
  totalPrice: number;
  unitPrice: number;
  category?: string;
  quantity?: number;
  sizeId?: number; // Size ID
  customImage?: string;
}

export interface AddressInput {
  firstName?: string;
  lastName?: string;
  address: string;
  district: string;
  city: string;
  zipCode?: string;
  zip?: string;
  phone: string;
  country: string;
  tcno?: string;
  billingType?: "bireysel" | "kurumsal";
}

export interface PaymentCard {
  cardHolderName: string;
  cardNumber: string;
  expireMonth: string;
  expireYear: string;
  cvc: string;
  registerCard?: string;
}

export interface Buyer {
  id?: string;
  name?: string;
  surname?: string;
  buyerName?: string;
  buyerSurname?: string;
  email: string;
  identityNumber?: string;
  registrationAddress?: string;
  registrationDate?: string;
  lastLoginDate?: string;
  phone: string;
  city: string;
  country?: string;
  zipCode?: string;
  ip?: string;
  tcno?: string;
}

// Sipariş durumu güncelleme request body
export interface UpdateOrderStatusRequest {
  orderId: number;
  status: "pending" | "paid" | "shipped" | "delivered" | "cancelled";
}

// Sipariş iptal request body (user)
export interface CancelOrderRequest {
  orderId: number;
}

// Helper type: Address için kullanılan tip (eski uyumluluk için)
export interface Address extends OrderAddress {}

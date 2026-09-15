export interface Book {
  id: number;
  title: string;
  author: string;
  price: number;
  originalPrice?: number;
  coverColor: string;
  coverTextColor: string;
  format: 'Paperback' | 'Hard Cover' | 'eBook';
  genres: string[];
  categoryId: string;
  publisherId: string;
  deliveryDate: string;
  badge?: string;
  rating?: number;
  ratingCount?: number;
  description?: string;
  pages?: number;
  language?: string;
  isbn?: string;
}

export interface Publisher {
  id: string;
  name: string;
  logoColor: string;
  logoText: string;
  bookCount: number;
}

export interface Category {
  id: string;
  name: string;
  icon?: string;
}

export interface CartItem {
  book: Book;
  quantity: number;
}

export interface OrderItem {
  book: Book;
  quantity: number;
  priceAtPurchase: number;
}

export interface Order {
  id: string;
  date: string;
  status: 'Delivered' | 'Shipped' | 'Processing' | 'Cancelled';
  items: OrderItem[];
  total: number;
  deliveredOn?: string;
}

export interface Address {
  firstName: string;
  lastName: string;
  addressLine1: string;
  addressLine2: string;
  city: string;
  state: string;
  country: string;
  pin: string;
  email: string;
  phone: string;
}

export interface Review {
  id: string;
  author: string;
  rating: number;
  text: string;
  date: string;
}

export type PaymentMethod = 'credit-card' | 'debit-card' | 'upi' | 'wallet';

export type UserRole = 'guest' | 'member';

export interface User {
  id: string;
  email: string;
  firstName: string;
  lastName: string;
  role: UserRole;
  avatarInitials: string;
  createdAt: string;
  giftPoints: number;
}

export interface AuthCredentials {
  email: string;
  password: string;
}

export interface RegisterPayload extends AuthCredentials {
  firstName: string;
  lastName: string;
}

export interface AuthToken {
  accessToken: string;
  expiresIn: number;
}

export interface AuthState {
  user: User | null;
  token: AuthToken | null;
  isAuthenticated: boolean;
  isGuest: boolean;
}

export type SortOption = 'Relevance' | 'Price: Low to High' | 'Price: High to Low' | 'Newest';
export type FormatOption = 'All' | 'Paperback' | 'Hard Cover' | 'eBook';
export type LanguageOption = 'All' | 'English' | 'Hindi' | 'Tamil' | 'Telugu';

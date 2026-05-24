export type Brand = 'Wilson' | 'Babolat' | 'Head' | 'Yonex' | 'Nike' | 'Adidas' | 'Dunlop';
export type Level = 'Beginner' | 'Intermediate' | 'Advanced';
export type Category = string;

export interface Product {
  id: string;
  slug: string;
  name: string;
  brand: Brand;
  price: number;
  salePrice?: number;
  rating: number;
  reviewsCount: number;
  images: string[];
  video?: string;
  category: Category;
  level: Level[];
  weight: number; // in grams
  headSize: number; // in sq in
  balance: number; // in mm
  length: number; // in inches
  material: string;
  gripSizes: string[];
  stock: number;
  isNew: boolean;
  isBestSeller: boolean;
  discountPercent?: number;
  description: string;
  specifications: Record<string, string>;
}

export interface CartItem {
  product: Product;
  quantity: number;
  gripSize: string;
}

export interface Order {
  id: string;
  date: string;
  total: number;
  status: 'Processing' | 'Shipped' | 'Delivered';
  items: CartItem[];
}

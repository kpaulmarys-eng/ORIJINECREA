export type GarmentViewType = 'face' | 'dos' | 'detail';

export interface GarmentView {
  type: GarmentViewType;
  label: string;
  image: string;
  description: string;
}

export interface GarmentProduct {
  id: string;
  name: string;
  collection: string;
  gender: 'homme' | 'femme' | 'unisexe';
  price: number;
  currency: string;
  category: string;
  tagline: string;
  composition: string;
  weight: string;
  views: GarmentView[];
  arAvailable: boolean;
  videoDuration: string;
  sizes: string[];
  colors?: string[];
  themeColor?: string;
}

export interface ExperienceCardItem {
  id: 'visualisation' | 'collection' | 'video';
  title: string;
  subtitle: string;
  badge: string;
  image: string;
  actionText: string;
}

export interface CartItem {
  product: GarmentProduct;
  size: string;
  quantity: number;
}

export interface ActiveOrder {
  orderNumber: string;
  items: CartItem[];
  total: number;
  date: string;
  estimatedDelivery: string;
  createdAt?: number;
}

export interface PastOrder {
  id: string;
  orderNumber: string;
  items: CartItem[];
  total: number;
  date: string;
  deliveredAt: string;
  status: 'delivered';
}

export interface UserProfile {
  id: string;
  name: string;
  email: string;
  avatar?: string;
  joinedDate?: string;
}

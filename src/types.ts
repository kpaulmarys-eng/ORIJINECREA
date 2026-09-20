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

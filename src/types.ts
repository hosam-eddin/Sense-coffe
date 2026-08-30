export type Language = 'ar' | 'en';

export type CategoryId =
  | 'all'
  | 'drip'
  | 'coffee'
  | 'ice-coffee'
  | 'matcha'
  | 'frappe'
  | 'mojito'
  | 'smoothies'
  | 'bakery';

export interface MenuItem {
  id: string;
  categoryId: CategoryId;
  nameEn: string;
  nameAr: string;
  descriptionEn?: string;
  descriptionAr?: string;
  price: number;
  priceSecondary?: number; // For sizes or variations if any
  image?: string;
  isSignature?: boolean;
  isPopular?: boolean;
  isNew?: boolean;
  temp?: 'hot' | 'ice' | 'both';
  tagsEn?: string[];
  tagsAr?: string[];
  addonNoteEn?: string;
  addonNoteAr?: string;
  notesEn?: string;
  notesAr?: string;
  calories?: string;
}

export interface Category {
  id: CategoryId;
  nameEn: string;
  nameAr: string;
  iconName: string;
  descriptionEn?: string;
  descriptionAr?: string;
}

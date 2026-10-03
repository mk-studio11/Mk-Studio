export type Language = 'gu' | 'en';

export type ServiceCategory = 'poster' | 'video' | 'branding' | 'thumbnail';

export type SubCategory =
  | 'festival'
  | 'business'
  | 'political'
  | 'reels'
  | 'wedding'
  | 'youtube'
  | 'logo';

export interface PortfolioItem {
  id: string;
  title: string;
  titleGu: string;
  category: ServiceCategory;
  subcategory: SubCategory;
  image: string;
  videoUrl?: string;
  price: number;
  deliveryTime: string;
  deliveryTimeGu: string;
  software: string[];
  dimensions?: string;
  duration?: string;
  featured: boolean;
  description: string;
  descriptionGu: string;
}

export interface PricingPlan {
  id: string;
  name: string;
  nameGu: string;
  tagline: string;
  taglineGu: string;
  price: number;
  discountPrice?: number;
  period?: string;
  periodGu?: string;
  category: 'poster' | 'video' | 'combo';
  popular?: boolean;
  features: string[];
  featuresGu: string[];
  idealFor: string;
  idealForGu: string;
}

export type OrderStatus = 'pending' | 'in_progress' | 'completed' | 'cancelled';

export interface Order {
  id: string;
  clientName: string;
  phone: string;
  city: string;
  serviceCategory: ServiceCategory | 'combo' | 'custom';
  serviceCategoryLabel?: string;
  selectedPlanId?: string;
  itemReferenceId?: string;
  itemReferenceTitle?: string;
  requirementsText: string;
  urgency: 'normal' | 'express';
  estimatedPrice: number;
  status: OrderStatus;
  createdAt: string;
  customNotes?: string;
}

export interface CreatorProfile {
  studioName: string;
  studioNameGu: string;
  creatorName: string;
  creatorNameGu: string;
  tagline: string;
  taglineGu: string;
  bio: string;
  bioGu: string;
  whatsapp: string;
  phone: string;
  email: string;
  instagram: string;
  youtube: string;
  city: string;
  upiId: string;
  adminPassword?: string;
  adminPin?: string;
  logoImage?: string;
  heroImage?: string;
  heroHeadlineGu?: string;
  heroHeadlineEn?: string;
  heroSubheadGu?: string;
  heroSubheadEn?: string;
  stats: {
    postersCompleted: number;
    videosEdited: number;
    satisfiedClients: number;
    experienceYears: number;
    rating: number;
  };
}

export interface FAQItem {
  id: string;
  qGu: string;
  qEn: string;
  aGu: string;
  aEn: string;
}

export interface ClientReview {
  id: string;
  clientName: string;
  location: string;
  businessType: string;
  businessTypeGu: string;
  rating: number;
  comment: string;
  commentGu: string;
  projectType: string;
  projectTypeGu: string;
  date: string;
}

export type ThemeColorOption = 'amber' | 'blue' | 'emerald' | 'purple' | 'red' | 'cyan';

export interface SiteUIConfig {
  themeColor: ThemeColorOption;
  announcement: {
    enabled: boolean;
    textGu: string;
    textEn: string;
  };
  sectionsVisibility: {
    hero: boolean;
    portfolio: boolean;
    videoReels: boolean;
    pricing: boolean;
    testimonials: boolean;
    faq: boolean;
    floatingCta: boolean;
  };
  heroContent: {
    badgeGu: string;
    badgeEn: string;
    headlineGu: string;
    headlineEn: string;
    subheadGu: string;
    subheadEn: string;
    primaryCtaGu: string;
    primaryCtaEn: string;
    secondaryCtaGu: string;
    secondaryCtaEn: string;
    guaranteeNoteGu: string;
    guaranteeNoteEn: string;
  };
  portfolioContent: {
    badgeGu: string;
    badgeEn: string;
    headlineGu: string;
    headlineEn: string;
    subheadGu: string;
    subheadEn: string;
  };
  videoContent: {
    badgeGu: string;
    badgeEn: string;
    headlineGu: string;
    headlineEn: string;
    subheadGu: string;
    subheadEn: string;
  };
  pricingContent: {
    badgeGu: string;
    badgeEn: string;
    headlineGu: string;
    headlineEn: string;
    subheadGu: string;
    subheadEn: string;
  };
  footerContent: {
    aboutGu: string;
    aboutEn: string;
    customNoticeGu?: string;
  };
}


// ==================== CORE BRANCH TYPES ====================

export interface Attraction {
  id: number;
  externalId?: string;
  label: string;
  image?: string;
  description?: string;
  order?: number;
}

export interface Accommodation {
  id?: number;
  title: string;
  description?: string;
  image?: string;
}

export interface ExperiencePackage {
  id: number;
  externalId?: string;
  title: string;
  subtitle?: string;
  description?: string;
  image?: string;
  price?: number;
  duration?: string;
  inclusions?: any;
  category: string;
  available: boolean;
  ctaLabel?: string;
}

export interface Experience {
  id: number;
  externalId?: string;
  title: string;
  description?: string;
  highlightImage?: string;
  packages: ExperiencePackage[];
}

export interface Location {
  id: number;
  city?: string;
  region?: string;
  country?: string;
}

export interface Contact {
  id: number;
  phone?: string;
  email?: string;
  address?: string;
  socials?: any;
}

export interface Seo {
  id: number;
  title?: string;
  description?: string;
  keywords?: any;
}

export interface BranchType {
  id: number;
  slug: string;
  branchName: string;
  description?: string;
  heroImage?: string;
  directionsUrl?: string;
  starRating?: number;
  published: boolean;
  createdAt: string;
  updatedAt: string;
  heroVideoUrl?: string;
  heroTagline?: string;
  location?: Location;
  contact?: Contact;
  seo?: Seo;
  attractions: Attraction[];
  accommodations: Accommodation[];
  experiences: Experience[];
}

// ==================== ADMIN BRANCH TYPES ====================

export interface CreateBranchData {
  slug: string;
  branchName: string;
  description: string;
  heroImage?: string;
  directionsUrl?: string;
  starRating?: number;
  published?: boolean;
  heroVideoUrl?: string;
  heroTagline?: string;
  location?: {
    city: string;
    region?: string;
    country?: string;
  };
  seo?: {
    title?: string;
    description?: string;
    keywords?: string[];
  };
}

export interface UpdateBranchData {
  branchName?: string;
  description?: string;
  heroImage?: string;
  directionsUrl?: string;
  starRating?: number;
  published?: boolean;
  heroVideoUrl?: string;
  heroTagline?: string;
}

export interface BranchFormData {
  slug: string;
  branchName: string;
  description: string;
  starRating: number;
  published: boolean;
  heroVideoUrl?: string;
  heroTagline?: string;
  heroImage: string;
  directionsUrl: string;
  location: {
    city: string;
    region: string;
    country: string;
  };
  contact: {
    phone: string;
    email: string;
    address: string;
  };
  attractions: Attraction[];
  accommodations: Accommodation[];
  seo: {
    title: string;
    description: string;
    keywords: string[];
  };
}

// ==================== API RESPONSE TYPES ====================

export interface ApiResponse<T> {
  success: boolean;
  data?: T;
  error?: string;
}

export interface BranchesResponse {
  branches: BranchType[];
}

export interface BranchResponse {
  branch: BranchType;
}

// ==================== COMPONENT PROP TYPES ====================

export interface BranchTemplateProps {
  branch: {
    branchName: string;
    heroImage: string;
    description?: string;
    shortDescription?: string;
    directionsUrl?: string;
    heroVideoUrl?: string;
    heroTagline?: string;
    location?: { mapsUrl?: string };
    contact?: {
      phone?: string;
      email?: string;
    };
    attractions?: Attraction[];
    accommodations: Accommodation[];
    experiences?: {
      id: number;
      highlightImage: string;
      packages: any[];
      title: string;
      description?: string;
    }[];
  };
}

export interface BranchHeroProps {
  branch: {
    heroImage: string;
    branchName: string;
    description: string;
    directionsUrl?: string;
    contact?: {
      phone?: string;
      email?: string;
    };
    attractions: { image: string; label: string }[];
  };
  onOpenBooking: () => void;
}

export interface ExperienceProps {
  image: string;
  packages: any[];
  serviceDescription: string[];
}

export interface HeroSectionProps {
  branch: {
    branchName: string;
    heroVideoUrl?: string;
    heroTagline?: string;
    contact?: {
      phone?: string;
      email?: string;
    };
    directionsUrl?: string;
  };
}

export interface AttractionsSectionProps {
  attractions: Attraction[];
  description?: string;
  branchName: string;
}

// ==================== FORM TYPES ====================

export interface AddBranchFormProps {
  onCancel: () => void;
  onSuccess: () => void;
}

export interface EditBranchFormProps {
  branch: BranchType;
  onCancel: () => void;
  onSuccess: () => void;
}

// ==================== UTILITY TYPES ====================

export type TabType = "basic" | "contact" | "content" | "seo";

export interface ImageUploadResult {
  success: boolean;
  url?: string;
  error?: string;
  filename?: string;
  fileId?: string;
}

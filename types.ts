
export interface CastMember {
  id: string;
  name: string;
  character: string;
  imageUrl: string;
}

export interface BlogPost {
  id: string;
  title: string;
  excerpt: string;
  content: string;
  image: string;
  date: string;
  author: string;
  tags?: string[];
}

export interface Movie {
  id: string;
  tmdbId?: string; // ID from The Movie Database
  title: string;
  year: string;
  genre: string[];
  duration: string;
  imageUrl: string;
  backdropUrl: string;
  description?: string;
  isFeatured?: boolean;
  rating?: string;
  progress?: number; // Percentage 0-100 for continue watching
  price?: string; // For pre-orders
  videoUrl?: string; // Specific video URL if available (custom upload)
  
  // Extended Metadata
  voteCount?: number;
  originalLanguage?: string;
  cast?: CastMember[];
  director?: string;
}

export interface Episode {
  id: string;
  number: string;
  title: string;
  imageUrl: string;
  airDate?: string;
  overview?: string;
}

export interface User {
  name: string;
  avatar: string;
  email: string;
  plan?: string;
}

export interface NavItem {
  label: string;
  href: string;
  hasDropdown?: boolean;
}

export interface NewsItem {
  id: string;
  title: string;
  date: string;
  imageUrl: string;
  description: string;
  type: 'Event' | 'Premiere' | 'Update';
}

export interface SubscriptionPlan {
  id: string;
  name: string;
  price: string;
  period: string;
  features: string[];
  isPopular?: boolean;
  color: string;
}

export interface VideoSource {
  type: 'public_domain' | 'official_full' | 'trailer_only';
  videoUrl: string;
  embedCode?: string; // iframe src or full embed code
  source: 'archive.org' | 'youtube' | 'tmdb' | 'custom';
  warningMessage?: string;
}

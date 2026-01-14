export interface Post {
  id: number;
  title: string;
  excerpt: string;
  content: string;
  permalink: string;
  date: string;
  author: string;
  featured_image?: string;
  categories: string[];
  tags: string[];
}

export interface SearchResponse {
  posts: Post[];
  total: number;
  totalPages: number;
  currentPage: number;
}

export interface Category {
  id: number;
  name: string;
  slug: string;
  count: number;
}

export interface Tag {
  id: number;
  name: string;
  slug: string;
  count: number;
}

export interface SearchParams {
  keyword?: string;
  category?: number;
  tags?: number[];
  page?: number;
  per_page?: number;
}

export interface BlockAttributes {
  // Add any block-specific attributes here if needed
}


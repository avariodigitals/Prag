export interface Store {
  id: number;
  name: string;
  city: string;
  address: string;
  phone: string;
  map_url: string;
  type: 'prag' | 'online' | 'chain';
  logo?: { src: string; alt: string };
}

export interface Tag {  id: number;
  name: string;
  slug: string;
  count: number;
}

export interface ProductImage {
  id: number;
  src: string;
  alt: string;
}

export interface ProductCategory {
  id: number;
  name: string;
  slug: string;
}

export interface Product {
  id: number;
  name: string;
  slug: string;
  price: string;
  regular_price: string;
  sale_price: string;
  on_sale: boolean;
  status: string;
  stock_status: 'instock' | 'outofstock' | 'onbackorder';
  short_description: string;
  images: ProductImage[];
  categories: ProductCategory[];
  tags: { id: number; name: string; slug: string }[];
  featured: boolean;
  date_created: string;
  description?: string;
  attributes?: { id: number; name: string; options: string[] }[];
  dimensions?: { length: string; width: string; height: string };
  weight?: string;
}

export interface Category {
  id: number;
  name: string;
  slug: string;
  count: number;
  image: { src: string; alt: string } | null;
  description: string;
}

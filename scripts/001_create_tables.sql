-- 0. Kích hoạt tiện ích mở rộng cho tìm kiếm gần đúng (Search gợi ý trên sidebar)
CREATE EXTENSION IF NOT EXISTS pg_trgm;

-- 1. Bảng Categories (Tối ưu cho Sidebar Filter)
CREATE TABLE public.categories (
    id uuid NOT NULL DEFAULT gen_random_uuid (),
    parent_id uuid NULL, -- Để làm danh mục đa cấp
    name text NOT NULL,
    slug text NOT NULL,
    description text NULL,
    image_url text NULL,
    sort_order integer DEFAULT 0, -- Để sắp xếp danh mục trên menu
    is_active boolean DEFAULT true, -- Để ẩn/hiện danh mục
    created_at TIMESTAMPTZ DEFAULT NOW(),
    updated_at TIMESTAMPTZ DEFAULT NOW(),
    
    CONSTRAINT categories_pkey PRIMARY KEY (id),
    CONSTRAINT categories_name_key UNIQUE (name),
    CONSTRAINT categories_slug_key UNIQUE (slug),
    CONSTRAINT categories_parent_fkey FOREIGN KEY (parent_id) REFERENCES public.categories (id) ON DELETE CASCADE
) TABLESPACE pg_default;

-- Index cho tìm kiếm nhanh và phân cấp
CREATE INDEX idx_categories_parent ON public.categories(parent_id);
CREATE INDEX idx_categories_name_trgm ON public.categories USING gin (name gin_trgm_ops);

-- 2. Bảng Products (Tối ưu cho Filter & Search)
CREATE TABLE public.products (
    id uuid NOT NULL DEFAULT gen_random_uuid (),
    name text NOT NULL,
    slug text NOT NULL,
    description text NULL,
    price numeric(12, 2) NOT NULL, -- Tăng độ chính xác tiền tệ
    original_price numeric(12, 2) NULL,
    category_id uuid NULL,
    brand text NULL,
    image_url text NULL,
    images text[] NULL,
    stock integer DEFAULT 0,
    is_featured boolean DEFAULT false,
    is_deal boolean DEFAULT false,
    specs jsonb NULL, -- Rất tốt để filter thuộc tính động (RAM, Màu sắc...)
    rating numeric(2, 1) DEFAULT 0,
    review_count integer DEFAULT 0,
    -- Cột vector để tìm kiếm toàn văn (Search Bar)
    search_vector tsvector GENERATED ALWAYS AS (
        to_tsvector('english', name || ' ' || coalesce(description, '') || ' ' || coalesce(brand, ''))
    ) STORED,
    created_at TIMESTAMPTZ DEFAULT NOW(),
    updated_at TIMESTAMPTZ DEFAULT NOW(),

    CONSTRAINT products_pkey PRIMARY KEY (id),
    CONSTRAINT products_slug_key UNIQUE (slug),
    CONSTRAINT products_category_id_fkey FOREIGN KEY (category_id) REFERENCES public.categories (id) ON DELETE SET NULL
) TABLESPACE pg_default;

-- Index quan trọng cho Product
CREATE INDEX idx_products_category ON public.products(category_id);
CREATE INDEX idx_products_price ON public.products(price); -- Filter theo giá
CREATE INDEX idx_products_brand ON public.products(brand); -- Filter theo thương hiệu
CREATE INDEX idx_products_search ON public.products USING gin(search_vector); -- Search nhanh
CREATE INDEX idx_products_specs ON public.products USING gin(specs); -- Filter theo cấu hình jsonb

-- 3. Bảng User Profiles
CREATE TABLE public.user_profiles (
    id uuid NOT NULL,
    full_name text NULL,
    phone text NULL,
    avatar_url text NULL,
    address text NULL,
    city text NULL,
    postal_code text NULL,
    country text DEFAULT 'Vietnam'::text,
    created_at TIMESTAMPTZ DEFAULT NOW(),
    updated_at TIMESTAMPTZ DEFAULT NOW(),
    
    CONSTRAINT user_profiles_pkey PRIMARY KEY (id),
    CONSTRAINT user_profiles_id_fkey FOREIGN KEY (id) REFERENCES auth.users (id) ON DELETE CASCADE
) TABLESPACE pg_default;

-- 4. Bảng Orders (Lưu trữ lịch sử mua hàng)
create table public.orders (
  id uuid not null default gen_random_uuid (),
  user_id uuid null,
  order_number text not null,
  status text null default 'pending'::text,
  subtotal numeric(12, 2) not null,
  shipping_fee numeric(12, 2) null default 0,
  tax numeric(12, 2) null default 0,
  total numeric(12, 2) not null,
  shipping_name text not null,
  shipping_email text not null,
  shipping_phone text not null,
  shipping_address text not null,
  shipping_city text not null,
  shipping_postal_code text null,
  payment_method text null,
  payment_status text null default 'unpaid'::text,
  notes text null,
  created_at timestamp with time zone null default now(),
  updated_at timestamp with time zone null default now(),
  payos_order_code numeric null,
  constraint orders_pkey primary key (id),
  constraint orders_order_number_key unique (order_number),
  constraint orders_user_id_fkey foreign KEY (user_id) references auth.users (id) on delete set null
) TABLESPACE pg_default;

create index IF not exists idx_orders_user on public.orders using btree (user_id) TABLESPACE pg_default;

create index IF not exists idx_orders_status on public.orders using btree (status) TABLESPACE pg_default;

-- 5. Bảng Order Items
CREATE TABLE public.order_items (
    id uuid NOT NULL DEFAULT gen_random_uuid (),
    order_id uuid NULL,
    product_id uuid NULL,
    product_name text NOT NULL,
    product_image text NULL,
    quantity integer NOT NULL,
    price numeric(12, 2) NOT NULL,
    created_at TIMESTAMPTZ DEFAULT NOW(),
    
    CONSTRAINT order_items_pkey PRIMARY KEY (id),
    CONSTRAINT order_items_order_id_fkey FOREIGN KEY (order_id) REFERENCES public.orders (id) ON DELETE CASCADE,
    CONSTRAINT order_items_product_id_fkey FOREIGN KEY (product_id) REFERENCES public.products (id) ON DELETE SET NULL
) TABLESPACE pg_default;

CREATE INDEX idx_order_items_order ON public.order_items(order_id);

-- 6. Bảng Wishlist
CREATE TABLE public.wishlist (
    id uuid NOT NULL DEFAULT gen_random_uuid (),
    user_id uuid NULL,
    product_id uuid NULL,
    created_at TIMESTAMPTZ DEFAULT NOW(),
    
    CONSTRAINT wishlist_pkey PRIMARY KEY (id),
    CONSTRAINT wishlist_user_id_product_id_key UNIQUE (user_id, product_id),
    CONSTRAINT wishlist_product_id_fkey FOREIGN KEY (product_id) REFERENCES public.products (id) ON DELETE CASCADE,
    CONSTRAINT wishlist_user_id_fkey FOREIGN KEY (user_id) REFERENCES auth.users (id) ON DELETE CASCADE
) TABLESPACE pg_default;

-- 7. Bảng Reviews
CREATE TABLE public.reviews (
    id uuid NOT NULL DEFAULT gen_random_uuid (),
    product_id uuid NULL,
    user_id uuid NULL,
    rating integer NOT NULL,
    title text NULL,
    comment text NULL,
    created_at TIMESTAMPTZ DEFAULT NOW(),
    updated_at TIMESTAMPTZ DEFAULT NOW(),
    
    CONSTRAINT reviews_pkey PRIMARY KEY (id),
    CONSTRAINT reviews_product_id_user_id_key UNIQUE (product_id, user_id),
    CONSTRAINT reviews_product_id_fkey FOREIGN KEY (product_id) REFERENCES public.products (id) ON DELETE CASCADE,
    CONSTRAINT reviews_user_id_fkey FOREIGN KEY (user_id) REFERENCES auth.users (id) ON DELETE CASCADE,
    CONSTRAINT reviews_rating_check CHECK (rating >= 1 AND rating <= 5)
) TABLESPACE pg_default;

CREATE INDEX idx_reviews_product ON public.reviews(product_id);

-- 8. Bảng Settings (Lưu trữ cấu hình động cho cửa hàng)
CREATE TABLE IF NOT EXISTS settings (
  id text PRIMARY KEY DEFAULT 'global',
  store_name text DEFAULT 'TechNova Store',
  store_description text DEFAULT 'Laptop, Smartphone và Phụ kiện chính hãng với giá tốt nhất. Giao hàng miễn phí toàn quốc - Bảo hành chu đáo.',
  email text DEFAULT 'support@technova.vn',
  phone text DEFAULT '0123456789',
  address text DEFAULT '123 Nguyễn Huệ, Quận 1, TP. Hồ Chí Minh',
  currency text DEFAULT 'VND',
  timezone text DEFAULT 'Asia/Ho_Chi_Minh',
  maintenance_mode boolean DEFAULT false,
  auto_approve_orders boolean DEFAULT false,
  default_tax_rate numeric DEFAULT 10,
  logo_url text DEFAULT '',
  favicon_url text DEFAULT '',
  created_at timestamptz DEFAULT now(),
  updated_at timestamptz DEFAULT now()
);

-- Enable RLS
-- Fixed: Disable RLS for global settings table (single row, no security risk)
ALTER TABLE settings DISABLE ROW LEVEL SECURITY;

-- 9. Bảng Cart Items
CREATE TABLE IF NOT EXISTS public.cart_items (
  id uuid NOT NULL DEFAULT gen_random_uuid(),
  user_id uuid NOT NULL,
  product_id uuid NOT NULL,
  quantity integer NOT NULL DEFAULT 1,
  created_at timestamptz DEFAULT now(),
  updated_at timestamptz DEFAULT now(),

  CONSTRAINT cart_items_pkey PRIMARY KEY (id),
  CONSTRAINT cart_items_user_id_product_id_key UNIQUE (user_id, product_id),

  CONSTRAINT cart_items_user_id_fkey
    FOREIGN KEY (user_id) REFERENCES auth.users (id) ON DELETE CASCADE,

  CONSTRAINT cart_items_product_id_fkey
    FOREIGN KEY (product_id) REFERENCES public.products (id) ON DELETE CASCADE,

  CONSTRAINT cart_items_quantity_check CHECK (quantity >= 1)
);

CREATE INDEX IF NOT EXISTS idx_cart_items_user_id ON public.cart_items (user_id);
CREATE INDEX IF NOT EXISTS idx_cart_items_product_id ON public.cart_items (product_id);


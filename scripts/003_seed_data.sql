-- Insert Categories
INSERT INTO categories (name, slug, description, image_url) VALUES
  ('Laptop', 'laptop', 'High-performance laptops for work and gaming', '/placeholder.svg?height=400&width=600'),
  ('Smartphone', 'smartphone', 'Latest smartphones with cutting-edge technology', '/placeholder.svg?height=400&width=600'),
  ('Accessories', 'accessories', 'Tech accessories to enhance your experience', '/placeholder.svg?height=400&width=600')
ON CONFLICT (slug) DO NOTHING;

-- Insert Laptops
INSERT INTO products (name, slug, description, price, original_price, category_id, brand, image_url, images, stock, is_featured, is_deal, specs, rating, review_count) 
SELECT 
  'MacBook Pro 16" M3 Max',
  'macbook-pro-16-m3-max',
  'The most powerful MacBook Pro ever with M3 Max chip, 16-inch Liquid Retina XDR display, and all-day battery life.',
  89990000,
  99990000,
  (SELECT id FROM categories WHERE slug = 'laptop'),
  'Apple',
  '/placeholder.svg?height=600&width=800',
  ARRAY[
    '/placeholder.svg?height=600&width=800',
    '/placeholder.svg?height=600&width=800',
    '/placeholder.svg?height=600&width=800'
  ],
  15,
  true,
  true,
  '{"cpu": "Apple M3 Max 16-core", "ram": "48GB Unified Memory", "storage": "1TB SSD", "display": "16.2-inch Liquid Retina XDR", "graphics": "40-core GPU", "battery": "22 hours", "weight": "2.16 kg"}'::jsonb,
  4.9,
  127
WHERE NOT EXISTS (SELECT 1 FROM products WHERE slug = 'macbook-pro-16-m3-max');

INSERT INTO products (name, slug, description, price, original_price, category_id, brand, image_url, images, stock, is_featured, is_deal, specs, rating, review_count) 
SELECT 
  'Dell XPS 15 9530',
  'dell-xps-15-9530',
  'Stunning OLED display, Intel Core i9 processor, and premium design for creative professionals.',
  65990000,
  69990000,
  (SELECT id FROM categories WHERE slug = 'laptop'),
  'Dell',
  '/placeholder.svg?height=600&width=800',
  ARRAY[
    '/placeholder.svg?height=600&width=800',
    '/placeholder.svg?height=600&width=800'
  ],
  20,
  true,
  false,
  '{"cpu": "Intel Core i9-13900H", "ram": "32GB DDR5", "storage": "1TB NVMe SSD", "display": "15.6-inch 3.5K OLED", "graphics": "NVIDIA RTX 4070 8GB", "battery": "86Wh", "weight": "1.86 kg"}'::jsonb,
  4.7,
  89
WHERE NOT EXISTS (SELECT 1 FROM products WHERE slug = 'dell-xps-15-9530');

INSERT INTO products (name, slug, description, price, original_price, category_id, brand, image_url, images, stock, is_featured, is_deal, specs, rating, review_count) 
SELECT 
  'ASUS ROG Zephyrus G14',
  'asus-rog-zephyrus-g14',
  'Compact gaming powerhouse with AMD Ryzen 9 and RTX 4060. Perfect balance of portability and performance.',
  49990000,
  null,
  (SELECT id FROM categories WHERE slug = 'laptop'),
  'ASUS',
  '/placeholder.svg?height=600&width=800',
  ARRAY[
    '/placeholder.svg?height=600&width=800',
    '/placeholder.svg?height=600&width=800'
  ],
  12,
  false,
  false,
  '{"cpu": "AMD Ryzen 9 7940HS", "ram": "16GB DDR5", "storage": "1TB NVMe SSD", "display": "14-inch QHD+ 165Hz", "graphics": "NVIDIA RTX 4060 8GB", "battery": "76Wh", "weight": "1.65 kg"}'::jsonb,
  4.6,
  64
WHERE NOT EXISTS (SELECT 1 FROM products WHERE slug = 'asus-rog-zephyrus-g14');

-- Insert Smartphones
INSERT INTO products (name, slug, description, price, original_price, category_id, brand, image_url, images, stock, is_featured, is_deal, specs, rating, review_count) 
SELECT 
  'iPhone 15 Pro Max',
  'iphone-15-pro-max',
  'Titanium design, A17 Pro chip, best iPhone camera system ever, and USB-C.',
  33990000,
  null,
  (SELECT id FROM categories WHERE slug = 'smartphone'),
  'Apple',
  '/placeholder.svg?height=600&width=800',
  ARRAY[
    '/placeholder.svg?height=600&width=800',
    '/placeholder.svg?height=600&width=800',
    '/placeholder.svg?height=600&width=800'
  ],
  30,
  true,
  false,
  '{"chip": "A17 Pro", "ram": "8GB", "storage": "256GB", "display": "6.7-inch Super Retina XDR", "camera": "48MP Main, 12MP Ultra Wide, 12MP Telephoto", "battery": "4422mAh", "weight": "221g"}'::jsonb,
  4.8,
  342
WHERE NOT EXISTS (SELECT 1 FROM products WHERE slug = 'iphone-15-pro-max');

INSERT INTO products (name, slug, description, price, original_price, category_id, brand, image_url, images, stock, is_featured, is_deal, specs, rating, review_count) 
SELECT 
  'Samsung Galaxy S24 Ultra',
  'samsung-galaxy-s24-ultra',
  'AI-powered smartphone with 200MP camera, S Pen, and Snapdragon 8 Gen 3.',
  30990000,
  32990000,
  (SELECT id FROM categories WHERE slug = 'smartphone'),
  'Samsung',
  '/placeholder.svg?height=600&width=800',
  ARRAY[
    '/placeholder.svg?height=600&width=800',
    '/placeholder.svg?height=600&width=800'
  ],
  25,
  true,
  true,
  '{"chip": "Snapdragon 8 Gen 3", "ram": "12GB", "storage": "512GB", "display": "6.8-inch Dynamic AMOLED 2X", "camera": "200MP Wide, 50MP Periscope, 12MP Ultra Wide", "battery": "5000mAh", "weight": "232g"}'::jsonb,
  4.7,
  218
WHERE NOT EXISTS (SELECT 1 FROM products WHERE slug = 'samsung-galaxy-s24-ultra');

INSERT INTO products (name, slug, description, price, original_price, category_id, brand, image_url, images, stock, is_featured, is_deal, specs, rating, review_count) 
SELECT 
  'Google Pixel 8 Pro',
  'google-pixel-8-pro',
  'Google AI at your fingertips. Best Android camera with Magic Editor and Night Sight.',
  24990000,
  null,
  (SELECT id FROM categories WHERE slug = 'smartphone'),
  'Google',
  '/placeholder.svg?height=600&width=800',
  ARRAY[
    '/placeholder.svg?height=600&width=800',
    '/placeholder.svg?height=600&width=800'
  ],
  18,
  false,
  false,
  '{"chip": "Google Tensor G3", "ram": "12GB", "storage": "256GB", "display": "6.7-inch LTPO OLED", "camera": "50MP Wide, 48MP Telephoto, 48MP Ultra Wide", "battery": "5050mAh", "weight": "213g"}'::jsonb,
  4.6,
  156
WHERE NOT EXISTS (SELECT 1 FROM products WHERE slug = 'google-pixel-8-pro');

-- Insert Accessories
INSERT INTO products (name, slug, description, price, original_price, category_id, brand, image_url, images, stock, is_featured, is_deal, specs, rating, review_count) 
SELECT 
  'AirPods Pro (2nd Gen)',
  'airpods-pro-2nd-gen',
  'Active Noise Cancellation, Adaptive Audio, and Personalized Spatial Audio.',
  6490000,
  null,
  (SELECT id FROM categories WHERE slug = 'accessories'),
  'Apple',
  '/placeholder.svg?height=600&width=800',
  ARRAY[
    '/placeholder.svg?height=600&width=800',
    '/placeholder.svg?height=600&width=800'
  ],
  50,
  true,
  false,
  '{"type": "In-ear", "connectivity": "Bluetooth 5.3", "battery": "6 hours (ANC on), 30 hours with case", "features": "Active Noise Cancellation, Adaptive Audio, Transparency mode", "water_resistance": "IPX4", "weight": "5.3g per earbud"}'::jsonb,
  4.8,
  521
WHERE NOT EXISTS (SELECT 1 FROM products WHERE slug = 'airpods-pro-2nd-gen');

INSERT INTO products (name, slug, description, price, original_price, category_id, brand, image_url, images, stock, is_featured, is_deal, specs, rating, review_count) 
SELECT 
  'Logitech MX Master 3S',
  'logitech-mx-master-3s',
  'Ultra-quiet clicks, 8K DPI sensor, and ergonomic design for professionals.',
  2590000,
  2990000,
  (SELECT id FROM categories WHERE slug = 'accessories'),
  'Logitech',
  '/placeholder.svg?height=600&width=800',
  ARRAY[
    '/placeholder.svg?height=600&width=800',
    '/placeholder.svg?height=600&width=800'
  ],
  40,
  false,
  true,
  '{"type": "Wireless Mouse", "connectivity": "Bluetooth, USB-C", "dpi": "8000 DPI", "battery": "70 days on full charge", "buttons": "7 programmable buttons", "weight": "141g"}'::jsonb,
  4.7,
  283
WHERE NOT EXISTS (SELECT 1 FROM products WHERE slug = 'logitech-mx-master-3s');

-- ============================================================================
-- 1. CẬP NHẬT DANH MỤC (CATEGORIES)
-- ============================================================================
INSERT INTO categories (name, slug, description, image_url) VALUES
    ('Laptop',      'laptop',      'Máy tính xách tay hiệu năng cao cho làm việc và chơi game', '/placeholder.svg?height=400&width=600'),
    ('Smartphone',  'smartphone',  'Điện thoại thông minh với công nghệ mới nhất',             '/placeholder.svg?height=400&width=600'),
    ('Accessories', 'accessories', 'Phụ kiện công nghệ cao cấp',                               '/placeholder.svg?height=400&width=600'),
    ('Tablet',      'tablet',      'Máy tính bảng mạnh mẽ cho sáng tạo và giải trí',           '/placeholder.svg?height=400&width=600'),
    ('Monitor',     'monitor',     'Màn hình độ phân giải cao, màu sắc chuẩn xác',             '/placeholder.svg?height=400&width=600'),
    ('Smartwatch',  'smartwatch',  'Đồng hồ thông minh theo dõi sức khỏe và thông báo',        '/placeholder.svg?height=400&width=600')
ON CONFLICT (slug) DO UPDATE SET
    name = EXCLUDED.name,
    description = EXCLUDED.description,
    image_url = EXCLUDED.image_url;


-- ============================================================================
-- 2. CẬP NHẬT DỮ LIỆU SẢN PHẨM (PRODUCTS)
-- ============================================================================

-- ----------------------------------------------------------------------------
-- NHÓM LAPTOP
-- ----------------------------------------------------------------------------

-- MacBook Pro 16" M3 Max
INSERT INTO products (
    name, slug, description, price, original_price, category_id, brand, image_url, images, stock, is_featured, is_deal, specs, rating, review_count
) VALUES (
    'MacBook Pro 16" M3 Max',
    'macbook-pro-16-m3-max',
    'Chiếc MacBook mạnh mẽ nhất từ trước đến nay với chip M3 Max, màn hình Liquid Retina XDR 16 inch và thời lượng pin bền bỉ cả ngày. Hoàn hảo cho dựng phim chuyên nghiệp và đồ họa 3D.',
    89990000, 99990000,
    (SELECT id FROM categories WHERE slug = 'laptop'),
    'Apple', 
    '/placeholder.svg?height=600&width=800',
    ARRAY['/placeholder.svg?height=600&width=800', '/placeholder.svg?height=600&width=800'],
    15, true, true,
    jsonb_build_object(
        'cpu',      'Apple M3 Max 16-core CPU',
        'ram',      '48GB Unified Memory',
        'storage',  '1TB SSD',
        'display',  '16.2-inch Liquid Retina XDR (3456 x 2234), 120Hz ProMotion',
        'graphics', '40-core GPU',
        'battery',  'Lên đến 22 giờ',
        'weight',   '2.16 kg',
        'os',       'macOS Sonoma',
        'ports',    '3x Thunderbolt 4, HDMI, SDXC card slot, MagSafe 3',
        'camera',   '1080p FaceTime HD',
        'audio',    'Hệ thống 6 loa chất lượng cao'
    ),
    4.9, 127
)
ON CONFLICT (slug) DO UPDATE SET
    name = EXCLUDED.name,
    description = EXCLUDED.description,
    price = EXCLUDED.price,
    original_price = EXCLUDED.original_price,
    stock = EXCLUDED.stock,
    is_featured = EXCLUDED.is_featured,
    is_deal = EXCLUDED.is_deal,
    specs = EXCLUDED.specs,
    rating = EXCLUDED.rating;

-- Dell XPS 15 9530
INSERT INTO products (
    name, slug, description, price, original_price, category_id, brand, image_url, images, stock, is_featured, is_deal, specs, rating, review_count
) VALUES (
    'Dell XPS 15 9530',
    'dell-xps-15-9530',
    'Tuyệt phẩm thiết kế với màn hình OLED vô cực, chip Intel Core i9 thế hệ 13. Sự lựa chọn hàng đầu cho doanh nhân và nhà sáng tạo nội dung.',
    65990000, 69990000,
    (SELECT id FROM categories WHERE slug = 'laptop'),
    'Dell', 
    '/placeholder.svg?height=600&width=800',
    ARRAY['/placeholder.svg?height=600&width=800'],
    20, true, false,
    jsonb_build_object(
        'cpu',      'Intel Core i9-13900H (14 cores, up to 5.4GHz)',
        'ram',      '32GB DDR5-4800MHz',
        'storage',  '1TB PCIe NVMe SSD',
        'display',  '15.6-inch 3.5K OLED (3456 x 2160), Touch, 400 nits',
        'graphics', 'NVIDIA GeForce RTX 4070 8GB GDDR6',
        'battery',  '86Wh',
        'weight',   '1.86 kg',
        'os',       'Windows 11 Pro',
        'ports',    '2x Thunderbolt 4, USB-C 3.2 Gen 2, SD Card Reader'
    ),
    4.7, 89
)
ON CONFLICT (slug) DO UPDATE SET
    name = EXCLUDED.name,
    description = EXCLUDED.description,
    price = EXCLUDED.price,
    specs = EXCLUDED.specs;

-- ----------------------------------------------------------------------------
-- NHÓM SMARTPHONE
-- ----------------------------------------------------------------------------

-- iPhone 15 Pro Max
INSERT INTO products (
    name, slug, description, price, original_price, category_id, brand, image_url, images, stock, is_featured, is_deal, specs, rating, review_count
) VALUES (
    'iPhone 15 Pro Max',
    'iphone-15-pro-max',
    'Thiết kế Titan bền bỉ, chip A17 Pro đột phá, nút Tác Vụ tùy chỉnh và hệ thống camera zoom quang học 5x chuyên nghiệp nhất.',
    33990000, 34990000,
    (SELECT id FROM categories WHERE slug = 'smartphone'),
    'Apple', 
    '/placeholder.svg?height=600&width=800',
    ARRAY['/placeholder.svg?height=600&width=800', '/placeholder.svg?height=600&width=800'],
    30, true, true,
    jsonb_build_object(
        'chip',     'A17 Pro (3nm)',
        'ram',      '8GB',
        'storage',  '256GB',
        'display',  '6.7-inch Super Retina XDR OLED, 120Hz ProMotion',
        'camera',   '48MP Main, 12MP Periscope Telephoto (5x), 12MP Ultra Wide',
        'battery',  '4422mAh, sạc nhanh qua USB-C',
        'weight',   '221g',
        'material', 'Khung viền Titan hạng hàng không'
    ),
    4.8, 342
)
ON CONFLICT (slug) DO UPDATE SET
    price = EXCLUDED.price,
    stock = EXCLUDED.stock,
    specs = EXCLUDED.specs;

-- Samsung Galaxy S24 Ultra
INSERT INTO products (
    name, slug, description, price, original_price, category_id, brand, image_url, images, stock, is_featured, is_deal, specs, rating, review_count
) VALUES (
    'Samsung Galaxy S24 Ultra',
    'samsung-galaxy-s24-ultra',
    'Kỷ nguyên Galaxy AI đã đến. Camera 200MP siêu phân giải, bút S Pen tích hợp và khung viền Titan sang trọng.',
    30990000, 32990000,
    (SELECT id FROM categories WHERE slug = 'smartphone'),
    'Samsung', 
    '/placeholder.svg?height=600&width=800',
    ARRAY['/placeholder.svg?height=600&width=800'],
    25, true, true,
    jsonb_build_object(
        'chip',     'Snapdragon 8 Gen 3 for Galaxy',
        'ram',      '12GB',
        'storage',  '512GB',
        'display',  '6.8-inch Dynamic AMOLED 2X, 120Hz, 2600 nits',
        'camera',   '200MP Wide, 50MP 5x Zoom, 10MP 3x Zoom, 12MP Ultra Wide',
        'battery',  '5000mAh, sạc 45W',
        'features', 'Galaxy AI, S-Pen tích hợp, Kháng nước IP68'
    ),
    4.7, 218
)
ON CONFLICT (slug) DO UPDATE SET
    description = EXCLUDED.description,
    price = EXCLUDED.price,
    specs = EXCLUDED.specs;

-- ----------------------------------------------------------------------------
-- NHÓM TABLET & MONITOR
-- ----------------------------------------------------------------------------

-- iPad Pro 12.9-inch M2
INSERT INTO products (
    name, slug, description, price, original_price, category_id, brand, image_url, images, stock, is_featured, is_deal, specs, rating, review_count
) VALUES (
    'iPad Pro 12.9-inch M2',
    'ipad-pro-12-9-m2',
    'Sức mạnh của chip M2 trong một thiết kế mỏng nhẹ. Màn hình Liquid Retina XDR với độ sáng cực cao cho trải nghiệm xem phim và chỉnh sửa HDR hoàn hảo.',
    34990000, null,
    (SELECT id FROM categories WHERE slug = 'tablet'),
    'Apple', 
    '/placeholder.svg?height=600&width=800',
    ARRAY['/placeholder.svg?height=600&width=800'],
    15, true, false,
    jsonb_build_object(
        'chip',         'Apple M2',
        'ram',          '8GB',
        'storage',      '256GB',
        'display',      '12.9-inch Mini-LED Liquid Retina XDR, 120Hz',
        'camera',       '12MP Wide, 10MP Ultra Wide, LiDAR',
        'audio',        '4 loa âm thanh vòm',
        'connectivity', 'Wi-Fi 6E, hỗ trợ Apple Pencil 2'
    ),
    4.8, 156
)
ON CONFLICT (slug) DO UPDATE SET
    price = EXCLUDED.price,
    specs = EXCLUDED.specs;

-- LG UltraGear 27GN950-B
INSERT INTO products (
    name, slug, description, price, original_price, category_id, brand, image_url, images, stock, is_featured, is_deal, specs, rating, review_count
) VALUES (
    'LG UltraGear 27GN950-B',
    'lg-ultragear-27gn950-b',
    'Màn hình Gaming 4K IPS đầu tiên trên thế giới có tốc độ phản hồi 1ms. Màu sắc rực rỡ chuẩn Nano IPS cho cả game thủ và đồ họa.',
    15990000, 17900000,
    (SELECT id FROM categories WHERE slug = 'monitor'),
    'LG', 
    '/placeholder.svg?height=600&width=800',
    ARRAY['/placeholder.svg?height=600&width=800'],
    8, true, true,
    jsonb_build_object(
        'size',         '27-inch',
        'resolution',   '4K UHD (3840 x 2160)',
        'refresh_rate', '144Hz (Overclock 160Hz)',
        'panel',        'Nano IPS',
        'response_time','1ms (GtG)',
        'color',        '98% DCI-P3',
        'hdr',          'VESA DisplayHDR 600'
    ),
    4.7, 124
)
ON CONFLICT (slug) DO UPDATE SET
    price = EXCLUDED.price,
    specs = EXCLUDED.specs;

-- ----------------------------------------------------------------------------
-- PHỤ KIỆN (ACCESSORIES)
-- ----------------------------------------------------------------------------

-- AirPods Pro (2nd Gen)
INSERT INTO products (
    name, slug, description, price, original_price, category_id, brand, image_url, images, stock, is_featured, is_deal, specs, rating, review_count
) VALUES (
    'AirPods Pro (2nd Gen)',
    'airpods-pro-2nd-gen',
    'Chống ồn chủ động hiệu quả gấp đôi. Âm thanh thích ứng và chế độ Xuyên âm thông minh giúp bạn kết nối với thế giới xung quanh.',
    6490000, 6990000,
    (SELECT id FROM categories WHERE slug = 'accessories'),
    'Apple', 
    '/placeholder.svg?height=600&width=800',
    ARRAY['/placeholder.svg?height=600&width=800'],
    50, true, true,
    jsonb_build_object(
        'chip',         'Apple H2',
        'connectivity', 'Bluetooth 5.3',
        'battery',      '6 giờ (tai nghe), 30 giờ (kèm hộp sạc)',
        'features',     'Chống ồn chủ động (ANC), Spatial Audio, Kháng nước IPX4'
    ),
    4.8, 521
)
ON CONFLICT (slug) DO UPDATE SET
    price = EXCLUDED.price,
    stock = EXCLUDED.stock,
    specs = EXCLUDED.specs;

-- Logitech MX Master 3S
INSERT INTO products (
    name, slug, description, price, original_price, category_id, brand, image_url, images, stock, is_featured, is_deal, specs, rating, review_count
) VALUES (
    'Logitech MX Master 3S',
    'logitech-mx-master-3s',
    'Chuột không dây biểu tượng được tái thiết kế. Nút nhấn yên tĩnh tuyệt đối và cảm biến 8K DPI có thể sử dụng trên mọi bề mặt, kể cả kính.',
    2590000, 2990000,
    (SELECT id FROM categories WHERE slug = 'accessories'),
    'Logitech', 
    '/placeholder.svg?height=600&width=800',
    ARRAY['/placeholder.svg?height=600&width=800'],
    40, false, true,
    jsonb_build_object(
        'sensor',     'Darkfield high precision 8000 DPI',
        'buttons',    '7 nút có thể lập trình',
        'battery',    'Lên đến 70 ngày, sạc nhanh 1 phút dùng 3 giờ',
        'connectivity','Bluetooth Low Energy & Logi Bolt'
    ),
    4.7, 283
)
ON CONFLICT (slug) DO UPDATE SET
    price = EXCLUDED.price,
    description = EXCLUDED.description,
    specs = EXCLUDED.specs;
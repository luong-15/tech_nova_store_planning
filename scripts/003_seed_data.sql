INSERT INTO public.categories (id, name, slug, description, image_url, parent_id, sort_order, is_active, created_at, updated_at)
VALUES
('4ca6608a-c718-4796-ba8d-e40cf2acaad8', 'Laptop', 'laptop', 'Máy tính xách tay hiệu năng cao cho làm việc và chơi game', '/placeholder.svg?height=400&width=600', NULL, 0, true, '2025-12-18T03:14:04.147811+00:00', NOW()),
('e18b846f-f762-4f69-8902-3b36417cc773', 'Smartphone', 'smartphone', 'Điện thoại thông minh với công nghệ mới nhất', '/placeholder.svg?height=400&width=600', NULL, 1, true, '2025-12-18T03:14:04.147811+00:00', NOW()),
('64ae037e-8d91-4c76-bdbd-d40062c23e60', 'Accessories', 'accessories', 'Phụ kiện công nghệ cao cấp', '/placeholder.svg?height=400&width=600', NULL, 2, true, '2025-12-18T03:14:04.147811+00:00', NOW()),
('99206a0a-a49f-48be-9a40-79d7c9ff8b6f', 'Monitor', 'monitor', 'Màn hình độ phân giải cao, màu sắc chuẩn xác', '/placeholder.svg?height=400&width=600', NULL, 3, true, '2026-01-22T04:07:10.793055+00:00', NOW()),
('55d23110-b9a5-4849-8cc4-1dfb5b6173c7', 'Smartwatch', 'smartwatch', 'Đồng hồ thông minh theo dõi sức khỏe và thông báo', '/placeholder.svg?height=400&width=600', NULL, 4, true, '2026-01-22T04:07:10.793055+00:00', NOW()),
('4a07d2a6-ceb2-4ae8-b449-0b7b84272941', 'Tablet', 'tablet', 'Máy tính bảng mạnh mẽ cho sáng tạo và giải trí', '/placeholder.svg?height=400&width=600', NULL, 5, true, '2026-01-22T04:07:10.793055+00:00', NOW())
ON CONFLICT (id) DO UPDATE SET
    name = EXCLUDED.name,
    slug = EXCLUDED.slug,
    description = EXCLUDED.description,
    image_url = EXCLUDED.image_url,
    sort_order = EXCLUDED.sort_order,
    is_active = EXCLUDED.is_active,
    updated_at = NOW();
  
INSERT INTO public.products (id, name, slug, description, price, original_price, category_id, brand, image_url, images, stock, is_featured, is_deal, specs, rating, review_count, created_at, updated_at)
VALUES
('ef89024d-1dc8-408d-808f-a4696b71f93f', 'ASUS ROG Zephyrus G14', 'asus-rog-zephyrus-g14', 'Compact gaming powerhouse with AMD Ryzen 9 and RTX 4060.', 49990000.00, NULL, '4ca6608a-c718-4796-ba8d-e40cf2acaad8', 'ASUS', '/placeholder.svg?height=600&width=800', ARRAY['/placeholder.svg?height=600&width=800'], 12, false, false, '{"cpu": "AMD Ryzen 9 7940HS", "ram": "16GB DDR5"}', 4.6, 64, '2025-12-18T03:14:04.147811+00:00', NOW()),
('d9f8458b-835f-4067-b895-f8d0d42c3cb3', 'iPhone 15 Pro Max', 'iphone-15-pro-max', 'Titanium design, A17 Pro chip.', 33990000.00, NULL, 'e18b846f-f762-4f69-8902-3b36417cc773', 'Apple', '/placeholder.svg?height=600&width=800', ARRAY['/placeholder.svg?height=600&width=800'], 30, true, false, '{"chip": "A17 Pro", "ram": "8GB"}', 4.8, 342, '2025-12-18T03:14:04.147811+00:00', NOW()),
('afc465ca-3f8c-4905-b7a3-54847e5fa953', 'Keychron Q6 Max Custom Keyboard', 'keychron-q6-max', 'Bàn phím cơ Custom cao cấp vỏ nhôm.', 5200000.00, 5500000.00, '64ae037e-8d91-4c76-bdbd-d40062c23e60', 'Keychron', '/placeholder.svg?height=600&width=800', ARRAY['/placeholder.svg?height=600&width=800'], 15, true, true, '{"layout": "100%", "switches": "Gateron Jupiter"}', 4.9, 28, '2026-01-23T03:37:59.704768+00:00', NOW()),
('1af49b1a-ccec-4c63-bb30-bbc314538a1d', 'Apple Watch Ultra 2', 'apple-watch-ultra-2', 'Đồng hồ thể thao vỏ Titan cực bền.', 21490000.00, 22990000.00, '55d23110-b9a5-4849-8cc4-1dfb5b6173c7', 'Apple', '/placeholder.svg?height=600&width=800', ARRAY['/placeholder.svg?height=600&width=800'], 25, true, true, '{"case": "Titanium", "size": "49mm"}', 4.8, 115, '2026-01-23T03:37:59.704768+00:00', NOW())
ON CONFLICT (id) DO UPDATE SET
    price = EXCLUDED.price,
    stock = EXCLUDED.stock,
    is_featured = EXCLUDED.is_featured,
    specs = EXCLUDED.specs,
    updated_at = NOW();INSERT INTO public.products (id, name, slug, description, price, original_price, category_id, brand, image_url, images, stock, is_featured, is_deal, specs, rating, review_count, created_at, updated_at)
VALUES
('ef89024d-1dc8-408d-808f-a4696b71f93f', 'ASUS ROG Zephyrus G14', 'asus-rog-zephyrus-g14', 'Compact gaming powerhouse with AMD Ryzen 9 and RTX 4060.', 49990000.00, NULL, '4ca6608a-c718-4796-ba8d-e40cf2acaad8', 'ASUS', '/placeholder.svg?height=600&width=800', ARRAY['/placeholder.svg?height=600&width=800'], 12, false, false, '{"cpu": "AMD Ryzen 9 7940HS", "ram": "16GB DDR5"}', 4.6, 64, '2025-12-18T03:14:04.147811+00:00', NOW()),
('d9f8458b-835f-4067-b895-f8d0d42c3cb3', 'iPhone 15 Pro Max', 'iphone-15-pro-max', 'Titanium design, A17 Pro chip.', 33990000.00, NULL, 'e18b846f-f762-4f69-8902-3b36417cc773', 'Apple', '/placeholder.svg?height=600&width=800', ARRAY['/placeholder.svg?height=600&width=800'], 30, true, false, '{"chip": "A17 Pro", "ram": "8GB"}', 4.8, 342, '2025-12-18T03:14:04.147811+00:00', NOW()),
('afc465ca-3f8c-4905-b7a3-54847e5fa953', 'Keychron Q6 Max Custom Keyboard', 'keychron-q6-max', 'Bàn phím cơ Custom cao cấp vỏ nhôm.', 5200000.00, 5500000.00, '64ae037e-8d91-4c76-bdbd-d40062c23e60', 'Keychron', '/placeholder.svg?height=600&width=800', ARRAY['/placeholder.svg?height=600&width=800'], 15, true, true, '{"layout": "100%", "switches": "Gateron Jupiter"}', 4.9, 28, '2026-01-23T03:37:59.704768+00:00', NOW()),
('1af49b1a-ccec-4c63-bb30-bbc314538a1d', 'Apple Watch Ultra 2', 'apple-watch-ultra-2', 'Đồng hồ thể thao vỏ Titan cực bền.', 21490000.00, 22990000.00, '55d23110-b9a5-4849-8cc4-1dfb5b6173c7', 'Apple', '/placeholder.svg?height=600&width=800', ARRAY['/placeholder.svg?height=600&width=800'], 25, true, true, '{"case": "Titanium", "size": "49mm"}', 4.8, 115, '2026-01-23T03:37:59.704768+00:00', NOW())
ON CONFLICT (id) DO UPDATE SET
    price = EXCLUDED.price,
    stock = EXCLUDED.stock,
    is_featured = EXCLUDED.is_featured,
    specs = EXCLUDED.specs,
    updated_at = NOW();

-- Cập nhật Profile người dùng (Ví dụ cho ID trong file JSON)
INSERT INTO public.user_profiles (id, full_name, phone, address, city, country)
VALUES ('af1a0bce-b705-48d4-b88e-1c54216754b7', 'Mac Ngoc Luong', '0303213213', 'Số 1 Hà Nội', 'Hà Nội', 'Vietnam')
ON CONFLICT (id) DO UPDATE SET full_name = EXCLUDED.full_name;

-- Cập nhật đơn hàng
INSERT INTO public.orders (id, user_id, order_number, status, subtotal, shipping_fee, tax, total, shipping_name, shipping_email, shipping_phone, shipping_address, shipping_city, payment_method, payment_status)
VALUES (
    'd9bc2a32-fcc9-4854-9071-5458373dbebf', 
    'af1a0bce-b705-48d4-b88e-1c54216754b7', 
    'TN1775009548300', 
    'processing', 
    5000.00, 
    30000.00, 
    0.00, 
    35000.00, 
    'luong', 
    'macngocluong1572004@gmail.com', 
    '30321321311', 
    'sdfghjkl', 
    'hà nội', 
    'cod', 
    'unpaid'
)
ON CONFLICT (id) DO UPDATE SET status = EXCLUDED.status;

-- Cập nhật chi tiết đơn hàng
INSERT INTO public.order_items (id, order_id, product_id, product_name, quantity, price)
VALUES ('8b8af300-1cbd-4081-8787-24dc8865d40c', 'f4cf32ec-9086-4cdc-b022-78e6b10491de', '1af49b1a-ccec-4c63-bb30-bbc314538a1d', 'Apple Watch Ultra 2', 1, 21490000.00)
ON CONFLICT (id) DO NOTHING;

INSERT INTO public.reviews (id, product_id, user_id, rating, title, comment, created_at, updated_at)
VALUES
-- Đánh giá cho iPhone 15 Pro Max
(gen_random_uuid(), 'd9f8458b-835f-4067-b895-f8d0d42c3cb3', 'af1a0bce-b705-48d4-b88e-1c54216754b7', 5, 'Tuyệt vời', 'Máy rất nhẹ và mượt, camera chụp đêm đỉnh cao.', NOW(), NOW()),

-- Đánh giá cho Apple Watch Ultra 2
(gen_random_uuid(), '1af49b1a-ccec-4c63-bb30-bbc314538a1d', 'af1a0bce-b705-48d4-b88e-1c54216754b7', 4, 'Pin ổn', 'Thiết kế hầm hố, pin dùng được 3 ngày thoải mái.', NOW(), NOW())

ON CONFLICT (product_id, user_id) 
DO UPDATE SET 
    rating = EXCLUDED.rating,
    comment = EXCLUDED.comment,
    updated_at = NOW();
    
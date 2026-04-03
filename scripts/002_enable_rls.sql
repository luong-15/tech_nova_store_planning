-- 1. Kích hoạt RLS cho tất cả các bảng
ALTER TABLE public.categories ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.products ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.user_profiles ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.orders ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.order_items ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.wishlist ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.reviews ENABLE ROW LEVEL SECURITY;

-- ==========================================
-- 2. PUBLIC ACCESS (Ai cũng có thể xem)
-- ==========================================

-- Categories: Ai cũng có thể xem danh mục để hiện sidebar
CREATE POLICY "Allow public read access for categories"
  ON public.categories FOR SELECT USING (true);

-- Products: Ai cũng có thể xem sản phẩm
CREATE POLICY "Allow public read access for products"
  ON public.products FOR SELECT USING (true);

-- Reviews: Ai cũng có thể xem đánh giá
CREATE POLICY "Allow public read access for reviews"
  ON public.reviews FOR SELECT USING (true);

-- ==========================================
-- 3. USER PROFILES (Cá nhân hóa)
-- ==========================================

-- Thay vì dùng nhiều chính sách, gom lại để dễ quản lý
CREATE POLICY "Users can manage their own profile"
  ON public.user_profiles
  FOR ALL -- Bao gồm SELECT, INSERT, UPDATE, DELETE
  USING (auth.uid() = id)
  WITH CHECK (auth.uid() = id);

-- ==========================================
-- 4. ORDERS (Đơn hàng)
-- ==========================================

-- Xem đơn hàng của chính mình
CREATE POLICY "Users can view their own orders"
  ON public.orders FOR SELECT
  USING (auth.uid() = user_id);

-- Tạo đơn hàng mới (Ràng buộc user_id phải là chính mình)
CREATE POLICY "Users can insert their own orders"
  ON public.orders FOR INSERT
  WITH CHECK (auth.uid() = user_id);

-- ==========================================
-- 5. ORDER ITEMS (Chi tiết đơn hàng)
-- ==========================================

-- Xem chi tiết đơn hàng (Tối ưu hóa query để tránh chậm sidebar/filter)
CREATE POLICY "Users can view their own order items"
  ON public.order_items FOR SELECT
  USING (
    EXISTS (
      SELECT 1 FROM public.orders 
      WHERE orders.id = order_items.order_id 
      AND orders.user_id = auth.uid()
    )
  );

-- Chèn chi tiết đơn hàng (Dùng CHECK trực tiếp để đảm bảo tính nhất quán)
CREATE POLICY "Users can insert order items"
  ON public.order_items FOR INSERT
  WITH CHECK (
    EXISTS (
      SELECT 1 FROM public.orders 
      WHERE orders.id = order_items.order_id 
      AND orders.user_id = auth.uid()
    )
  );

-- ==========================================
-- 6. WISHLIST (Danh sách yêu thích)
-- ==========================================

CREATE POLICY "Users can manage their own wishlist"
  ON public.wishlist
  FOR ALL
  USING (auth.uid() = user_id)
  WITH CHECK (auth.uid() = user_id);

-- ==========================================
-- 7. REVIEWS (Đánh giá sản phẩm)
-- ==========================================

-- Lưu ý: SELECT đã được set ở phần Public phía trên
CREATE POLICY "Users can insert their own reviews"
  ON public.reviews FOR INSERT
  WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can update/delete their own reviews"
  ON public.reviews
  FOR ALL
  USING (auth.uid() = user_id)
  WITH CHECK (auth.uid() = user_id);
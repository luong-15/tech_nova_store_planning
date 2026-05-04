"use client";

import { useEffect, useState, useRef } from "react";
import { useParams, notFound } from "next/navigation";
import { createBrowserClient } from "@/lib/supabase/client";
import { useCartStore } from "@/lib/store/cart-store";
import { ProductGallery } from "@/components/product-gallery";
import { ProductSpecs } from "@/components/product-specs";
import { ProductReviews } from "@/components/product-reviews";
import { ProductCard } from "@/components/product-card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Skeleton } from "@/components/ui/skeleton";
import { formatCurrency } from "@/lib/currency";
import { cn } from "@/lib/utils"; // Đảm bảo import cn
import {
  ShoppingCart,
  Heart,
  Share2,
  Shield,
  Truck,
  RotateCcw,
  Star,
  Clock,
  ChevronRight,
} from "lucide-react";
import {
  notifyCartAdded,
  notifyWishlistAdded,
  notifyWishlistRemoved,
  notifyError,
  notifyInfo,
} from "@/lib/notifications";
import Link from "next/link";
import type { Product, Review, UserProfile } from "@/lib/types";
import { motion } from "framer-motion";
import { triggerFlyToCart } from "@/components/animations/fly-to-cart";

export default function ProductPage() {
  const params = useParams();
  const slug = params.slug as string;
  const addToCart = useCartStore((state) => state.addToCart);

  const [product, setProduct] = useState<Product | null>(null);
  const [reviews, setReviews] = useState<
    (Review & { user?: UserProfile | null })[]
  >([]);
  const [relatedProducts, setRelatedProducts] = useState<Product[]>([]);
  const [loading, setLoading] = useState(true);
  const [isInWishlist, setIsInWishlist] = useState(false);

  useEffect(() => {
    const fetchProductData = async () => {
      const supabase = createBrowserClient();

      // Fetch product
      const { data: productData, error } = await supabase
        .from("products")
        .select("*")
        .eq("slug", slug)
        .single();

      if (error || !productData) {
        notFound();
        return;
      }

      setProduct(productData);

      // Fetch reviews
      const { data: reviewsData } = await supabase
        .from("reviews")
        .select("*")
        .eq("product_id", productData.id)
        .order("created_at", { ascending: false });

      // Fetch user profiles for reviews
      let reviewsWithUsers: (Review & { user?: UserProfile | null })[] = [];
      if (reviewsData && reviewsData.length > 0) {
        const userIds = [...new Set(reviewsData.map((r: any) => r.user_id))];
        const { data: profiles } = await supabase
          .from("user_profiles")
          .select("*")
          .in("id", userIds);

        reviewsWithUsers = reviewsData.map((review: any) => ({
          ...review,
          user: profiles?.find((p: any) => p.id === review.user_id) || null,
        }));
      }

      setReviews(reviewsWithUsers);

      // Fetch related products
      const { data: related } = await supabase
        .from("products")
        .select("*")
        .eq("category_id", productData.category_id)
        .neq("id", productData.id)
        .limit(4);

      if (related) {
        setRelatedProducts(related);
      }

      // Check wishlist status
      const {
        data: { user },
      } = await supabase.auth.getUser();
      if (user) {
        const { data: wishlistItem } = await supabase
          .from("wishlist")
          .select("*")
          .eq("user_id", user.id)
          .eq("product_id", productData.id)
          .single();

        setIsInWishlist(!!wishlistItem);
      }

      setLoading(false);
    };

    fetchProductData();
  }, [slug]);

  const cartButtonRef = useRef<HTMLButtonElement>(null);

  const handleAddToCart = (e: React.MouseEvent<HTMLButtonElement>) => {
    if (product && cartButtonRef.current) {
      triggerFlyToCart(product.image_url || '', product.id, e as any);
      setTimeout(() => {
        addToCart(product);
        notifyCartAdded(product.name, () =>
        useCartStore.getState().removeItem(product.id),
      );
      }, 200);
    }
  };

  const handleAddToWishlist = async () => {
    if (!product) return;
    const supabase = createBrowserClient();
    const {
      data: { user },
    } = await supabase.auth.getUser();

    if (!user) {
      notifyError("Vui lòng đăng nhập để thêm vào danh sách yêu thích");
      return;
    }

    try {
      if (isInWishlist) {
        // Undo: delete
        const { error } = await supabase
          .from("wishlist")
          .delete()
          .eq("user_id", user.id)
          .eq("product_id", product.id);
        if (error) throw error;
        setIsInWishlist(false);
        notifyWishlistRemoved(product.name);
      } else {
        // Add - check duplicate first
        const { data: existing } = await supabase
          .from("wishlist")
          .select("*")
          .eq("user_id", user.id)
          .eq("product_id", product.id)
          .single();

        if (existing) {
          notifyInfo("Sản phẩm đã có trong wishlist");
          return;
        }

        const { error } = await supabase.from("wishlist").insert({
          user_id: user.id,
          product_id: product.id,
        });
        if (error) throw error;
        setIsInWishlist(true);
        notifyWishlistAdded(product.name);
      }
    } catch (error: any) {
      console.error("Wishlist error:", error);
      if (error.code === "P0001") {
        notifyError("Duplicate wishlist entry");
      } else if (error.message.includes("RLS")) {
        notifyError("Vui lòng đăng nhập lại");
      } else {
        notifyError("Có lỗi xảy ra");
      }
    }
  };

  const handleShare = async () => {
    if (!product) return;
    const url = window.location.href;
    if (navigator.share) {
      try {
        await navigator.share({
          title: product.name,
          text: product.description,
          url: url,
        });
        notifyInfo("Đã chia sẻ sản phẩm");
      } catch (error) {
        console.log("Share cancelled or failed");
      }
    } else {
      try {
        await navigator.clipboard.writeText(url);
        notifyInfo("Đã sao chép liên kết sản phẩm");
      } catch (error) {
        notifyError("Không thể sao chép liên kết");
      }
    }
  };

  if (loading) return <ProductPageSkeleton />;

  if (!product) return notFound();

  const discount = product.discount_price
    ? Math.round(
        ((product.price - product.discount_price) / product.price) * 100,
      )
    : 0;

  const images = (product.images as string[]) || [product.image_url];

  return (
    <motion.div
      className="min-h-screen bg-slate-50/30 dark:bg-transparent"
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ duration: 0.5 }}
    >
      {/* Breadcrumb - Sticky Glass */}
      <div className="sticky top-16 z-30 border-b border-border/40 bg-background/80 backdrop-blur-xl supports-backdrop-filter:bg-background/60">
        <div className="container mx-auto px-4 py-3">
          <div className="flex items-center gap-1.5 text-sm font-medium text-muted-foreground/80">
            <Link href="/" className="hover:text-primary transition-colors">
              Trang chủ
            </Link>
            <ChevronRight className="h-3.5 w-3.5" />
            <Link
              href="/products"
              className="hover:text-primary transition-colors"
            >
              Sản phẩm
            </Link>
            <ChevronRight className="h-3.5 w-3.5" />
            <span className="text-foreground truncate max-w-50 sm:max-w-none">
              {product.name}
            </span>
          </div>
        </div>
      </div>

      <div className="container mx-auto px-4 py-10 lg:py-16">
        {/* Main Grid: Gallery + Info */}
        <motion.div
          className="grid gap-10 lg:grid-cols-2 lg:gap-16 items-start"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.1 }}
        >
          {/* Left Column: Gallery */}
          <motion.div
            className="rounded-3xl p-1 bg-white dark:bg-background/50 border border-border/40 shadow-2xl shadow-black/5"
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.6, delay: 0.2 }}
          >
            <ProductGallery images={images} productName={product.name} />
          </motion.div>

          {/* Right Column: Sticky Info */}
          <motion.div
            className="sticky top-32 flex flex-col gap-8"
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.6, delay: 0.3 }}
          >
            {/* Header: Brand, Title, Rating */}
            <div className="space-y-4">
              <div className="flex items-center gap-4">
                {product.brand && (
                  <Badge
                    variant="secondary"
                    className="px-3 py-1 bg-primary/10 text-primary hover:bg-primary/20 transition-colors rounded-lg font-bold"
                  >
                    {product.brand}
                  </Badge>
                )}
                <div className="flex items-center gap-1.5 bg-yellow-500/10 px-2.5 py-1 rounded-lg text-yellow-600 dark:text-yellow-500 font-semibold text-sm">
                  <Star className="h-4 w-4 fill-current" />
                  <span>{product.rating?.toFixed(1) || "0.0"}</span>
                  <span className="text-muted-foreground ml-1">
                    ({product.review_count || 0} đánh giá)
                  </span>
                </div>
              </div>

              <h1 className="text-3xl md:text-4xl lg:text-5xl font-extrabold tracking-tight text-foreground leading-[1.1]">
                {product.name}
              </h1>

              <p className="text-lg text-muted-foreground leading-relaxed">
                {product.description}
              </p>
            </div>

            {/* Pricing Section */}
            <div className="p-6 rounded-3xl bg-muted/30 border border-border/50 space-y-4">
              <div className="flex flex-wrap items-baseline gap-4">
                <span className="text-4xl md:text-5xl font-extrabold text-primary tracking-tighter">
                  {formatCurrency(product.discount_price || product.price)}
                </span>
                {product.discount_price && (
                  <div className="flex items-center gap-3">
                    <span className="text-xl text-muted-foreground/60 font-semibold line-through decoration-2">
                      {formatCurrency(product.price)}
                    </span>
                    <Badge className="bg-destructive hover:bg-destructive text-white px-2.5 py-1 text-sm font-bold rounded-lg shadow-sm">
                      -{discount}%
                    </Badge>
                  </div>
                )}
              </div>

              {/* Deal Timer */}
              {product.is_deal && (
                <div className="flex items-center gap-2 text-sm font-bold text-orange-500 bg-orange-500/10 w-fit px-3 py-1.5 rounded-lg border border-orange-500/20">
                  <Clock className="h-4 w-4 animate-pulse" />
                  <span>Flash Sale kết thúc sau: 02:45:30</span>
                </div>
              )}

              {/* Stock Status */}
              <div className="flex items-center gap-2 pt-2 border-t border-border/40 mt-4">
                <span className="relative flex h-3 w-3">
                  {(product.stock ?? 0) > 0 && (
                    <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-green-400 opacity-75"></span>
                  )}
                  <span
                    className={cn(
                      "relative inline-flex rounded-full h-3 w-3",
                      (product.stock ?? 0) > 0
                        ? "bg-green-500"
                        : "bg-destructive",
                    )}
                  ></span>
                </span>
                <span
                  className={cn(
                    "font-semibold",
                    (product.stock ?? 0) > 0
                      ? "text-green-600 dark:text-green-500"
                      : "text-destructive",
                  )}
                >
                  {(product.stock ?? 0) > 0
                    ? `Sẵn sàng giao (${product.stock} sản phẩm)`
                    : "Tạm hết hàng"}
                </span>
              </div>
            </div>

            {/* Actions */}
            <motion.div
              className="flex gap-4"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.4, duration: 0.5 }}
            >
              <Button
                ref={cartButtonRef}
                size="lg"
                className="flex-1 h-14 text-base font-bold rounded-2xl shadow-lg shadow-primary/25 hover:shadow-primary/40 hover:-translate-y-0.5 transition-all duration-300"
                disabled={!product.stock || product.stock <= 0}
                onClick={handleAddToCart}
                data-cart-button
                asChild
              >
                <motion.button
                  whileTap={{ scale: 0.95 }}
                  whileHover={{ scale: 1.02 }}
                >
                  <ShoppingCart className="mr-2 h-5 w-5" />
                  Thêm vào giỏ hàng
                </motion.button>
              </Button>
              <motion.div whileTap={{ scale: 0.95 }}>
                <Button
                  size="icon"
                  variant="outline"
                  className={cn(
                    "h-14 w-14 rounded-2xl border-border/50 transition-all duration-300",
                    isInWishlist
                      ? "bg-red-50 border-red-200 text-red-500 dark:bg-red-500/10 dark:border-red-500/30"
                      : "hover:bg-muted",
                  )}
                  onClick={handleAddToWishlist}
                >
                  <motion.div
                    animate={isInWishlist ? { scale: [1, 1.2, 1] } : {}}
                  >
                    <Heart
                      className={cn(
                        "h-6 w-6 transition-transform",
                        isInWishlist ? "fill-current scale-110" : "scale-100",
                      )}
                    />
                  </motion.div>
                </Button>
              </motion.div>
              <motion.div whileTap={{ scale: 0.95 }}>
                <Button
                  size="icon"
                  variant="outline"
                  className="h-14 w-14 rounded-2xl border-border/50 hover:bg-muted transition-all duration-300"
                  onClick={handleShare}
                >
                  <Share2 className="h-6 w-6 text-muted-foreground" />
                </Button>
              </motion.div>
            </motion.div>

            {/* Benefits Cards */}
            <div className="grid grid-cols-3 gap-4 pt-4">
              {[
                { icon: Truck, title: "Freeship", desc: "Đơn từ 500K" },
                { icon: Shield, title: "Bảo hành", desc: "24 tháng" },
                { icon: RotateCcw, title: "Đổi trả", desc: "30 ngày" },
              ].map((benefit, i) => (
                <div
                  key={i}
                  className="group flex flex-col items-center justify-center p-4 rounded-2xl border border-border/40 bg-card/40 hover:bg-primary/5 hover:border-primary/20 hover:-translate-y-1 transition-all duration-300 text-center space-y-2 cursor-default"
                >
                  <div className="bg-primary/10 p-3 rounded-xl group-hover:scale-110 group-hover:bg-primary/20 transition-all duration-300">
                    <benefit.icon className="h-6 w-6 text-primary" />
                  </div>
                  <div>
                    <p className="font-semibold text-sm">{benefit.title}</p>
                    <p className="text-xs text-muted-foreground">
                      {benefit.desc}
                    </p>
                  </div>
                </div>
              ))}
            </div>
          </motion.div>
        </motion.div>

        {/* Tabs Section */}
        <div className="mt-20 lg:mt-32">
          <Tabs defaultValue="description" className="w-full">
            <TabsList className="w-full justify-start h-auto p-1.5 bg-muted/40 backdrop-blur-md rounded-2xl overflow-x-auto overflow-y-hidden flex-nowrap border border-border/40">
              <TabsTrigger
                value="description"
                className="rounded-xl px-6 py-3 text-base font-semibold data-[state=active]:bg-background data-[state=active]:shadow-sm"
              >
                Mô tả chi tiết
              </TabsTrigger>
              <TabsTrigger
                value="specs"
                className="rounded-xl px-6 py-3 text-base font-semibold data-[state=active]:bg-background data-[state=active]:shadow-sm"
              >
                Thông số kỹ thuật
              </TabsTrigger>
              <TabsTrigger
                value="reviews"
                className="rounded-xl px-6 py-3 text-base font-semibold data-[state=active]:bg-background data-[state=active]:shadow-sm"
              >
                Đánh giá ({reviews.length})
              </TabsTrigger>
            </TabsList>

            <div className="mt-8">
              <TabsContent
                value="description"
                className="animate-in slide-in-from-bottom-4 fade-in duration-500"
              >
                <div className="prose prose-slate dark:prose-invert max-w-4xl mx-auto text-base leading-loose p-8 rounded-3xl bg-card border border-border/40 shadow-sm">
                  <p>{product.description}</p>
                  {/* Có thể render rich text (HTML) ở đây nếu DB hỗ trợ */}
                </div>
              </TabsContent>

              <TabsContent
                value="specs"
                className="animate-in slide-in-from-bottom-4 fade-in duration-500"
              >
                <div className="max-w-4xl mx-auto">
                  <ProductSpecs
                    specifications={product.specs as Record<string, string>}
                  />
                </div>
              </TabsContent>

              <TabsContent
                value="reviews"
                className="animate-in slide-in-from-bottom-4 fade-in duration-500"
              >
                <ProductReviews
                  reviews={reviews}
                  productId={product.id}
                  averageRating={product.rating || 0}
                  totalReviews={product.review_count || 0}
                />
              </TabsContent>
            </div>
          </Tabs>
        </div>

        {/* Related Products Section */}
        {relatedProducts && relatedProducts.length > 0 && (
          <motion.div
            className="mt-24"
            initial={{ opacity: 0, y: 40 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, margin: "-100px" }}
            transition={{ duration: 0.6 }}
          >
            <motion.div
              className="flex items-center justify-between mb-8"
              initial={{ opacity: 0 }}
              whileInView={{ opacity: 1 }}
              viewport={{ once: true }}
              transition={{ delay: 0.2, duration: 0.5 }}
            >
              <h2 className="text-3xl font-extrabold tracking-tight">
                Sản phẩm tương tự
              </h2>
              <Button
                variant="ghost"
                className="text-primary hover:bg-primary/10 rounded-xl font-bold"
              >
                Xem tất cả <ChevronRight className="ml-1 h-4 w-4" />
              </Button>
            </motion.div>
            <motion.div
              className="grid gap-6 sm:grid-cols-2 lg:grid-cols-4"
              initial="hidden"
              whileInView="visible"
              viewport={{ once: true, margin: "-100px" }}
              variants={{
                hidden: { opacity: 0 },
                visible: {
                  opacity: 1,
                  transition: {
                    staggerChildren: 0.1,
                    delayChildren: 0.3,
                  },
                },
              }}
            >
              {relatedProducts.map((relatedProduct: Product) => (
                <motion.div
                  key={relatedProduct.id}
                  variants={{
                    hidden: { opacity: 0, y: 20 },
                    visible: {
                      opacity: 1,
                      y: 0,
                      transition: { duration: 0.5, ease: "easeOut" },
                    },
                  }}
                >
                  <ProductCard product={relatedProduct} />
                </motion.div>
              ))}
            </motion.div>
          </motion.div>
        )}
      </div>
    </motion.div>
  );
}

// Skeleton Component được tách ra để code gọn gàng hơn
function ProductPageSkeleton() {
  return (
    <div className="container mx-auto px-4 py-10 lg:py-16">
      <div className="grid gap-10 lg:grid-cols-2 lg:gap-16">
        <Skeleton className="aspect-square w-full rounded-3xl" />
        <div className="space-y-8">
          <div className="space-y-4">
            <Skeleton className="h-8 w-24 rounded-lg" />
            <Skeleton className="h-14 w-full rounded-xl" />
            <Skeleton className="h-14 w-4/5 rounded-xl" />
            <Skeleton className="h-20 w-full rounded-xl" />
          </div>
          <Skeleton className="h-32 w-full rounded-3xl" />
          <div className="flex gap-4">
            <Skeleton className="h-14 flex-1 rounded-2xl" />
            <Skeleton className="h-14 w-14 rounded-2xl" />
            <Skeleton className="h-14 w-14 rounded-2xl" />
          </div>
          <div className="grid grid-cols-3 gap-4">
            {[1, 2, 3].map((i) => (
              <Skeleton key={i} className="h-32 rounded-2xl" />
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}

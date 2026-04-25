import type React from "react";
import { Header } from "@/components/header";
import { Footer } from "@/components/footer";
import { ComparisonDrawer } from "@/components/comparison-drawer";
import { ChatAssistant } from "@/components/chat-assistant";
import { MaintenanceScreen } from "@/components/maintenance-screen";
import { createAdminServerClient } from "@/lib/supabase/server";
import { Toaster } from "@/components/ui/toaster";
import { createReadOnlyServerClient } from "@/lib/supabase/server";
import type { Product } from "@/lib/types";

async function getMaintenanceMode() {
  try {
    const supabase = await createAdminServerClient();
    const { data, error } = await supabase
      .from("settings")
      .select("maintenance_mode")
      .eq("id", "global")
      .maybeSingle();

    console.log(
      "[MAINTENANCE] DB data:",
      data,
      "Error:",
      error,
      "(service role)",
    );

    return data?.maintenance_mode || false;
  } catch (error) {
    console.error("[MAINTENANCE] Query error:", error);
    return false;
  }
}

async function getProducts(): Promise<Product[]> {
  try {
    const supabase = createReadOnlyServerClient();
    const { data: products, error } = await supabase
      .from("products")
      .select(
        `
        *,
        category:categories(*)
      `,
      )
      .order("created_at", { ascending: false })
      .limit(50);

    if (error) {
      console.log("Supabase error - using fallback products:", error.message);
      return getFallbackProducts();
    }

    return products || [];
  } catch (error: any) {
    console.log(
      "Fetch error in getProducts - using fallback products:",
      error.message || error,
    );
    return getFallbackProducts();
  }
}

function getFallbackProducts(): Product[] {
  return [
    {
      id: "1",
      name: "iPhone 15 Pro Max",
      slug: "iphone-15-pro-max",
      description:
        "Điện thoại thông minh cao cấp với camera xuất sắc và hiệu năng mạnh mẽ",
      price: 34990000,
      original_price: 39990000,
      category_id: "1",
      brand: "Apple",
      image_url: "/placeholder.jpg",
      images: ["/placeholder.jpg"],
      stock: 10,
      is_featured: true,
      is_deal: true,
      specs: {
        "Màn hình": "6.7 inch Super Retina XDR",
        Chip: "A17 Pro",
        Camera: "48MP",
        RAM: "8GB",
        "Bộ nhớ": "256GB",
      },
      rating: 4.8,
      review_count: 125,
      created_at: new Date().toISOString(),
      updated_at: new Date().toISOString(),
      category: {
        id: "1",
        name: "Điện thoại",
        slug: "dien-thoai",
        description: "Điện thoại thông minh và phụ kiện",
        created_at: new Date().toISOString(),
        updated_at: new Date().toISOString(),
      },
    },
    {
      id: "2",
      name: 'MacBook Pro 16"',
      slug: "macbook-pro-16",
      description: "Laptop chuyên nghiệp cho nhà phát triển và designer",
      price: 59990000,
      original_price: 65990000,
      category_id: "2",
      brand: "Apple",
      image_url: "/placeholder.jpg",
      images: ["/placeholder.jpg"],
      stock: 5,
      is_featured: true,
      is_deal: false,
      specs: {
        "Màn hình": "16.2 inch Liquid Retina XDR",
        Chip: "M3 Max",
        RAM: "32GB",
        SSD: "1TB",
        Pin: "22 giờ",
      },
      rating: 4.9,
      review_count: 89,
      created_at: new Date().toISOString(),
      updated_at: new Date().toISOString(),
      category: {
        id: "2",
        name: "Laptop",
        slug: "laptop",
        description: "Máy tính xách tay",
        created_at: new Date().toISOString(),
        updated_at: new Date().toISOString(),
      },
    },
    {
      id: "3",
      name: "Samsung Galaxy S24 Ultra",
      slug: "samsung-galaxy-s24-ultra",
      description: "Điện thoại flagship với S Pen và camera 200MP",
      price: 29990000,
      original_price: 32990000,
      category_id: "1",
      brand: "Samsung",
      image_url: "/placeholder.jpg",
      images: ["/placeholder.jpg"],
      stock: 15,
      is_featured: true,
      is_deal: true,
      specs: {
        "Màn hình": "6.8 inch Dynamic AMOLED 2X",
        Chip: "Snapdragon 8 Gen 3",
        Camera: "200MP",
        RAM: "12GB",
        "Bộ nhớ": "512GB",
      },
      rating: 4.7,
      review_count: 203,
      created_at: new Date().toISOString(),
      updated_at: new Date().toISOString(),
      category: {
        id: "1",
        name: "Điện thoại",
        slug: "dien-thoai",
        description: "Điện thoại thông minh và phụ kiện",
        created_at: new Date().toISOString(),
        updated_at: new Date().toISOString(),
      },
    },
  ];
}

export default async function MainLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const maintenanceMode = await getMaintenanceMode();

  console.log("[MAINTENANCE] Mode:", maintenanceMode);

  if (maintenanceMode) {
    console.log("[MAINTENANCE] Showing screen");
    return <MaintenanceScreen />;
  }

  const products = await getProducts();

  return (
    <div className="flex min-h-screen flex-col">
      <Header />
      <main className="flex-1">{children}</main>
      <Footer />
      <ComparisonDrawer />
      <ChatAssistant products={products} />
    </div>
  );
}

# Tech Nova Store Planning - Project Documentation

## Overview

**Tech Nova Store** is a modern, full-featured e-commerce platform built with the latest Next.js stack. This project demonstrates advanced web development practices including AI integration, real-time database operations, comprehensive admin dashboard, product comparison features, and a polished user experience.

**Project Name**: tech_nova_store_planning-main  
**Tech Stack**: Next.js 16 (App Router), React 19, TypeScript, Supabase, Tailwind CSS v4, shadcn/ui, Zustand  
**Deployment Ready**: Vercel-compatible with analytics integration

## 🚀 Key Features

### Customer-Facing Features
- **Product Catalog**: Advanced product listing with filtering, search, and pagination
- **Product Comparison**: Side-by-side product comparison drawer
- **Shopping Cart**: Persistent cart with Zustand state management
- **AI Chat Assistant**: Google Generative AI-powered customer support (powered by Vercel AI SDK)
- **Checkout Flow**: Multi-step checkout process
- **User Dashboard**: Order history, wishlist, settings
- **Responsive Design**: Mobile-first with Tailwind CSS v4 + shadcn/ui components

### Admin Features
- **Admin Dashboard**: Complete product/category/order/user management
- **Real-time Analytics**: Sales stats and performance metrics
- **RESTful APIs**: Admin-only endpoints for CRUD operations
- **Role-Based Access**: Admin authentication and authorization

### Technical Features
- **Server-Side Rendering**: Next.js App Router with streaming and Suspense
- **Database**: Supabase PostgreSQL with RLS (Row Level Security)
- **Authentication**: Supabase Auth with SSR support
- **State Management**: Zustand for cart, comparison, and UI state
- **UI Components**: shadcn/ui library with New York style theme
- **Animations**: Framer Motion + Tailwind Animate CSS
- **Charts**: Recharts for admin analytics
- **Forms**: React Hook Form + Zod validation

## 📁 Project Structure

```
tech_nova_store_planning-main/
├── app/                          # Next.js App Router
│   ├── (main)/                   # Customer-facing routes
│   │   ├── page.tsx             # Homepage
│   │   ├── products/            # Product catalog
│   │   ├── checkout/            # Checkout flow
│   │   ├── compare/             # Product comparison
│   │   └── layout.tsx           # Main layout
│   ├── admin/                   # Admin dashboard
│   ├── dashboard/               # User dashboard
│   ├── api/                     # API routes
│   │   ├── admin/              # Admin APIs
│   │   └── chat/               # AI Chat API
│   └── globals.css              # Tailwind styles
├── components/                   # Reusable UI components
│   ├── ui/                     # shadcn/ui components
│   ├── product-card.tsx        # Product display
│   ├── cart-drawer.tsx         # Shopping cart
│   ├── chat-assistant.tsx      # AI chatbot
│   └── header.tsx              # Navigation
├── lib/                         # Utilities & Config
│   ├── supabase/               # Supabase clients
│   ├── store/                  # Zustand stores
│   └── utils.ts                # Helper functions
├── hooks/                       # Custom React hooks
├── public/                      # Static assets
├── scripts/                     # Database migrations & seeds
├── styles/                      # Additional CSS
└── ...config files
```

## 🛠 Technology Stack

### Core Framework
```
Next.js 16.0.10 (App Router)
React 19.2.0
TypeScript ^5
```

### UI & Styling
```
Tailwind CSS v4.1.9
shadcn/ui (New York style)
Framer Motion ^12.34.3
lucide-react icons
class-variance-authority (CVA)
```

### State & Forms
```
Zustand 5.0.9 (cart, comparison)
React Hook Form ^7.60.0
Zod 3.25.76 (validation)
```

### Backend & Database
```
Supabase (Auth + PostgreSQL)
@supabase/ssr 0.8.0
pg 8.17.1 (Postgres client)
```

### AI & Analytics
```
Vercel AI SDK ^6.0.69 (@ai-sdk/google)
@vercel/analytics 1.3.1
Google Generative AI API
```

### UI Primitives (Radix UI)
```
Dialog, Drawer, Tabs, Accordion, Select, Tooltip, etc.
```

## 🌐 Database Schema

Database setup via SQL scripts:
1. **001_create_tables.sql** - Core tables (products, categories, orders, users)
2. **002_enable_rls.sql** - Row Level Security policies
3. **003_seed_data.sql** - Sample products/categories
4. **004_add_is_active.sql** - Product status management

**Key Tables**:
- `products` - Product catalog with images, specs, pricing
- `categories` - Hierarchical product categories
- `orders` - Order history with line items
- `cart_items` - Shopping cart persistence

## 🔌 API Endpoints

### Admin APIs (`/api/admin/*`)
```
GET/POST /api/admin/products     # Product CRUD
GET/POST /api/admin/categories   # Category management
GET/POST /api/admin/orders       # Order management
GET     /api/admin/stats         # Analytics dashboard
GET/POST /api/admin/users        # User management
```

### Public APIs
```
POST /api/chat                   # AI Chat Assistant
```

## 🚀 Getting Started

### Prerequisites
```bash
Node.js 18+
pnpm (recommended)
Supabase account
Google Generative AI API key
```

### Installation
```bash
cd tech_nova_store_planning-main
pnpm install
cp .env.example .env.local  # Configure Supabase + Google AI keys
pnpm run db:setup          # Run database scripts
pnpm dev
```

### Environment Variables
```env
# Supabase
NEXT_PUBLIC_SUPABASE_URL=...
NEXT_PUBLIC_SUPABASE_ANON_KEY=...
SUPABASE_SERVICE_ROLE_KEY=...

# Google AI
GOOGLE_GENERATIVE_AI_API_KEY=...

# Database (Supabase Postgres)
POSTGRES_URL=...
POSTGRES_PRISMA_URL=...
```

## 📱 Responsive Design

- **Mobile-First**: Full responsive layout
- **Dark/Light Mode**: next-themes integration
- **Mobile Sidebar**: Collapsible navigation
- **Touch Gestures**: Swipe-to-dismiss drawers

## 🎨 Design System

- **shadcn/ui**: Pre-built accessible components
- **Tailwind v4**: CSS variables, modern utilities
- **New York Theme**: Professional gradient design
- **Custom Components**: Product cards, gallery, specs viewer

## 🔒 Security & Performance

✅ **Row Level Security** (Supabase RLS)  
✅ **Server Components** (RSC/Next.js 16)  
✅ **Type Safety** (TypeScript + Zod)  
✅ **Image Optimization** (Next.js Image)  
✅ **Bundle Analysis** (Vercel Analytics)  
✅ **SEO Optimized** (Metadata API)  

## 📈 Admin Dashboard Features

1. **Products**: CRUD operations, image upload, categorization
2. **Orders**: Real-time order tracking, status updates
3. **Analytics**: Revenue charts, top products, sales trends (Recharts)
4. **Users**: Customer management, order history

## 🤖 AI Integration

**Chat Assistant** (`/api/chat`):
- Google Gemini model via Vercel AI SDK
- Context-aware product recommendations
- Natural language order tracking
- 24/7 customer support

## 📱 PWA Ready

- Manifest integration
- Offline cart persistence
- Service worker ready
- Installable web app

## 🌍 Internationalization Ready

- Currency formatting (`lib/currency.ts`)
- Date localization (date-fns)
- RTL support (Tailwind)
- Multi-language structure

## 🎯 Future Enhancements

- [ ] Payment gateway integration (Stripe)
- [ ] Inventory management
- [ ] Multi-vendor marketplace
- [ ] Advanced search (Elasticsearch)
- [ ] Email notifications
- [ ] Customer reviews/ratings

## 🚨 Troubleshooting

### Supabase "fetch failed" (Development Network Issue)
**Symptoms:** Console shows `fetch failed` / fallback products on `/checkout` & main pages

**Cause:** Dev server cannot connect to Supabase (firewall/proxy/DNS/SSL)

**Fixes:**

1. **Test connectivity:**
```bash
nslookup jbpaivqemmarharbjbyv.supabase.co
curl -H "apikey: YOUR_ANON_KEY" "https://jbpaivqemmarharbjbyv.supabase.co/rest/v1/products?select=count"
```

2. **Bypass TLS (dev only):**
```powershell
$env:NODE_TLS_REJECT_UNAUTHORIZED="0"; pnpm dev
```

3. **Corporate Proxy:**
```bash
npm config set proxy http://proxy.company.com:8080
npm config set https-proxy http://proxy.company.com:8080
pnpm dev
```

4. **Database Setup (run SQL scripts in Supabase Dashboard):**
```
scripts/001_create_tables.sql
scripts/002_enable_rls.sql  
scripts/003_seed_data.sql ← 8 sample products
scripts/004_add_is_active.sql
```

**Production:** Vercel → Supabase works perfectly.

### Other Common Issues
- **AI Chat 429:** Rate limit - upgrade Google AI quota
- **Admin 401:** Use service role in `.env.local`
- **Build errors:** `pnpm install --frozen-lockfile`

## 🚀 Deployment

### Vercel (Recommended)
1. Push to GitHub
2. Connect repo in Vercel dashboard
3. Add env vars (Supabase URL/Keys, Google AI)
4. Deploy → Live in 2min

**Auto-deploys:** Git push triggers builds

### Environment Vars (Vercel):
```
NEXT_PUBLIC_SUPABASE_URL=https://jbpaivqemmarharbjbyv.supabase.co
NEXT_PUBLIC_SUPABASE_ANON_KEY=eyJhbGciOiJIUzI1Ni...
SUPABASE_SERVICE_ROLE_KEY=eyJhbGciOiJIUzI1Ni...
GOOGLE_GENERATIVE_AI_API_KEY=AIzaSy...
```

### Docker (Self-Host)
```dockerfile
# Dockerfile.prod
FROM node:20-alpine
COPY . .
RUN pnpm install --frozen-lockfile
RUN pnpm build
EXPOSE 3000
CMD ["pnpm", "start"]
```

## 📊 Performance & Monitoring

- **Vercel Analytics:** Enabled (`@vercel/analytics`)
- **Supabase Logs:** Dashboard → Reports
- **Console Logs:** Enhanced error reporting in layout.tsx

## 📚 Development Workflow

```
pnpm install
# Run DB scripts in Supabase SQL Editor
pnpm dev  # localhost:3000
pnpm build # Production build test
```

---

**Tech Nova Store** - Production-ready e-commerce starter 🚀

*Updated: Network troubleshooting + deployment guide*



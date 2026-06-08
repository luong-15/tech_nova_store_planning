# Tech Nova Store Planning - Project Documentation

## Overview

**Tech Nova Store** is a modern, full-featured e-commerce platform built with the latest Next.js stack. This project demonstrates advanced web development practices including AI integration, real-time database operations, comprehensive admin dashboard, product comparison features, VietQR payment integration, and a polished user experience.

**Project Name**: `tech-nova-store-planning`  
**Tech Stack**: Next.js 16 (App Router), React 19, TypeScript, Supabase, Tailwind CSS v4, shadcn/ui, Zustand  
**Deployment Ready**: Vercel-compatible with analytics integration  
**Language**: Vietnamese UI/UX (`Tiếng Việt`)

## 🚀 Key Features

### Customer-Facing Features

- **Homepage**: Hero section, featured products, deal products, category grid, trust badges
- **Product Catalog**: Advanced product listing with filtering, search, pagination, and sorting
- **Product Detail**: Image gallery, specifications, reviews, related products
- **Product Comparison**: Side-by-side product comparison with specifications table
- **Deals Page**: Dedicated page for promotional/deal products (`is_deal` flag)
- **Shopping Cart**: Persistent cart with Zustand state management, free shipping progress bar
- **Checkout Flow**: Multi-step checkout with shipping info, payment method selection, order summary
- **Payment Methods**:
  - **COD** (Cash on Delivery)
  - **VietQR**: Online bank transfer via QR code scanning
- **Order Success**: Post-checkout confirmation page
- **User Dashboard**: Order history, wishlist management, account settings
- **AI Chat Assistant**: Google Generative AI-powered customer support (Vercel AI SDK)
- **Content Pages**: About, Contact, FAQ, Shipping Policy, Returns Policy, Warranty
- **Responsive Design**: Mobile-first with Tailwind CSS v4 + shadcn/ui components
- **Dark/Light Mode**: next-themes integration

### Admin Features

- **Admin Dashboard**: Overview with sales stats, performance metrics (Recharts)
- **Product Management**: CRUD operations, image handling, categorization, deal/featured flags
- **Category Management**: Hierarchical categories with parent/child support
- **Order Management**: Real-time order tracking, status updates, payment status
- **User Management**: Customer profiles, role management
- **Settings**: Store configuration, maintenance mode, tax rate, contact info
- **RESTful APIs**: Admin-only endpoints for CRUD operations
- **Role-Based Access**: Admin authentication and authorization

### Technical Features

- **Server-Side Rendering**: Next.js App Router with streaming and Suspense
- **Database**: Supabase PostgreSQL with RLS (Row Level Security)
- **Authentication**: Supabase Auth with SSR support, login/forgot-password flows
- **State Management**: Zustand for cart, comparison, and UI state
- **UI Components**: shadcn/ui library with New York style theme
- **Animations**: Framer Motion + Tailwind Animate CSS + Lenis smooth scroll
- **Charts**: Recharts for admin analytics
- **Forms**: React Hook Form + Zod validation
- **Notifications**: Sonner toast notifications

## 📁 Project Structure

```
tech-nova-store-planning/
├── app/                          # Next.js App Router
│   ├── (auth)/                   # Authentication routes (route group)
│   │   ├── auth/login/          # Login page
│   │   ├── auth/forgot-password/# Password reset
│   │   └── layout.tsx           # Auth layout
│   ├── (main)/                   # Customer-facing routes (route group)
│   │   ├── page.tsx             # Homepage
│   │   ├── about/               # About page
│   │   ├── cart/                # Shopping cart
│   │   ├── categories/[slug]/   # Category detail
│   │   ├── checkout/            # Checkout flow
│   │   ├── compare/             # Product comparison
│   │   ├── contact/             # Contact page
│   │   ├── deals/               # Deal products page
│   │   ├── faq/                 # FAQ page
│   │   ├── order-success/       # Order confirmation
│   │   ├── products/            # Product catalog & detail
│   │   ├── returns/             # Returns policy
│   │   ├── shipping/            # Shipping policy
│   │   ├── warranty/            # Warranty info
│   │   └── layout.tsx           # Main layout with header/footer
│   ├── admin/                   # Admin dashboard
│   │   ├── categories/          # Category management
│   │   ├── orders/              # Order management
│   │   ├── products/            # Product management
│   │   ├── settings/            # Store settings
│   │   ├── users/               # User management
│   │   ├── page.tsx             # Admin overview
│   │   └── layout.tsx           # Admin layout
│   ├── dashboard/               # User dashboard
│   │   ├── orders/              # Order history
│   │   ├── settings/            # Account settings
│   │   ├── wishlist/            # Saved products
│   │   ├── page.tsx             # Dashboard home
│   │   └── layout.tsx           # Dashboard layout
│   ├── api/                     # API routes
│   │   ├── admin/              # Admin APIs (products, categories, orders, users, settings, stats)
│   │   ├── categories/         # Public category API
│   │   ├── chat/               # AI Chat Assistant
│   │   ├── orders/             # Order creation & management
│   │   ├── products/           # Public product API with filters
│   │   └── vietqr/             # VietQR payment generation
│   ├── globals.css              # Tailwind styles
│   └── layout.tsx               # Root layout
├── components/                   # Reusable UI components
│   ├── ui/                     # shadcn/ui components
│   ├── animations/             # Framer Motion animations
│   ├── cart/                   # Cart drawer
│   ├── product-card.tsx        # Product display card
│   ├── cart-drawer.tsx         # Shopping cart drawer
│   ├── chat-assistant.tsx      # AI chatbot
│   ├── comparison-drawer.tsx   # Product comparison
│   ├── header.tsx              # Navigation header
│   ├── footer.tsx              # Site footer
│   └── ...
├── lib/                         # Utilities & Config
│   ├── supabase/               # Supabase clients (client, server, admin)
│   ├── store/                  # Zustand stores (cart, comparison)
│   ├── types.ts                # TypeScript interfaces
│   ├── currency.ts             # Currency formatting (VND)
│   ├── settings.ts             # Store settings helpers
│   └── utils.ts                # Helper functions
├── hooks/                       # Custom React hooks
│   ├── use-session.ts          # Supabase session management
│   └── use-toast.ts            # Toast notifications
├── public/                      # Static assets
├── scripts/                     # Database migrations & seeds
│   ├── 001_create_tables.sql   # Core tables
│   ├── 002_enable_rls.sql      # Row Level Security policies
│   ├── 003_seed_data.sql       # Sample products/categories
│   └── 004_add_is_active.sql   # Product status management
├── styles/                      # Additional CSS
├── types/                       # Global type declarations
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
Lenis ^1.3.23 (smooth scroll)
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
@supabase/supabase-js (latest)
pg 8.17.1 (Postgres client)
```

### AI & Analytics

```
Vercel AI SDK ^6.0.69 (@ai-sdk/google)
@vercel/analytics 1.3.1
Google Generative AI API
```

### Payment

```
VietQR (bank transfer QR generation)
COD (Cash on Delivery)
```

### UI Primitives (Radix UI)

```
Dialog, Drawer, Tabs, Accordion, Select, Tooltip, etc.
```

## 🌐 Database Schema

Database setup via SQL scripts in `scripts/`:

1. **001_create_tables.sql** - Core tables with indexes
2. **002_enable_rls.sql** - Row Level Security policies
3. **003_seed_data.sql** - Sample products/categories
4. **004_add_is_active.sql** - Product status management

**Key Tables**:

| Table           | Description                                                |
| --------------- | ---------------------------------------------------------- |
| `categories`    | Hierarchical product categories with parent/child support  |
| `products`      | Product catalog with images, specs (JSONB), pricing, flags |
| `user_profiles` | Extended user info linked to auth.users                    |
| `orders`        | Order history with shipping info, payment status           |
| `order_items`   | Line items for each order                                  |
| `wishlist`      | User saved products                                        |
| `reviews`       | Product ratings and comments (1-5 stars)                   |
| `settings`      | Global store configuration (single row)                    |

**Key Product Fields**:

- `is_featured` - Display on homepage
- `is_deal` - Display on deals page
- `specs` / `specifications` - JSONB technical specifications
- `search_vector` - PostgreSQL full-text search (tsvector)

## 🔌 API Endpoints

### Admin APIs (`/api/admin/*`)

```
GET/POST /api/admin/products       # Product CRUD
GET/POST /api/admin/categories     # Category management
GET/POST /api/admin/orders         # Order management
GET/POST /api/admin/users          # User management
GET/POST /api/admin/settings       # Store settings
GET      /api/admin/stats          # Dashboard analytics
```

### Public APIs

```
GET      /api/products             # Product listing with filters
GET      /api/products/filters     # Available filter options
GET      /api/categories           # Category list
POST     /api/orders               # Create order
GET      /api/orders/[id]/status   # Check order payment status
POST     /api/orders/[id]/cancel   # Cancel order
POST     /api/chat                 # AI Chat Assistant
POST     /api/vietqr/create        # Generate VietQR payment code
```

## 🚀 Getting Started

### Prerequisites

```bash
Node.js 18+
pnpm (recommended)
Supabase account
Google Generative AI API key
VietQR-compatible bank account (optional, for online payments)
```

### Installation

```bash
cd tech-nova-store-planning
pnpm install
```

### Environment Setup

Create a `.env.local` file in the project root:

```env
# Supabase
NEXT_PUBLIC_SUPABASE_URL=https://your-project.supabase.co
NEXT_PUBLIC_SUPABASE_ANON_KEY=your-anon-key
SUPABASE_SERVICE_ROLE_KEY=your-service-role-key

# Google AI
GOOGLE_GENERATIVE_AI_API_KEY=your-google-ai-key

# Database (Supabase Postgres)
POSTGRES_URL=postgres://...
POSTGRES_PRISMA_URL=postgres://...

# VietQR (Optional - for online payments)
VIETQR_BANK_CODE=VCB
VIETQR_ACCOUNT_NO=your-account-number
VIETQR_ACCOUNT_NAME=YOUR_NAME

# Optional Dev Redirect
NEXT_PUBLIC_DEV_SUPABASE_REDIRECT_URL=http://localhost:3000/dashboard
```

### Database Setup

Run the SQL scripts in order in your Supabase SQL Editor:

```
scripts/001_create_tables.sql
scripts/002_enable_rls.sql
scripts/003_seed_data.sql      ← 8 sample products + categories
scripts/004_add_is_active.sql
```

### Development

```bash
pnpm dev    # localhost:3000
```

### Production Build

```bash
pnpm build
pnpm start
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
- **Custom Components**: Product cards, gallery, specs viewer, comparison table

## 🔒 Security & Performance

✅ **Row Level Security** (Supabase RLS)  
✅ **Server Components** (RSC/Next.js 16)  
✅ **Type Safety** (TypeScript + Zod)  
✅ **Image Optimization** (Next.js Image with WebP/AVIF)  
✅ **Bundle Analysis** (Vercel Analytics)  
✅ **SEO Optimized** (Metadata API)  
✅ **Cache Headers** (immutable assets)  
✅ **SWC Minification** enabled

## 📈 Admin Dashboard Features

1. **Products**: CRUD operations, image handling, categorization, deal/featured flags
2. **Categories**: Hierarchical management with parent/child support
3. **Orders**: Real-time tracking, status updates, payment status management
4. **Users**: Customer profiles and role management
5. **Settings**: Store name, contact info, maintenance mode, tax rate
6. **Analytics**: Revenue charts, top products, sales trends (Recharts)

## 🤖 AI Integration

**Chat Assistant** (`/api/chat`):

- Google Gemini model via Vercel AI SDK
- Context-aware product recommendations
- Natural language order tracking
- 24/7 customer support

## 💳 Payment Integration

### VietQR (Online Transfer)

- Generates dynamic QR codes for bank transfer
- Auto-polling for payment confirmation (5s intervals)
- Supports manual payment verification
- Copy-to-clipboard for amount + transfer content

### COD (Cash on Delivery)

- Order status set to `processing` immediately
- Cart cleared after successful order creation

## 🌍 Localization

- **Primary Language**: Vietnamese (`Tiếng Việt`)
- **Currency**: Vietnamese Dong (VND) with `lib/currency.ts` formatter
- **Date/Time**: `Asia/Ho_Chi_Minh` timezone
- **Structure Ready**: Easy to add i18n for multi-language support

## 🚨 Troubleshooting

### Supabase "fetch failed" (Development Network Issue)

**Symptoms:** Console shows `fetch failed` / fallback products

**Cause:** Dev server cannot connect to Supabase (firewall/proxy/DNS/SSL)

**Fixes:**

1. **Test connectivity:**

```bash
nslookup your-project.supabase.co
curl -H "apikey: YOUR_ANON_KEY" "https://your-project.supabase.co/rest/v1/products?select=count"
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

4. **Run SQL scripts** in Supabase Dashboard SQL Editor (see Database Setup above)

**Production:** Vercel → Supabase works perfectly.

### Other Common Issues

- **AI Chat 429:** Rate limit - upgrade Google AI quota or check API key
- **Admin 401:** Ensure `SUPABASE_SERVICE_ROLE_KEY` is set in `.env.local`
- **VietQR not loading:** Check `VIETQR_BANK_CODE`, `VIETQR_ACCOUNT_NO`, and `VIETQR_ACCOUNT_NAME` env vars
- **Build errors:** `pnpm install --frozen-lockfile`

## 🚀 Deployment

### Vercel (Recommended)

1. Push to GitHub
2. Connect repo in Vercel dashboard
3. Add environment variables (Supabase, Google AI, VietQR)
4. Deploy → Live in minutes

**Auto-deploys:** Git push triggers builds

### Environment Variables (Vercel)

```
NEXT_PUBLIC_SUPABASE_URL=https://your-project.supabase.co
NEXT_PUBLIC_SUPABASE_ANON_KEY=eyJhbGciOiJIUzI1Ni...
SUPABASE_SERVICE_ROLE_KEY=eyJhbGciOiJIUzI1Ni...
GOOGLE_GENERATIVE_AI_API_KEY=AIzaSy...
VIETQR_BANK_CODE=VCB
VIETQR_ACCOUNT_NO=...
VIETQR_ACCOUNT_NAME=...
```

### Docker (Self-Host)

```dockerfile
# Dockerfile.prod
FROM node:20-alpine
WORKDIR /app
COPY package.json pnpm-lock.yaml ./
RUN npm install -g pnpm && pnpm install --frozen-lockfile
COPY . .
RUN pnpm build
EXPOSE 3000
CMD ["pnpm", "start"]
```

## 📊 Performance & Monitoring

- **Vercel Analytics:** Enabled (`@vercel/analytics`)
- **Supabase Logs:** Dashboard → Reports
- **Console Logs:** Enhanced error reporting

## 📚 Development Workflow

```bash
pnpm install
# Run DB scripts in Supabase SQL Editor
pnpm dev      # localhost:3000
pnpm build    # Production build test
pnpm lint     # ESLint check
```

## 🎯 Future Enhancements

- [ ] Stripe payment integration (international cards)
- [ ] Multi-vendor marketplace
- [ ] Advanced search (Elasticsearch / Algolia)
- [ ] Email notifications (Resend / SendGrid)
- [ ] SMS notifications (Twilio)
- [ ] Real-time inventory alerts
- [ ] Product import/export (CSV/Excel)
- [ ] Multi-language i18n (English, Japanese, etc.)
- [ ] Loyalty points / referral system
- [ ] Product video support

---

**Tech Nova Store** - Production-ready Vietnamese e-commerce starter 🚀

_Updated: Full feature set documented, VietQR integration, complete admin dashboard, AI assistant (2025)_

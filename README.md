# 🦺 İşPool — Occupational Safety & Workwear E-Commerce Platform

<div align="center">

![Next.js](https://img.shields.io/badge/Next.js-16.1.1-black?style=for-the-badge&logo=next.js)
![React](https://img.shields.io/badge/React-19.2.3-61DAFB?style=for-the-badge&logo=react)
![TypeScript](https://img.shields.io/badge/TypeScript-5-3178C6?style=for-the-badge&logo=typescript)
![Prisma](https://img.shields.io/badge/Prisma-7.4.0-2D3748?style=for-the-badge&logo=prisma)
![PostgreSQL](https://img.shields.io/badge/PostgreSQL-16-4169E1?style=for-the-badge&logo=postgresql)
![Tailwind CSS](https://img.shields.io/badge/Tailwind_CSS-4-38B2AC?style=for-the-badge&logo=tailwind-css)
![License](https://img.shields.io/badge/License-MIT-green?style=for-the-badge)

**A full-stack e-commerce platform for occupational health & safety equipment, technical workwear, and personal protective equipment (PPE)**

[Features](#-features) • [Tech Stack](#️-technology-stack) • [Installation](#-installation) • [API](#-api-endpoints) • [Database](#️-database-schema) • [Deployment](#-deployment)

</div>

---

## 📋 About the Project

İşPool is a comprehensive digital commerce platform built for the occupational health and safety (OHS) industry. From high-visibility safety vests and flame-resistant coveralls to respiratory protection and ergonomic footwear, İşPool provides a categorized, searchable product catalog aligned with industrial standards.

The platform serves three distinct user groups: **customers** browsing and purchasing PPE, **administrators** managing the product catalog and operations, and **enterprise clients** seeking wholesale or custom-manufactured workwear. It is deployed on a VPS behind an Nginx reverse proxy using Docker.

---

## ✨ Features

### 🛍️ Customer Features

- **PPE & OHS Equipment Catalog** — Advanced filtering by industry, category, color, size, and brand
- **Product Detail Pages** — Specifications, stock status, variants, and price comparison
- **Custom Design Tool** — Canvas-based product customization with layers, text, and image overlays
- **Shopping Cart & Wishlist** — Persistent, session-aware cart and favorites
- **Secure Checkout** — Multi-step checkout with address management and iyzico payment integration
- **Installment Payment Options** — Credit card installments via iyzico (Axess, Bonus, Maximum, World, Paraf, BankKart)
- **Order Tracking** — Real-time cargo tracking (Horoz Kargo integration)
- **User Profile** — Order history, saved addresses, and account management
- **Blog & Content Pages** — Industry news, safety guides, and SEO-optimized articles
- **Newsletter Subscription** — Campaign and update notifications
- **Cookie Consent** — KVKK/GDPR compliant cookie management
- **Mobile-Responsive UI** — Fully responsive design with smooth animations

### 🔧 Admin Features

- **Admin Dashboard** — Sales analytics, order volume, and revenue charts
- **Product Management** — Create, edit, and delete products with variant support (color, size, stock)
- **Category Management** — Three-level category hierarchy (Category → Middle → Sub)
- **Order Management** — View, filter, and update order statuses
- **User Management** — Role-based user administration
- **Coupon & Discount Management** — Create and manage dynamic discount codes
- **Blog Management** — Publish, edit, and manage SEO-optimized blog posts
- **Banner & Hero Slider Management** — Visual content management for homepage
- **Subscriber Management** — Newsletter subscriber list

### 🏭 Enterprise Features

- **Wholesale Page** — Dedicated B2B catalog and inquiry flow
- **Special Production** — Custom OEM workwear request and design workflow
- **Background Removal Tool** — AI-powered product image background remover
- **Cloudinary Integration** — Optimized image upload, transformation, and CDN delivery

### ⚙️ Technical Features

- **Next.js App Router with SSR/SSG** — Optimized page loading and SEO
- **NextAuth.js Authentication** — Secure session management with JWT
- **Prisma ORM + PostgreSQL** — Type-safe relational database access
- **Zod Validation** — Schema-based input validation on all API routes
- **Nodemailer** — Transactional email notifications
- **React Hook Form** — Performant, accessible form management
- **Framer Motion** — Fluid UI animations and page transitions

---

## 🛠️ Technology Stack

### Frontend

| Technology | Version | Description |
|-----------|---------|-------------|
| Next.js | 16.1.1 | SSR & SSG, SEO optimization, App Router |
| React | 19.2.3 | Component-based UI architecture |
| TypeScript | 5 | Type-safe development |
| Tailwind CSS | 4 | Utility-first styling |
| Radix UI | 1.4.3 | Accessible, unstyled UI primitives |
| Framer Motion | 12.26.2 | Animations and transitions |
| Recharts | 2.15.4 | Admin analytics charts |
| Embla Carousel | 8.6.0 | Touch-friendly product carousels |
| React Hook Form | 7.71.1 | Form state management |
| Zod | 4.3.5 | Schema validation |
| React RnD | 10.5.2 | Draggable design canvas elements |
| Lucide React | 0.562.0 | Icon library |
| Sonner | 2.0.7 | Toast notifications |
| date-fns | 4.1.0 | Date formatting utilities |

### Backend & Database

| Technology | Version | Description |
|-----------|---------|-------------|
| Node.js | — | Server-side runtime |
| Prisma | 7.4.0 | ORM & database migrations |
| PostgreSQL | 8.16.3 | Relational database |
| NextAuth.js | 4.24.13 | Authentication & session management |
| bcrypt | 6.0.0 | Password hashing |
| Nodemailer | 7.0.12 | Email delivery |
| Cloudinary | 2.8.0 | Image upload, optimization & CDN |
| iyzipay | — | Payment gateway (iyzico) |

### Infrastructure & DevOps

| Technology | Description |
|-----------|-------------|
| Docker | Containerization |
| Nginx | Reverse proxy (production) |
| VPS | Production hosting |
| Cloudinary | CDN & image management |

---

## 🏗️ Architecture Overview

```
Browser / Client
       │
       ▼
  Nginx (Reverse Proxy)
       │
       ▼
  Next.js App (Docker)
  ┌────────────────────────────────────┐
  │  App Router (SSR / SSG / API)      │
  │  ├── /app/page.tsx  (Homepage)     │
  │  ├── /app/products/ (Catalog)      │
  │  ├── /app/admin/    (Admin Panel)  │
  │  └── /app/api/      (API Routes)   │
  │                                    │
  │  Contexts: Cart, Favorites         │
  │  Hooks: useMobile, session         │
  └────────────────────────────────────┘
       │                    │
       ▼                    ▼
  PostgreSQL           Cloudinary
  (via Prisma)         (Images / CDN)
                            │
                       iyzico (Payments)
                       Nodemailer (Email)
                       Horoz Kargo (Cargo)
```

---

## 📁 Project Structure

```
İşPool/
├── app/                              # Next.js App Router
│   ├── admin/                        # Admin panel pages
│   │   ├── dashboard/                # Analytics dashboard
│   │   ├── products/                 # Product CRUD (new, edit/[id])
│   │   ├── orders/                   # Order management
│   │   ├── users/                    # User management
│   │   ├── blogs/                    # Blog management
│   │   ├── color_size/               # Color & size management
│   │   ├── coupon/                   # Coupon management
│   │   ├── home_settings/            # Banner & hero slider settings
│   │   └── subscribers/              # Newsletter subscribers
│   ├── api/                          # API route handlers
│   │   ├── auth/                     # NextAuth & logout
│   │   ├── account/                  # Register, forgot/reset password
│   │   ├── products/                 # Product CRUD & category filtering
│   │   ├── category/                 # 3-level category API
│   │   ├── cart/                     # Cart management
│   │   ├── order/                    # Order creation & user orders
│   │   ├── favorites/                # Wishlist
│   │   ├── payment/                  # iyzico payment gateway
│   │   ├── coupon/                   # Coupon validation
│   │   ├── review/                   # Product reviews
│   │   ├── blog/                     # Blog CRUD
│   │   ├── banner/                   # Banner management
│   │   ├── hero-slides/              # Hero slider management
│   │   ├── color/ & size/            # Color & size management
│   │   ├── address/                  # User address management
│   │   ├── cargo-tracking/           # Horoz Kargo tracking
│   │   ├── cloudinary-signature/     # Signed uploads
│   │   ├── remove-bg/                # Background removal
│   │   ├── send-mail/                # Transactional email
│   │   ├── subscribe/                # Newsletter subscriptions
│   │   ├── upload/                   # File upload handler
│   │   ├── user/                     # User profile & admin user list
│   │   └── location/                 # Districts & neighborhoods API
│   ├── auth/                         # Login, register, forgot/reset password
│   ├── cart/                         # Shopping cart page
│   ├── checkout/                     # Multi-step checkout (success, unsuccess)
│   ├── products/                     # Product listing & detail pages
│   │   ├── [id]/                     # Product detail
│   │   ├── category/[id]/[midId]/[subId]/ # Category-filtered listing
│   │   ├── special_production/       # Custom manufacturing page
│   │   └── wholesale/                # B2B wholesale page
│   ├── profile/                      # User profile, orders, addresses, tracking
│   ├── favorites/                    # Wishlist page
│   ├── institutional/                # About, blog, career, partners, why us
│   ├── help/                         # FAQ, KVKK, contact, returns, printing
│   └── customer/                     # Legal pages (terms, privacy, returns)
│
├── components/
│   ├── layout/                       # Navbar, footer, topbar, pagination
│   ├── modules/
│   │   ├── admin/                    # Admin panel UI modules
│   │   ├── auth/                     # Auth forms
│   │   ├── cart/                     # Cart items and summary
│   │   ├── checkout/                 # Payment stepper, address & payment steps
│   │   ├── home/                     # Hero slider, banners, categories, bestsellers
│   │   ├── navbar/                   # Cart dropdown, category bar, mega menu
│   │   ├── products/                 # Product cards, filters, design tool
│   │   │   └── productDetail/design/ # Canvas-based design tool (layers, toolbar)
│   │   ├── favorites/                # Wishlist product cards
│   │   ├── profile/                  # Orders, addresses, cargo tracking
│   │   └── footer/                   # Help, institutional, legal pages
│   └── ui/                           # Radix-based UI primitives (50+ components)
│
├── contexts/
│   ├── cartContext.tsx                # Global cart state
│   └── favoriteContext.tsx            # Global favorites state
│
├── lib/
│   ├── auth.ts                        # NextAuth configuration
│   ├── db.ts                          # Prisma client instance
│   ├── session.ts                     # Session helpers
│   ├── cargo-utils.ts                 # Cargo tracking utilities
│   ├── uploadToCloudinary.ts          # Cloudinary upload helper
│   └── utils.ts                       # General utility functions
│
├── prisma/
│   ├── schema.prisma                  # Database schema
│   ├── seed.ts                        # Database seed data
│   └── migrations/                    # Migration history
│
├── types/                             # TypeScript type definitions
│   ├── product.ts
│   ├── order.ts
│   ├── horoz-cargo.ts
│   └── *.d.ts                         # Module augmentations
│
├── hooks/
│   └── use-mobile.ts                  # Mobile breakpoint hook
│
├── utils/
│   └── cart.ts                        # Cart calculation utilities
│
└── public/                            # Static assets
    ├── about/, banner/, brands/       # Marketing images
    ├── cards/                         # Payment card logos (SVG)
    ├── categories/, categoryIcons/    # Category visuals
    ├── heroes/                        # Hero slider images (AVIF)
    ├── iyzico/                        # Payment branding
    ├── products/, special_production/ # Product images
    └── city.json                      # Turkish city/district data
```

---

## 🗄️ Database Schema

### Core Models

```
User                → User accounts (name, email, hashed password, role)
Product             → Product catalog (title, price, description, images)
Category            → Top-level categories
MiddleCategory      → Mid-level categories (linked to Category)
SubCategory         → Sub-level categories (linked to MiddleCategory)
Brand               → Product brands
Color               → Color variants
Size                → Size variants
ProductStock        → Stock per product-color-size combination
ProductSize         → Size assignments per product

Order               → Customer orders (status, total, cargo info)
OrderItem           → Line items within an order
OrderAddress        → Snapshot of delivery address at time of order

CartItem            → Items in user's active cart
Favorite            → User wishlist items
Review              → Product reviews (rating, comment)

Blog                → Blog posts (title, content, slug, SEO fields)
Coupon              → Discount codes (type, amount, usage limits)
Banner              → Homepage banners (image, link, position)
HeroSlide           → Hero slider slides (image, title, CTA)
Subscribe           → Newsletter subscribers
Address             → Saved user delivery addresses
```

### Key Relationships

- Products belong to a SubCategory → MiddleCategory → Category chain
- ProductStock links Product + Color + Size for per-variant inventory
- Orders snapshot the delivery address independently of the user's saved addresses
- Reviews are linked to both a Product and the reviewing User
- Coupons track individual usage per User to enforce per-user limits

---

## 🚀 Installation

### Prerequisites

- Node.js **18+**
- PostgreSQL **13+**
- npm or yarn
- Cloudinary account *(for image uploads)*
- iyzico account *(for payment processing)*

---

### 1. Clone the Repository

```bash
git clone https://github.com/your-username/ispool.git
cd ispool
```

---

### 2. Install Dependencies

```bash
npm install
```

---

### 3. Configure Environment Variables

Create a `.env.local` file in the project root:

```env
# Database
DATABASE_URL="postgresql://username:password@localhost:5432/ispool"
POSTGRES_URL="postgresql://username:password@localhost:5432/ispool"

# NextAuth
NEXTAUTH_SECRET="your-nextauth-secret-min-32-chars"
NEXTAUTH_URL="http://localhost:3000"

# Cloudinary
CLOUDINARY_CLOUD_NAME="your-cloud-name"
CLOUDINARY_API_KEY="your-api-key"
CLOUDINARY_API_SECRET="your-api-secret"

# Email (Gmail SMTP)
EMAIL_USER="your-email@gmail.com"
EMAIL_PASS="your-gmail-app-password"

# iyzico Payment Gateway
IYZICO_API_KEY="your-iyzico-api-key"
IYZICO_SECRET_KEY="your-iyzico-secret-key"
IYZICO_BASE_URL="https://sandbox-api.iyzipay.com"   # Use production URL for live

# App
NEXT_PUBLIC_BASE_URL="http://localhost:3000"
```

---

### 4. Set Up the Database

```bash
# Run migrations
npx prisma migrate dev

# Seed initial data
npm run seed

# Generate Prisma client
npx prisma generate
```

---

### 5. Start the Development Server

```bash
npm run dev
```

Open [http://localhost:3000](http://localhost:3000) in your browser.

---

### Production Build

```bash
npm run build
npm start
```

> **Note:** The `build` script resets and re-seeds the database. For production, use `next build` directly after running migrations separately.

---

## 🔌 API Endpoints

### Base URL
```
http://localhost:3000/api
```

### 🔐 Authentication

| Method | Endpoint | Description |
|--------|----------|-------------|
| POST | `/api/auth/[...nextauth]` | NextAuth handler (login, session) |
| POST | `/api/auth/logout` | Clear session and logout |
| POST | `/api/account/register` | Register new user |
| POST | `/api/account/forgot_password` | Send password reset email |
| POST | `/api/account/reset_password` | Reset password with token |
| GET | `/api/account/check` | Check if email is already registered |

### 📦 Products

| Method | Endpoint | Description |
|--------|----------|-------------|
| GET | `/api/products` | List all products (with filters) |
| POST | `/api/products` | Create product (Admin) |
| GET | `/api/products/[id]` | Get product detail |
| PUT | `/api/products/[id]` | Update product (Admin) |
| DELETE | `/api/products/[id]` | Delete product (Admin) |
| GET | `/api/products/category/[id]/[midId]/[subId]` | Products by category |

### 🗂️ Categories

| Method | Endpoint | Description |
|--------|----------|-------------|
| GET | `/api/category` | List top-level categories |
| POST | `/api/category` | Create category (Admin) |
| GET | `/api/category/[id]` | Get category detail |
| GET | `/api/category/[id]/[midId]` | Get middle category |
| GET | `/api/category/[id]/[midId]/[subId]` | Get sub-category |

### 🛒 Cart

| Method | Endpoint | Description |
|--------|----------|-------------|
| GET | `/api/cart` | Get user's cart |
| POST | `/api/cart` | Add item to cart |
| PUT | `/api/cart/[id]` | Update cart item quantity |
| DELETE | `/api/cart/[id]` | Remove item from cart |

### 📋 Orders

| Method | Endpoint | Description |
|--------|----------|-------------|
| POST | `/api/order` | Create new order |
| GET | `/api/order/user` | Get current user's orders |

### 💳 Payment

| Method | Endpoint | Description |
|--------|----------|-------------|
| POST | `/api/payment` | Initiate iyzico payment |

### 🏷️ Coupons

| Method | Endpoint | Description |
|--------|----------|-------------|
| GET | `/api/coupon` | List coupons (Admin) |
| POST | `/api/coupon` | Create coupon (Admin) |
| POST | `/api/coupon/validate` | Validate coupon code |

### ❤️ Favorites

| Method | Endpoint | Description |
|--------|----------|-------------|
| GET | `/api/favorites` | Get user's favorites |
| POST | `/api/favorites` | Add to favorites |
| DELETE | `/api/favorites/[id]` | Remove from favorites |

### ⭐ Reviews

| Method | Endpoint | Description |
|--------|----------|-------------|
| GET | `/api/review` | List reviews |
| POST | `/api/review` | Submit review |
| DELETE | `/api/review/[id]` | Delete review (Admin/Owner) |

### 📝 Blogs

| Method | Endpoint | Description |
|--------|----------|-------------|
| GET | `/api/blog` | List blog posts |
| POST | `/api/blog` | Create post (Admin) |
| PUT | `/api/blog/[id]` | Update post (Admin) |
| DELETE | `/api/blog/[id]` | Delete post (Admin) |

### 🖼️ Banners & Hero Slides

| Method | Endpoint | Description |
|--------|----------|-------------|
| GET | `/api/banner` | List banners |
| POST | `/api/banner` | Create banner (Admin) |
| PUT | `/api/banner/[id]` | Update banner (Admin) |
| DELETE | `/api/banner/[id]` | Delete banner (Admin) |
| GET | `/api/hero-slides` | List hero slides |
| POST | `/api/hero-slides` | Create slide (Admin) |
| PUT | `/api/hero-slides/[id]` | Update slide (Admin) |
| DELETE | `/api/hero-slides/[id]` | Delete slide (Admin) |

### 📍 Addresses & Location

| Method | Endpoint | Description |
|--------|----------|-------------|
| GET | `/api/address` | Get user's addresses |
| POST | `/api/address` | Add new address |
| PUT | `/api/address/[id]` | Update address |
| DELETE | `/api/address/[id]` | Delete address |
| GET | `/api/location/ilceler/[ilId]` | Get districts by province |
| GET | `/api/location/mahalleler/[ilceId]` | Get neighborhoods by district |

### 🚚 Cargo & Utilities

| Method | Endpoint | Description |
|--------|----------|-------------|
| GET | `/api/cargo-tracking` | Track cargo by reference number |
| POST | `/api/send-mail` | Send transactional email |
| POST | `/api/upload` | Upload file to Cloudinary |
| GET | `/api/cloudinary-signature` | Get signed upload credentials |
| POST | `/api/remove-bg` | Remove image background |
| POST | `/api/subscribe` | Subscribe to newsletter |

---

## 💳 Payment Integration — iyzico

İşPool uses [iyzico](https://iyzico.com) as its payment gateway, enabling secure credit card payments and installment options for major Turkish bank cards.

### Supported Cards

| Card | Issuer |
|------|--------|
| Axess | Akbank |
| Bonus | Garanti BBVA |
| Maximum | İş Bankası |
| World | Yapı Kredi |
| Paraf | Halkbank |
| BankKart Combo | Ziraat Bankası |

### Payment Flow

1. User fills in cart and proceeds to checkout
2. Address step: select or add delivery address
3. Payment step: enter card details (handled by iyzico's secure form)
4. iyzico processes payment and returns callback
5. On success → order is created, user is redirected to `/checkout/success`
6. On failure → user is redirected to `/checkout/unsuccess`

> **Sandbox Testing:** Set `IYZICO_BASE_URL=https://sandbox-api.iyzipay.com` and use iyzico's test card numbers during development.

---

## 🎨 Product Design Tool

İşPool includes a canvas-based product customization tool for special production orders, allowing users to:

- Add and position text layers with font and color controls
- Upload and place image overlays on product templates
- Manage layers (reorder, toggle visibility, delete)
- Export the final design as an image for order submission

The design tool is built with `react-rnd` for drag-and-resize, `html-to-image` for export, and a custom layer management system.

---

## 🔐 Security

- **NextAuth.js** session management with JWT tokens stored in HttpOnly cookies
- **bcrypt** password hashing (salt rounds: 12)
- **Zod** schema validation on all API route inputs
- **Role-based access control** — admin routes protected by session role check
- **Cloudinary signed uploads** — server-generated signatures prevent unauthorized uploads
- **KVKK / GDPR compliance** — cookie consent banner with granular controls
- **Environment variable isolation** — all secrets stored in `.env.local`, never committed

---

## 🚚 Cargo Tracking — Horoz Kargo

İşPool integrates with Horoz Kargo for shipment tracking. After an order is dispatched, users can track their cargo from the profile panel at `/profile/cargo_tracking`.

The integration uses a reference number returned at order creation to query real-time shipment status from the Horoz Kargo API.

---

## 🧪 Development Tools

### Database Management

```bash
# Create a new migration
npx prisma migrate dev --name describe-your-change

# Open Prisma Studio (visual DB editor)
npx prisma studio

# Seed the database
npm run seed

# Reset and re-seed (destructive)
npx prisma migrate reset
```

### Code Quality

- **TypeScript** — strict mode enabled for full type safety
- **ESLint** — Next.js recommended ruleset
- **PostCSS** — CSS processing pipeline for Tailwind v4

---

## 🚀 Deployment

The project is containerized with Docker and deployed on a VPS behind an Nginx reverse proxy.

### Docker

```bash
# Build the image
docker build -t ispool .

# Run the container
docker run -p 3000:3000 --env-file .env ispool
```

### Nginx Reverse Proxy (Production)

```nginx
server {
    listen 80;
    server_name yourdomain.com;

    location / {
        proxy_pass http://localhost:3000;
        proxy_http_version 1.1;
        proxy_set_header Upgrade $http_upgrade;
        proxy_set_header Connection 'upgrade';
        proxy_set_header Host $host;
        proxy_cache_bypass $http_upgrade;
    }
}
```

### Production Checklist

- Move all `.env.local` secrets to server environment variables
- Switch iyzico URL to `https://api.iyzipay.com` (production)
- Update `NEXTAUTH_URL` to your production domain
- Enable Cloudinary production environment
- Set `NODE_ENV=production`
- Remove `EnsureDeleted` / `migrate reset` from the build script
- Configure SSL via Let's Encrypt (Certbot)

---

## 🤝 Contributing

1. **Fork** this repository
2. Create a feature branch:
   ```bash
   git checkout -b feature/AmazingFeature
   ```
3. Commit your changes:
   ```bash
   git commit -m 'feat: add AmazingFeature'
   ```
4. Push your branch:
   ```bash
   git push origin feature/AmazingFeature
   ```
5. Open a **Pull Request**

### Code Standards

- Use **TypeScript** — avoid `any` types
- Keep components **modular and single-responsibility**
- Type all API responses
- Write descriptive commit messages following [Conventional Commits](https://www.conventionalcommits.org/)

---

## 📄 License

This project is licensed under the **MIT License**.

---

<div align="center">

*İşPool — Safe equipment for safer workplaces.* 🏭

</div>
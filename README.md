# İşPool — Occupational Safety & Workwear E-Commerce Platform

## Overview

İşPool is a Next.js (App Router) e-commerce application for occupational health & safety (OHS) equipment, technical workwear, and PPE. It includes a customer-facing storefront (catalog, cart, checkout, iyzico payments, order tracking, reviews, favorites, blog) and an admin panel (`/admin`) for managing products, categories, orders, users, coupons, banners/hero slides, blog posts, and newsletter subscribers.

This README documents only what is verifiable in the source code as of this audit. Anything that could not be confirmed is called out explicitly rather than assumed.

---

## Features

Verified from `app/`, `components/`, `lib/`, and `prisma/schema.prisma`:

### Customer-facing

- Product catalog with a three-level category hierarchy (`Category → MiddleCategory → SubCategory`), brand, color, and size filtering
- Product detail pages with stock per color/size variant (`ProductStock`, `ProductSize`)
- Product search (`app/api/search/route.ts`)
- Shopping cart, persisted server-side per logged-in user via `CartItem` (see `app/api/cart`)
- Favorites/wishlist (`app/api/favorites`, `Favorite` model)
- Product reviews and ratings (`Review` model, `app/api/review`)
- Multi-step checkout with iyzico payment integration, including installment pricing (`lib/iyzico.ts`)
- Coupon/discount code validation at checkout (`Coupon` model, `app/api/coupon/validate`)
- Order history and cargo tracking via Horoz Kargo (`lib/cargo-utils.ts`, `types/horoz-cargo.ts`, `app/api/cargo-tracking`)
- User addresses (`Address` model, `app/api/address`)
- Blog / content pages (`Blog` model, `app/api/blog`)
- Newsletter subscription (`Subscribe` model, `app/api/subscribe`)
- Dedicated wholesale (`/products/wholesale`) and special/custom production (`/products/special_production`) pages
- Background-removal tool for product images, calling the third-party **remove.bg** API (`app/api/remove-bg/route.ts`) — this is a hosted API call, not a local/ffmpeg-based process
- Account registration, login, and forgot/reset password flows (NextAuth Credentials provider)

### Admin panel (`/admin`, role-gated)

- Dashboard (`app/admin/dashboard`)
- Product CRUD with color/size/stock variants (`app/admin/products`)
- Category/middle-category/sub-category, color, and size management (`app/admin/color_size`, `app/api/category`, `app/api/color`, `app/api/size`)
- Order management (`app/admin/orders`, `app/api/order`)
- User management, including admin listing/deletion of users (`app/admin/users`, `app/api/user/all`)
- Coupon management (`app/admin/coupon`)
- Blog management (`app/admin/blogs`)
- Banner and hero-slide management (`app/admin/home_settings`, `Banner`/`HeroSlide` models)
- Newsletter subscriber list (`app/admin/subscribers`)

### Not confirmed as an active feature

- **`@ffmpeg-installer/ffmpeg`** and **`fluent-ffmpeg`** are listed as dependencies in `package.json`, but no import of either package was found anywhere in `app/`, `components/`, `lib/`, `hooks/`, `utils/`, or `prisma/`. Video handling that *is* wired up (the `product.videoUrl` field and product video uploads) goes through Cloudinary's own video upload/transformation (`lib/uploadToCloudinary.ts`, `app/api/cloudinary-signature`), not ffmpeg. Treat ffmpeg as an unused/leftover dependency unless further code is found that invokes it.
- **`@prisma/extension-accelerate`** is a dependency, but `lib/db.ts` does not call `.$extends(withAccelerate())` or otherwise apply it. The Prisma Client is used with `@prisma/adapter-pg` only (see Database section below).

---

## Technology Stack

### Frontend

| Technology | Version (package.json) | Notes |
|---|---|---|
| Next.js | 16.1.1 | App Router |
| React | 19.2.3 | |
| TypeScript | ^5 | strict mode enabled |
| Tailwind CSS | ^4 | via `@tailwindcss/postcss` |
| Radix UI (`radix-ui` + individual `@radix-ui/react-*` packages) | 1.4.3 | primitives behind `components/ui` |
| shadcn-style component setup | — | configured via `components.json` (style: "new-york") |
| React Hook Form | ^7.71.1 | with `@hookform/resolvers` |
| Zod | ^4.3.5 | schema validation |
| Framer Motion / `motion` | ^12.26.2 | |
| Recharts | ^2.15.4 | admin dashboard charts |
| Embla Carousel | ^8.6.0 | |
| react-rnd | ^10.5.2 | drag/resize (design tool) |
| html-to-image / html2canvas | ^1.11.13 / ^1.4.1 | client-side image export |
| Sonner | ^2.0.7 | toasts |
| date-fns | ^4.1.0 | |

### Backend & Data

| Technology | Version | Notes |
|---|---|---|
| Prisma ORM | ^7.4.1 (`prisma` CLI), `@prisma/client` ^7.4.1 | schema in `prisma/schema.prisma`, client generated to `generated/prisma` |
| `@prisma/adapter-pg` | ^7.3.0 | driver adapter used to connect Prisma Client to Postgres via `pg` |
| `pg` | ^8.16.3 | Node Postgres driver used by the adapter |
| `@prisma/extension-accelerate` | ^3.0.1 | dependency present, **not applied** in `lib/db.ts` (see Database section) |
| PostgreSQL | — | `datasource db { provider = "postgresql" }` |
| NextAuth.js | ^4.24.13 | Credentials provider, JWT sessions |
| bcrypt | ^6.0.0 | password hashing |
| Nodemailer | ^7.0.12 | transactional email (`lib/mailer.ts`) |
| Cloudinary | ^2.8.0 | image/video upload & CDN |
| iyzipay ecosystem | custom `lib/iyzico.ts` | no `iyzipay` npm SDK dependency was found in `package.json`; the integration is a hand-written signed HTTPS client |

### Tooling

| Technology | Notes |
|---|---|
| ESLint | Next.js config |
| PostCSS | Tailwind v4 pipeline |
| tsx | runs `prisma/seed.ts` and `prisma/syncCatalog.ts` |

---

## Architecture

- **Framework**: Next.js App Router. Routes live under `app/`, with API route handlers under `app/api/**/route.ts`.
- **Auth/route protection**: `proxy.ts` at the project root implements `withAuth` (NextAuth middleware). In Next.js 16 this file replaces the older `middleware.ts` convention. It matches `/admin/:path*`, `/profile/:path*`, `/checkout/:path*`, `/favorites/:path*`, and `/api/admin/:path*`, redirecting unauthenticated users to `/auth/login` and requiring the `ADMIN` role for admin sub-pages (the `/admin` root itself renders its own login screen).
- **Database access**: a single Prisma Client instance (`lib/db.ts`) is instantiated with the `@prisma/adapter-pg` driver adapter over a `pg` connection pool, using `DATABASE_URL`. No Prisma Accelerate/edge client wrapping was found in the code.
- **State**: client-side global state is limited to `contexts/favoriteContext.tsx` (`FavoriteProvider`, tracks favorite product IDs and syncs with the session). No cart context/provider exists in `contexts/` — cart state is read and mutated through `app/api/cart` route handlers and consumed directly by cart-related components (`components/modules/cart/*`, `components/modules/navbar/cartDropdown.tsx`).
- **Server-to-server calls**: `lib/internalAuth.ts` defines a shared-secret header (`x-internal-secret`, derived from `NEXTAUTH_SECRET`) so one route handler can call another (e.g. order creation calling payment/mail) without relying on browser cookies.
- **Rate limiting**: `lib/rate-limit.ts` is an in-memory, per-process token-bucket-style limiter (a plain `Map`). It is applied to at least the `remove-bg` endpoint. Being in-memory, it resets on every server restart/redeploy and is not shared across multiple server instances.
- **Payments**: `lib/iyzico.ts` builds iyzico's `IYZWSv2` HMAC-signed authorization header by hand and calls the iyzico REST API directly with `fetch` (base URL from `IYZICO_BASE_URL`, defaulting to the sandbox endpoint).
- **Images/video**: uploads go through `app/api/cloudinary-signature` (server generates a signed upload) and `lib/uploadToCloudinary.ts` (client uploads directly to Cloudinary, bypassing the Next.js server body-size limit). Product records can store a `videoUrl` and a `showVideo` flag.

```
Browser
   │
   ▼
proxy.ts (NextAuth middleware — route/role gating)
   │
   ▼
Next.js App Router
 ├── app/*                 (SSR/SSG pages)
 ├── app/admin/*            (role-gated admin UI)
 └── app/api/**/route.ts    (API route handlers)
        │
        ├── Prisma Client (@prisma/adapter-pg) ──► PostgreSQL
        ├── Cloudinary (signed direct upload)   ──► image/video CDN
        ├── iyzico REST API (HMAC-signed)        ──► payments
        ├── Horoz Kargo API                       ──► cargo tracking
        ├── remove.bg REST API                    ──► background removal
        └── Nodemailer (SMTP)                     ──► transactional email
```

---

## Folder Structure

```
İşPool/
├── app/
│   ├── admin/            # Role-gated admin panel (dashboard, products, orders, users,
│   │                      #  blogs, color_size, coupon, home_settings, subscribers)
│   ├── api/               # Route handlers — see API section below
│   ├── auth/              # login, register, forgot-password, reset-password
│   ├── cart/, checkout/   # Cart page; multi-step checkout (success/unsuccess)
│   ├── products/          # Listing, [id] detail, category/, special_production/, wholesale/
│   ├── profile/           # Orders, addresses, cargo_tracking
│   ├── favorites/
│   ├── institutional/     # about, blog, career, cookie_policy, partners, quality, why_us
│   ├── help/               # bank-info, contact, distance-sales, faq, kvkk, printing, returns-help
│   └── customer/           # bank-details, privacy, returns, sales-agreement, terms
├── components/
│   ├── layout/             # navbar, footer, topbar, pagination
│   ├── modules/             # admin, auth, cart, checkout, home, navbar, products
│   │   │                     #  (incl. products/productDetail/design — the canvas design tool),
│   │   │                     #  favorites, profile, footer
│   └── ui/                  # Radix/shadcn-style primitives (53 files)
├── contexts/
│   └── favoriteContext.tsx  # FavoriteProvider — the only React context in the app
├── lib/
│   ├── auth.ts               # NextAuth authOptions (Credentials provider, JWT)
│   ├── db.ts                 # Prisma Client instance (adapter-pg)
│   ├── session.ts
│   ├── cargo-utils.ts         # Horoz Kargo helpers
│   ├── iyzico.ts               # iyzico signed-request client + pricing
│   ├── pricing.ts               # shipping fee calculation
│   ├── mailer.ts                 # Nodemailer transport
│   ├── internalAuth.ts            # server-to-server shared-secret header
│   ├── rate-limit.ts               # in-memory rate limiter
│   ├── sanitize.ts
│   ├── uploadToCloudinary.ts        # signed direct-to-Cloudinary upload
│   └── utils.ts
├── prisma/
│   ├── schema.prisma        # database schema (see Database section)
│   ├── seed.ts               # database seed script
│   ├── syncCatalog.ts         # idempotent size/brand sync script (see Available Scripts)
│   └── migrations/
├── data/                     # JSON fixtures consumed by prisma/seed.ts
│   ├── products.json, categories.json, middleCategories.json, subCategories.json
├── types/                    # product.ts, order.ts, horoz-cargo.ts, module augmentations
├── hooks/
│   └── use-mobile.ts
├── utils/
│   ├── cart.ts
│   └── mergeGuestData.ts
├── generated/prisma/          # Prisma Client output (generator output = "../generated/prisma")
├── proxy.ts                    # Next.js 16 middleware/proxy — auth route gating
└── public/                      # about/, banner/, brands/, cards/, categories/, categoryIcons/,
                                   #  heroes/, iyzico/, logo/, megaMenu/, products/, socialMedia/,
                                   #  special_production/, wholesale/, why_us/, city.json, og-image.png
```

---

## Installation

### Prerequisites

- Node.js and npm
- A PostgreSQL database (local or hosted)
- Accounts/API keys for the third-party services used by the app (Cloudinary, iyzico, remove.bg, Horoz Kargo, an SMTP mail account) if you need those features to work

### 1. Install dependencies

```bash
npm install
```

`postinstall` automatically runs `prisma generate`.

### 2. Configure environment variables

Create a `.env` and/or `.env.local` file (both exist in this project; `.env.local` takes precedence in Next.js) with the variables listed in **Environment Variables** below. No `.env.example` file exists in the repository — variable names below were read directly from the existing `.env`/`.env.local` files present in the project (values are not reproduced here).

### 3. Set up the database

```bash
npx prisma migrate dev   # apply/create migrations against your database
npm run seed              # populate initial catalog/admin data
```

### 4. Run the development server

```bash
npm run dev
```

Open http://localhost:3000.

---

## Environment Variables

Names and inferred purpose only, based on the keys present in `.env` / `.env.local` and their usage in code. **No values are reproduced here.** Set your own values locally; never commit real secrets.

| Variable | Purpose |
|---|---|
| `DATABASE_URL` | PostgreSQL connection string used by Prisma (`lib/db.ts`, `prisma.config.ts`) |
| `POSTGRES_URL` | Alternate Postgres connection string; `prisma/seed.ts` and `prisma/syncCatalog.ts` fall back to `DATABASE_URL` if this isn't set |
| `PRISMA_DATABASE_URL` | Present in `.env.local` (Vercel-provisioned Postgres); not referenced directly in the application code reviewed |
| `NEXTAUTH_SECRET` | NextAuth JWT signing secret (`lib/auth.ts`); also reused as the server-to-server shared secret in `lib/internalAuth.ts` |
| `NEXTAUTH_URL` | Referenced by NextAuth's server-side URL resolution (present in `.env`, not directly read elsewhere in code reviewed) |
| `NEXT_PUBLIC_BASE_URL` | Public base URL of the app |
| `ADMIN_NAME`, `ADMIN_SURNAME`, `ADMIN_EMAIL`, `ADMIN_PASSWORD` | Used to seed an initial admin `User` (referenced by `prisma/seed.ts`) |
| `EMAIL_HOST`, `EMAIL_PORT`, `EMAIL_USER`, `EMAIL_PASS` | SMTP credentials for Nodemailer (`lib/mailer.ts`) |
| `CLOUD_NAME`, `API_KEY`, `API_SECRET` | Cloudinary credentials (server-side signing in `app/api/cloudinary-signature`) |
| `IYZICO_API_KEY`, `IYZICO_SECRET_KEY` | iyzico payment gateway credentials (`lib/iyzico.ts`) |
| `IYZICO_BASE_URL` | iyzico API base URL; defaults to `https://sandbox-api.iyzipay.com` if unset |
| `HOROZ_API_BASE_URL`, `HOROZ_PROCESS_KEY` | Horoz Kargo cargo-tracking API credentials |
| `REMOVE_BG_API_KEY` | remove.bg API key (`app/api/remove-bg/route.ts`) |
| `VERCEL_OIDC_TOKEN` | Present in `.env.local`, auto-generated by the Vercel CLI; not application-level configuration |

> Note: the reviewed `.env` file also contained a couple of unlabeled stray value lines with no variable name attached. These were not documented here since their purpose could not be verified; if they are unused, consider removing them from the file.

---

## Available Scripts

All scripts are exactly as defined in `package.json`:

| Script | Command | Behavior |
|---|---|---|
| `dev` | `next dev` | Starts the Next.js development server |
| `build` | `prisma generate && next build` | Regenerates the Prisma Client, then builds the production Next.js app. Does **not** touch the database. |
| `build:fresh` | `prisma migrate reset --force && prisma db push --force-reset && prisma generate && npm run seed && next build` | **DESTRUCTIVE.** `prisma migrate reset --force` drops and recreates the entire database, then `prisma db push --force-reset` force-resets it again, before regenerating the client, reseeding, and building. **This wipes all data in whatever database `DATABASE_URL` points to. Never run this against a production or shared database.** See Troubleshooting below. |
| `start` | `next start` | Starts the built app in production mode (requires `npm run build` first) |
| `seed` | `npx tsx prisma/seed.ts` | Populates the database from the JSON fixtures in `data/` (products, categories, middle/sub categories) and creates an admin user from the `ADMIN_*` env vars. Not idempotent by design for reseeding purposes — intended to run against an empty/fresh schema. |
| `sync-catalog` | `npx tsx prisma/syncCatalog.ts` | Idempotently adds new `Size` values (5XL–8XL, plus numeric pants sizes 66/68/70/72) and new `Brand` records ("Bmes", "Pars", "İş Pool") using `skipDuplicates: true`. Per its own header comment, it does **not** reset the database — safe to run against an existing, populated database. |
| `postinstall` | `prisma generate` | Runs automatically after `npm install` to generate the Prisma Client into `generated/prisma` |

---

## Development

```bash
npm run dev
```

Useful Prisma commands during development (not `package.json` scripts, but standard Prisma CLI usage against `prisma/schema.prisma`):

```bash
npx prisma studio            # visual database browser
npx prisma migrate dev        # create/apply a migration in development
```

---

## Build

```bash
npm run build
npm start
```

Do **not** use `npm run build:fresh` for a normal build — see the destructive-script warning above and in Troubleshooting.

---

## API

Endpoints below were confirmed by reading the exported HTTP method handlers in each `app/api/**/route.ts` file. "Auth" reflects what each handler actually checks (session/role), not assumptions.

### Auth & Account

| Method | Path | Purpose |
|---|---|---|
| GET, POST | `/api/auth/[...nextauth]` | NextAuth handler (Credentials login, session, logout via NextAuth's own endpoints) |
| POST | `/api/auth/logout` | Application-specific logout endpoint |
| POST | `/api/account/register` | Register a new user |
| GET | `/api/account/check` | Check whether an email is already registered |
| POST | `/api/account/forgot_password` | Send a password-reset email |
| POST | `/api/account/reset_password` | Reset password using a reset token |

### Products, Categories, Brands, Colors, Sizes

| Method | Path | Purpose |
|---|---|---|
| GET | `/api/products` | List products (supports filters) |
| POST | `/api/products` | Create a product |
| GET | `/api/products/[id]` | Get a product |
| PUT | `/api/products/[id]` | Update a product |
| DELETE | `/api/products/[id]` | Delete a product |
| GET | `/api/products/category/[id]` | Products by top-level category |
| GET | `/api/products/category/[id]/[midId]` | Products by middle category |
| GET | `/api/products/category/[id]/[midId]/[subId]` | Products by sub-category |
| GET | `/api/search` | Product search |
| GET | `/api/category` | List categories |
| GET | `/api/category/[id]` | Get a category |
| GET | `/api/category/[id]/[midId]` | Get a middle category |
| GET | `/api/category/[id]/[midId]/[subId]` | Get a sub-category |
| GET | `/api/brand` | List brands |
| POST | `/api/brand` | Create a brand |
| GET | `/api/brand/[id]` | Get a brand |
| PATCH | `/api/brand/[id]` | Update a brand |
| DELETE | `/api/brand/[id]` | Delete a brand |
| GET | `/api/color` | List colors |
| POST | `/api/color` | Create a color |
| GET | `/api/color/[id]` | Get a color |
| PATCH | `/api/color/[id]` | Update a color |
| DELETE | `/api/color/[id]` | Delete a color |
| GET | `/api/size` | List sizes |
| POST | `/api/size` | Create a size |
| GET | `/api/size/[id]` | Get a size |
| PATCH | `/api/size/[id]` | Update a size |
| DELETE | `/api/size/[id]` | Delete a size |

### Cart, Favorites, Reviews

| Method | Path | Purpose |
|---|---|---|
| GET | `/api/cart` | Get current user's cart |
| POST | `/api/cart` | Add an item to the cart |
| PATCH | `/api/cart/[id]` | Update a cart item |
| DELETE | `/api/cart/[id]` | Remove a cart item |
| GET | `/api/favorites` | Get current user's favorites |
| POST | `/api/favorites` | Add a favorite |
| DELETE | `/api/favorites/[id]` | Remove a favorite |
| POST | `/api/review` | Submit a review |
| GET | `/api/review/[id]` | List reviews for a product (`[id]` is a product ID) |

### Orders & Payment

| Method | Path | Purpose |
|---|---|---|
| POST | `/api/order` | Create an order |
| GET | `/api/order` | List orders (server-side; see route for scope) |
| PATCH | `/api/order` | Update an order |
| GET | `/api/order/user` | Get current user's orders |
| PATCH | `/api/order/user` | Update current user's order (e.g. cancel) |
| POST | `/api/payment` | Initiate an iyzico payment |

### Coupons

| Method | Path | Purpose |
|---|---|---|
| GET | `/api/coupon` | List coupons |
| POST | `/api/coupon` | Create a coupon |
| DELETE | `/api/coupon` | Delete a coupon |
| POST | `/api/coupon/validate` | Validate a coupon code |

### Content (Blog, Banners, Hero Slides)

| Method | Path | Purpose |
|---|---|---|
| GET | `/api/blog` | List blog posts |
| POST | `/api/blog` | Create a blog post |
| GET | `/api/blog/[id]` | Get a blog post |
| PUT | `/api/blog/[id]` | Update a blog post |
| DELETE | `/api/blog/[id]` | Delete a blog post |
| GET | `/api/banner` | List banners |
| POST | `/api/banner` | Create a banner |
| DELETE | `/api/banner/[id]` | Delete a banner |
| GET | `/api/hero-slides` | List hero slides |
| POST | `/api/hero-slides` | Create a hero slide |
| PATCH | `/api/hero-slides/[id]` | Update a hero slide |
| DELETE | `/api/hero-slides/[id]` | Delete a hero slide |

### Addresses & Location

| Method | Path | Purpose |
|---|---|---|
| GET | `/api/address` | Get current user's addresses |
| POST | `/api/address` | Add an address |
| PATCH | `/api/address/[id]` | Update an address |
| DELETE | `/api/address/[id]` | Delete an address |
| GET | `/api/location/ilceler/[ilId]` | Get districts for a province |
| GET | `/api/location/mahalleler/[ilceId]` | Get neighborhoods for a district |

### Users

| Method | Path | Purpose |
|---|---|---|
| GET | `/api/user` | Get current user's profile |
| PATCH | `/api/user` | Update current user's profile |
| GET | `/api/user/all` | List all users (admin) |
| DELETE | `/api/user/all/[id]` | Delete a user (admin) |

### Utilities & Third-Party Integrations

| Method | Path | Purpose |
|---|---|---|
| GET | `/api/cargo-tracking` | Track a shipment via Horoz Kargo |
| POST | `/api/upload` | Upload a file |
| POST | `/api/cloudinary-signature` | Get a signed Cloudinary upload payload |
| POST | `/api/remove-bg` | Remove an image background via the remove.bg API (session required, IP rate-limited) |
| POST | `/api/send-mail` | Send a transactional email via Nodemailer |
| GET | `/api/subscribe` | List newsletter subscribers (admin only) |
| POST | `/api/subscribe` | Subscribe to the newsletter |
| DELETE | `/api/subscribe/[id]` | Remove a subscriber |

Note: `app/api/subscribe/route.js` and `app/api/subscribe/[id]/route.js` are plain JavaScript, unlike the rest of the API which is TypeScript.

---

## Database

PostgreSQL via Prisma ORM. Schema: `prisma/schema.prisma`. Generator output: `generated/prisma` (custom `output` path, not the default `node_modules/.prisma`).

### Client setup (verified in `lib/db.ts`)

```ts
import { PrismaPg } from '@prisma/adapter-pg'
import { PrismaClient } from '../generated/prisma/client'

const adapter = new PrismaPg({ connectionString: process.env.DATABASE_URL })
const prisma = new PrismaClient({ adapter })
```

The client is created with the `@prisma/adapter-pg` driver adapter (Prisma's driver-adapter API over `pg`/node-postgres), connected directly to `DATABASE_URL`. **`@prisma/extension-accelerate` is a `package.json` dependency but is not imported or applied anywhere found in the codebase** — there is no `withAccelerate()` call. Do not assume Prisma Accelerate or an edge-optimized client is in use unless that changes.

### Models (from `prisma/schema.prisma`)

| Model | Purpose |
|---|---|
| `Category` / `MiddleCategory` / `SubCategory` | Three-level product category hierarchy |
| `Brand` | Product brands |
| `Color` | Color variants (name + hex code) |
| `Size` | Size variants (value, sort order, active flag) |
| `product` | Product catalog (title, price, discount, images, `videoUrl`/`showVideo`, bulk-discount fields) |
| `ProductSize` | Join table: which sizes a product offers |
| `ProductStock` | Stock and price modifier per product/size combination |
| `User` | Accounts (name, surname, email, hashed password, `UserRole`, password-reset token) |
| `Address` | Saved user delivery addresses |
| `Favorite` | Wishlist entries (unique per user+product) |
| `CartItem` | Active cart items (optionally guest, `userId` nullable) |
| `Order` | Orders (status, pricing, iyzico payment/transaction IDs, coupon code) |
| `OrderItem` | Line items within an order |
| `OrderAddress` | Snapshot of the delivery/billing address at order time |
| `Review` | Product reviews (rating, title, comment; unique per user+product) |
| `Blog` | Blog posts |
| `Subscribe` | Newsletter subscribers |
| `Banner` | Homepage banners |
| `HeroSlide` | Hero slider slides (desktop/mobile images, ordering) |
| `Coupon` | Discount codes (`PERCENTAGE`/`FIXED`, usage limits/count, expiry) |

### Enums

`OrderStatus` (`pending`, `paid`, `shipped`, `delivered`, `cancelled`), `UserRole` (`USER`, `ADMIN`), `CouponType` (`PERCENTAGE`, `FIXED`).

### Key relationships

- `product` belongs to a `Category`, and optionally a `MiddleCategory`/`SubCategory`, plus an optional `Brand` and `Color`
- `ProductStock` combines `product` + optional `Size` for per-variant inventory; `ProductSize` records which sizes a product supports
- `Order` has many `OrderItem` and `OrderAddress` records; the address is a point-in-time snapshot, independent of the user's saved `Address` records
- `Review` and `Favorite` are each unique per `(userId, productId)`
- `CartItem.userId` is nullable, indicating guest-cart support at the schema level (see `utils/mergeGuestData.ts` for guest-to-user cart merge logic)

---

## Authentication

- **NextAuth.js** (`next-auth` v4) with a single `CredentialsProvider` (`lib/auth.ts`) — email + password checked against the `User` table with `bcrypt.compare`.
- **Session strategy**: JWT, `maxAge` of 24 hours.
- The JWT/session callbacks propagate `id`, `name`, `surname`, `email`, and `role` onto the session.
- **Route protection**: `proxy.ts` (Next.js 16's middleware/proxy file) uses `withAuth` to gate `/admin/:path*`, `/profile/:path*`, `/checkout/:path*`, `/favorites/:path*`, and `/api/admin/:path*`. Admin sub-pages require `token.role === "ADMIN"`; `/admin` itself is left open because it renders its own login screen. Protected pages redirect unauthenticated users to `/auth/login?callbackUrl=...`.
- **Server-to-server calls** (route handler calling another route handler) authenticate via a shared-secret header (`x-internal-secret`) built from `NEXTAUTH_SECRET`, implemented in `lib/internalAuth.ts` — this is not a general-purpose auth mechanism, only an internal-call guard.
- Password reset uses a `resetToken`/`resetTokenExpires` pair on the `User` model, emailed via Nodemailer (`lib/mailer.ts`).

---

## Configuration

- **`next.config.ts`**: allows Cloudinary (`res.cloudinary.com`) as a remote image host; sets security headers (`X-Content-Type-Options`, `X-Frame-Options`, `X-XSS-Protection`, `Referrer-Policy`, `Permissions-Policy`, `Strict-Transport-Security`) and a `Content-Security-Policy` on every route that explicitly allowlists iyzico script/CDN domains, Google Fonts, and Cloudinary for images/media.
- **`components.json`**: shadcn-style component configuration — style `"new-york"`, RSC + TSX enabled, Tailwind CSS entry at `app/globals.css`, base color `slate`, Lucide icon library, path aliases (`@/components`, `@/lib`, `@/ui`, `@/hooks`).
- **`tsconfig.json`**: TypeScript strict mode, `@/*` path alias mapped to the project root, Next.js TS plugin enabled.
- **`prisma.config.ts`**: points the Prisma CLI at `prisma/schema.prisma` and `prisma/migrations`, using `DATABASE_URL`.

---

## Troubleshooting

- **I ran `npm run build:fresh` and lost my data.** This is expected — `build:fresh` runs `prisma migrate reset --force` and `prisma db push --force-reset`, both of which drop and recreate the database schema, deleting all rows. This script should only ever be run against a disposable local/dev database that you're fine wiping, and never against staging or production. If you need a normal production build, use `npm run build` instead, which only runs `prisma generate && next build` and does not touch the database.
- **Prisma Client errors after pulling new code / changing the schema.** Run `npx prisma generate` (also runs automatically via `postinstall` after `npm install`). The generated client lives at `generated/prisma`, not the default `node_modules/.prisma` location — make sure imports point at `../generated/prisma` (as `lib/db.ts` does) if you add new Prisma-using files.
- **Database connection errors.** Confirm `DATABASE_URL` is set and reachable; `lib/db.ts` constructs the `@prisma/adapter-pg` adapter directly from `process.env.DATABASE_URL` with no fallback.
- **`prisma/seed.ts` or `prisma/syncCatalog.ts` fail to find `DATABASE_URL`.** Both scripts explicitly do `process.env.DATABASE_URL = process.env.POSTGRES_URL || process.env.DATABASE_URL`, so if only one of those two variables is set, make sure it's the one actually populated in your `.env`.
- **iyzico payments fail with a credentials error.** `lib/iyzico.ts` throws if `IYZICO_API_KEY` or `IYZICO_SECRET_KEY` is missing. Confirm both are set, and that `IYZICO_BASE_URL` points at the sandbox endpoint (`https://sandbox-api.iyzipay.com`) during development.
- **`/api/remove-bg` returns 401 or 429.** It requires an authenticated session and is rate-limited to 10 requests per 10 minutes per IP (`lib/rate-limit.ts`). The limiter is in-memory per server process, so it resets on restart and is not shared across multiple instances/replicas.
- **Image/video uploads fail.** Uploads go directly from the browser to Cloudinary using a signature obtained from `/api/cloudinary-signature`; verify `CLOUD_NAME`, `API_KEY`, and `API_SECRET` are set on the server.
- **Cargo tracking returns no data.** Confirm `HOROZ_API_BASE_URL` and `HOROZ_PROCESS_KEY` are set; the integration depends entirely on the Horoz Kargo API being reachable.

---

## License

No `LICENSE` file was found in the project root, so no license can be documented here. If this project is intended to carry a specific license, add a `LICENSE` file and update this section accordingly.

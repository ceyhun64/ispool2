# İşPool

Next.js storefront and admin panel for an occupational-safety, workwear, and PPE retailer, with a hand-rolled iyzico payment integration.

## Overview

İşPool is a single Next.js (App Router) application — not a monorepo — that serves both a customer-facing store and a role-gated admin panel from the same codebase.

The storefront covers a three-level product catalog, search, a server-side cart, favorites, reviews, coupon codes, a single-page checkout with credit-card payment, order history, and cargo tracking. The admin panel at `/admin` manages products (including per-size stock and price modifiers), the category tree, colors, sizes, brands, orders, users, coupons, banners, hero slides, showcase images, blog posts, and newsletter subscribers.

Every statement below was checked against the source. Where the repository did not settle a question, that is said explicitly rather than filled in with a plausible guess.

> **Interface language.** All user-facing copy, transactional emails, error messages, and source comments are Turkish. There is no i18n layer — no `next-intl`, no locale routing, no message catalogs. `app/layout.tsx` hardcodes `<html lang="tr">`.

---

## Features

### Storefront

| Feature | Implementation |
|---|---|
| Product catalog | `Category → MiddleCategory → SubCategory` hierarchy, plus optional brand and color ([schema.prisma](prisma/schema.prisma)) |
| Per-variant stock | `ProductStock` rows keyed by `(productId, sizeId)`, each with its own `stock` and `priceModifier` |
| Bulk discounts | `product.bulkDiscountQty` / `bulkDiscountRate`, applied server-side in [order/route.ts](app/api/order/route.ts) |
| Search | Case-insensitive match on title, description, category name, brand name; min 2 chars, max 6 results ([search/route.ts](app/api/search/route.ts)) |
| Cart | Server-side `CartItem` rows for signed-in users ([cart/route.ts](app/api/cart/route.ts)); `localStorage` for guests ([cart.ts](utils/cart.ts)) |
| Guest to account merge | On login, guest cart and favorites are POSTed to the API and cleared ([mergeGuestData.ts](utils/mergeGuestData.ts)) |
| Custom product designs | Canvas editor with layers, drag/resize, and PNG export ([design/](components/modules/products/productDetail/design/)); the result is uploaded to Cloudinary and stored as `CartItem.customImage` |
| Background removal | Calls the hosted remove.bg API ([remove-bg/route.ts](app/api/remove-bg/route.ts)) |
| Favorites | `Favorite` model, unique per `(userId, productId)`; guest favorites live in `localStorage` |
| Reviews | `Review` model, unique per `(userId, productId)` |
| Coupons | `PERCENTAGE` / `FIXED`, with `minAmount`, `maxDiscount`, `usageLimit`, `expiryDate` |
| Checkout | Single-page stepper — address, billing, card ([checkout/](components/modules/checkout/)) |
| Payments | Direct card charge through iyzico, up to 12 installments ([iyzico.ts](lib/iyzico.ts)) |
| Cargo tracking | Horoz Lojistik REST API ([cargo-tracking/route.ts](app/api/cargo-tracking/route.ts)) |
| Transactional email | Nodemailer over SMTP with an HTML template and inline logo ([mailer.ts](lib/mailer.ts)) |
| SEO | Metadata and OpenGraph in [layout.tsx](app/layout.tsx), JSON-LD `Organization` and `WebSite` schemas, generated [robots.ts](app/robots.ts) and [sitemap.ts](app/sitemap.ts) |

### Admin panel

Reached at `/admin`, which renders its own login screen; every deeper path requires `role === "ADMIN"`.

Products · categories/colors/sizes · brands · orders (status transitions with customer notification email) · users · coupons · blog posts · banners and hero slides · showcase images · newsletter subscribers.

### Present in `package.json` but not used

Verified by grepping every import across `app/`, `components/`, `lib/`, `hooks/`, `contexts/`, `utils/`, `prisma/`, `types/`, and `tests/`:

| Package | Status |
|---|---|
| `zod`, `@hookform/resolvers` | Zero imports. There is no schema-validation layer; API routes validate with hand-written `if` checks. |
| `date-fns` | Zero imports. |
| `html2canvas` | Zero imports — the design tool exports via `html-to-image` instead. |
| `react-resizable-panels`, `motion`, `imgly` | Zero imports. |
| `@ffmpeg-installer/ffmpeg`, `fluent-ffmpeg` | Zero imports. Product video (`product.videoUrl`) is handled entirely by Cloudinary. |
| `@prisma/extension-accelerate` | Never imported. Accelerate is reached through Prisma 7's built-in `accelerateUrl` client option instead (see [Database](#database)). |
| `next-session` | Imported only by [session.ts](lib/session.ts), which is itself imported by nothing. Dead code — as is [cargo-utils.ts](lib/cargo-utils.ts), which exports 11 tracking helpers that no module imports. |
| `react-hook-form`, `recharts`, `cmdk`, `vaul`, `input-otp`, `react-day-picker` | Reachable only through scaffolded shadcn primitives (`components/ui/form.tsx`, `chart.tsx`, `command.tsx`, `drawer.tsx`, `input-otp.tsx`, `calendar.tsx`) that no application code imports. |

---

## Technology Stack

### Runtime dependencies (verified in use)

| Technology | Version | Where it is used |
|---|---|---|
| Next.js | 16.1.1 | App Router; `proxy.ts` for middleware |
| React / React DOM | 19.2.3 | |
| TypeScript | ^5 | `strict: true`, `noEmit`, `@/*` mapped to the repo root |
| Tailwind CSS | ^4 | via `@tailwindcss/postcss`; entry [globals.css](app/globals.css) |
| `tw-animate-css` | ^1.4.0 | CSS `@import` in `globals.css` (not a JS import) |
| Radix UI | ^1.4.3 plus per-component packages | primitives behind `components/ui` |
| `lucide-react` | ^0.562.0 | icons — 113 files |
| `framer-motion` | ^12.26.2 | animation — 39 files |
| `sonner` | ^2.0.7 | toasts — 39 files; `<Toaster>` mounted in [layout.tsx](app/layout.tsx) |
| `class-variance-authority`, `clsx`, `tailwind-merge` | | variant and class composition via [utils.ts](lib/utils.ts) |
| `embla-carousel-react` | ^8.6.0 | `components/ui/carousel.tsx`, used by home and product pages |
| `react-rnd` + `html-to-image` | | design canvas drag/resize and PNG export |
| `color` | ^5.0.3 | admin color picker |
| `next-themes` | ^0.4.6 | required by `components/ui/sonner.tsx` |
| NextAuth.js | ^4.24.13 | Credentials provider, JWT sessions |
| `bcrypt` | ^6.0.0 | password hashing |
| Prisma ORM | ^7.4.1 | client generated to `generated/prisma` |
| `@prisma/adapter-pg` + `pg` | ^7.3.0 / ^8.16.3 | driver adapter for local and non-Vercel connections |
| `cloudinary` | ^2.8.0 | signed uploads |
| `nodemailer` | ^7.0.12 | SMTP |
| PostgreSQL | — | `provider = "postgresql"` |

There is **no `iyzipay` npm package**. [iyzico.ts](lib/iyzico.ts) is a hand-written client that builds the `IYZWSv2` HMAC-SHA256 authorization header and calls the REST API with `fetch`.

### External services

| Service | Reached from | Notes |
|---|---|---|
| iyzico | [iyzico.ts](lib/iyzico.ts) | `/payment/auth` and `/payment/cancel` |
| Cloudinary | [cloudinaryUpload.ts](lib/cloudinaryUpload.ts), [uploadToCloudinary.ts](lib/uploadToCloudinary.ts), [cloudinary-signature](app/api/cloudinary-signature/route.ts) | images and video |
| Horoz Lojistik | [cargo-tracking](app/api/cargo-tracking/route.ts) | falls back to a hardcoded **test** endpoint when `HOROZ_API_BASE_URL` is unset |
| remove.bg | [remove-bg](app/api/remove-bg/route.ts) | paid API, rate-limited |
| `api.turkiyeapi.dev` | [ilceler](app/api/location/ilceler/), [mahalleler](app/api/location/mahalleler/) | public province/district/neighborhood data; no key required |
| SMTP host | [mailer.ts](lib/mailer.ts) | provider not identifiable from the repository |

### Dev tooling

`prisma` CLI · `tsx` (seed, catalog sync, test runner) · `@tailwindcss/postcss` · `@types/*`.

> **No linter or formatter is configured.** There is no ESLint or Prettier config file anywhere in the repository, and neither appears in `package.json`. There is also no CI: no `.github/` directory and no pipeline definition of any kind.

---

## Architecture

```
Browser
   │
   ▼
proxy.ts ── NextAuth withAuth: route + role gating
   │        (/admin, /profile, /checkout, /favorites, /api/admin)
   ▼
Next.js App Router
 ├── app/**/page.tsx        storefront + admin UI
 ├── app/robots.ts, sitemap.ts
 └── app/api/**/route.ts    54 route handlers
        │
        ├── Prisma Client ──────► PostgreSQL
        │     ├─ Vercel  : accelerateUrl (PRISMA_DATABASE_URL)
        │     └─ elsewhere: PrismaPg adapter (DATABASE_URL)
        ├── lib/iyzico.ts ──────► iyzico REST (IYZWSv2 signed)
        ├── Cloudinary ─────────► signed direct upload
        ├── Horoz Lojistik ─────► cargo tracking
        ├── remove.bg ──────────► background removal
        ├── api.turkiyeapi.dev ─► province / district lookup
        └── lib/mailer.ts ──────► SMTP
```

Points worth knowing before touching the code:

- **Middleware lives in `proxy.ts`**, not `middleware.ts`. This is the Next.js 16 filename.
- **Only one React context exists** — [favoriteContext.tsx](contexts/favoriteContext.tsx). Cart state is not in a context; components call `/api/cart` and the `localStorage` helpers directly, coordinating through a `window` `"cartUpdated"` event dispatched by [cart.ts](utils/cart.ts).
- **Payment happens inside the order route, in-process.** [order/route.ts](app/api/order/route.ts) calls `processPayment()` as a plain function call. An earlier design issued an HTTP request to a separate `/api/payment` route; the in-file comments record that this broke on the apex-to-www redirect.
- **Server-to-server calls** use a shared-secret header `x-internal-secret`, derived from `NEXTAUTH_SECRET` ([internalAuth.ts](lib/internalAuth.ts)). `/api/upload` and `/api/send-mail` accept either a valid session or this header.
- **Rate limiting is in-memory** ([rate-limit.ts](lib/rate-limit.ts)) — a plain `Map` in the process. It resets on restart and is not shared between serverless instances or replicas, so the limits documented below are best-effort, not guarantees.

### Payment flow

```
checkout.tsx ──POST /api/order──► order/route.ts
                                    │
                                    ├─ 1. reload every product from the DB
                                    ├─ 2. unit price = product.price + stock.priceModifier
                                    ├─ 3. apply bulk discount, verify stock
                                    ├─ 4. re-validate the coupon server-side
                                    ├─ 5. processPayment() ──► iyzico /payment/auth
                                    │
                                    ├─ 6. $transaction: decrement stock (guarded
                                    │     updateMany), bump coupon.usedCount,
                                    │     create Order + OrderItem + OrderAddress
                                    │
                                    └─ on transaction failure:
                                          voidIyzicoPayment() ──► /payment/cancel
```

Three properties of this flow are easy to break and worth preserving:

1. **No price arrives from the client.** Item prices, the discount, shipping, and the service fee are all recomputed from the database. Price fields in the request body are ignored.
2. **The coupon base and the charged base come from one function.** Both derive from `calculatePricing(...).baseTotal`, so the discount the customer is shown and the discount actually applied cannot drift apart.
3. **Payment is compensated, not rolled back.** The charge is captured before the order row exists. If the transaction then fails — a concurrent order exhausting stock, for example — `voidIyzicoPayment()` fires and the API returns `409`.

> **There is no 3-D Secure.** The integration calls `/payment/auth` directly and charges the card in a single request. There is no `/payment/3dsecure/initialize` call, no callback route, no `mdStatus` handling, and no bank-hosted redirect anywhere in the codebase. Consistent with this, the CSP in [next.config.ts](next.config.ts) sets `frame-src 'none'` and `form-action 'self'`. Whether non-3DS charging is permitted for this merchant account is a contract question the repository cannot answer.

### Pricing model

Two constants govern every displayed and charged amount, and [pricing.ts](lib/pricing.ts) and [iyzico.ts](lib/iyzico.ts) must agree on them:

| Rule | Value | Source |
|---|---|---|
| Prices in `product.price` are **VAT-exclusive** | — | [pricing.ts](lib/pricing.ts) |
| VAT / service fee | 10% (`KDV_RATE = 0.1`; `subtotal * 0.1` server-side) | [pricing.ts](lib/pricing.ts), [iyzico.ts](lib/iyzico.ts) |
| Free-shipping threshold | 2000 TRY, evaluated on the VAT-inclusive subtotal | `FREE_SHIPPING_THRESHOLD` |
| Shipping fee below threshold | 149.90 TRY | `SHIPPING_FEE` |
| Installment surcharges | 1x: 0% · 2x: 3.5% · 3x: 5.2% · 6x: 9.8% · 9x: 13.5% · 12x: 17.0% | `INSTALLMENT_RATES` |

`buildIyzicoBasket()` assembles the request so that `sum(basketItems[].price)` is *derived from* the emitted line strings rather than computed independently — iyzico rejects any mismatch with `errorCode 5062`. The service fee and, when charged, shipping are sent as separate `VIRTUAL` line items. The installment surcharge is deliberately **not** a line item: it rides only on `paidPrice`. A final kuruş-rounding correction is applied to a line item chosen so that it cannot go negative.

The installment rate table is duplicated in [stepPayment.tsx](components/modules/checkout/stepPayment.tsx) for display. Changing one without the other shows the customer a different figure from the one charged.

---

## Folder Structure

```
İşPool/
├── app/
│   ├── admin/             role-gated panel: dashboard, products, orders, users,
│   │                      blogs, color_size, coupon, home_settings, subscribers
│   ├── api/               54 route handlers — see the API section
│   ├── auth/              login, register, forgot-password, reset-password
│   ├── cart/  checkout/   cart page; checkout with success/ and unsuccess/
│   ├── products/          listing, [id], category/, special_production/, wholesale/
│   ├── profile/           orders, addresses, cargo_tracking
│   ├── favorites/
│   ├── institutional/     about, blog, career, cookie_policy, partners, quality, why_us
│   ├── help/              bank-info, contact, distance-sales, faq, kvkk, printing,
│   │                      returns-help
│   ├── customer/          bank-details, privacy, returns, sales-agreement, terms
│   ├── layout.tsx         metadata, JSON-LD, fonts, Toaster, FavoriteProvider
│   ├── not-found.tsx
│   ├── robots.ts          generated robots.txt
│   ├── sitemap.ts         generated sitemap (static + products + blogs + categories)
│   └── globals.css        Tailwind entry
├── components/
│   ├── layout/            Navbar, Footer, topbar, cookieConsent, scrollToTop,
│   │                      socialSidebar, pagination, ClientLayoutWrapper
│   ├── modules/           admin/, auth/, cart/, checkout/, favorites/, footer/,
│   │                      home/, navbar/, products/, profile/
│   │                      └── products/productDetail/design/  canvas design tool
│   └── ui/                53 shadcn-style primitives (several unused — see Features)
├── contexts/
│   └── favoriteContext.tsx    the only React context
├── lib/
│   ├── auth.ts            NextAuth options
│   ├── db.ts              Prisma Client (Accelerate on Vercel, adapter elsewhere)
│   ├── iyzico.ts          signed iyzico client + pricing + basket construction
│   ├── pricing.ts         VAT rate, shipping threshold, tr-TR price formatting
│   ├── mailer.ts          Nodemailer transport + HTML template
│   ├── cargo-utils.ts     Horoz status/format helpers — NOT imported anywhere
│   ├── cloudinaryUpload.ts / uploadToCloudinary.ts
│   ├── internalAuth.ts    x-internal-secret header
│   ├── rate-limit.ts      in-memory limiter
│   ├── sanitize.ts        allowlist HTML sanitizer (used by products/[id])
│   ├── session.ts         next-session wrapper — NOT imported anywhere
│   └── utils.ts           cn()
├── prisma/
│   ├── schema.prisma
│   ├── seed.ts            catalog + admin user from data/*.json
│   ├── syncCatalog.ts     idempotent size/brand top-up
│   └── migrations/        7 migrations + migration_lock.toml
├── data/                  products.json, categories.json, middleCategories.json,
│                          subCategories.json  (seed fixtures)
├── tests/
│   └── pricing.test.ts    15 node:test cases over the payment amount chain
├── types/                 order.ts, product.ts, horoz-cargo.ts, module augmentations
├── hooks/use-mobile.ts
├── utils/                 cart.ts (guest cart), mergeGuestData.ts
├── generated/prisma/      Prisma Client output
├── proxy.ts               Next.js 16 middleware — auth gating
├── next.config.ts         images, security headers, CSP
├── prisma.config.ts       Prisma CLI config (dotenv-loaded)
└── public/                about/, banner/, brands/, cards/, categories/,
                           categoryIcons/, heroes/, iyzico/, logo/, megaMenu/,
                           products/, socialMedia/, special_production/,
                           wholesale/, why_us/, city.json, og-image.png
```

---

## Installation

### Prerequisites

- **Node.js** — no version is pinned anywhere in the repository: no `engines` field, no `.nvmrc`, no `.node-version`. `@types/node` is `^20`, and `browserslist` targets the last two versions of Chrome, Firefox, Safari, and Edge. Choose a version compatible with Next.js 16 and React 19.
- **npm** — `package-lock.json` is the only lockfile present.
- **PostgreSQL** — local or hosted.
- Credentials for whichever external services you need (see [Environment Variables](#environment-variables)).

### 1. Install

```bash
npm install
```

`postinstall` runs `prisma generate`, writing the client to `generated/prisma`.

### 2. Configure environment

There is **no `.env.example` in the repository.** Create `.env` yourself using the table below.

> **Read the precedence note in [Environment Variables](#environment-variables) before creating both `.env` and `.env.local`.** The Next.js runtime and the Prisma scripts resolve them in opposite orders, which has previously caused real payments to be made from a development machine.

### 3. Create the schema

```bash
npx prisma migrate dev    # apply the 7 migrations in prisma/migrations
npm run seed              # load catalog fixtures + create the admin user
```

### 4. Run

```bash
npm run dev
```

The app serves on http://localhost:3000.

---

## Environment Variables

Names and purposes only — no values appear in this document, and none should.

| Variable | Required for | Read at |
|---|---|---|
| `DATABASE_URL` | Everything | [db.ts](lib/db.ts), [prisma.config.ts](prisma.config.ts) |
| `PRISMA_DATABASE_URL` | Prisma Accelerate, Vercel only | [db.ts](lib/db.ts) |
| `NEXTAUTH_SECRET` | Auth and internal calls | [auth.ts](lib/auth.ts), [internalAuth.ts](lib/internalAuth.ts) |
| `NEXT_PUBLIC_BASE_URL` | Metadata, sitemap, robots, reset links | [layout.tsx](app/layout.tsx), [sitemap.ts](app/sitemap.ts), [robots.ts](app/robots.ts), [forgot_password](app/api/account/forgot_password/route.ts), [products/[id]](app/products/) |
| `IYZICO_API_KEY`, `IYZICO_SECRET_KEY` | Payments | [iyzico.ts](lib/iyzico.ts) |
| `IYZICO_BASE_URL` | Payments | [iyzico.ts](lib/iyzico.ts) — defaults to `https://sandbox-api.iyzipay.com` |
| `IYZICO_ALLOW_PRODUCTION_IN_DEV` | Escape hatch | [iyzico.ts](lib/iyzico.ts) — see the warning below |
| `CLOUD_NAME`, `API_KEY`, `API_SECRET` | Cloudinary | [cloudinaryUpload.ts](lib/cloudinaryUpload.ts), [cloudinary-signature](app/api/cloudinary-signature/route.ts) |
| `EMAIL_HOST`, `EMAIL_PORT`, `EMAIL_USER`, `EMAIL_PASS` | SMTP | [mailer.ts](lib/mailer.ts) — `secure` is enabled only when the port is exactly `465` |
| `HOROZ_API_BASE_URL`, `HOROZ_PROCESS_KEY` | Cargo tracking | [cargo-tracking](app/api/cargo-tracking/route.ts) |
| `REMOVE_BG_API_KEY` | Background removal | [remove-bg](app/api/remove-bg/route.ts) |
| `ADMIN_NAME`, `ADMIN_SURNAME`, `ADMIN_EMAIL`, `ADMIN_PASSWORD` | Seeding | [seed.ts](prisma/seed.ts) |

### Variables present in `.env.local` but not read by any code

| Variable | Finding |
|---|---|
| `POSTGRES_URL` | Present in the local `.env.local`, referenced nowhere in the source tree. |
| `VERCEL_OIDC_TOKEN` | Generated by `vercel env pull`; Vercel tooling, not application config. |

`NEXTAUTH_URL` is **not** set in either env file and is not read anywhere in the source. NextAuth resolves it internally; whether the deployment sets it in the hosting provider's dashboard could not be verified from the repository.

`VERCEL` and `NODE_ENV` are read but are injected by the platform, not by you.

### ⚠️ `.env` precedence differs between runtime and scripts

| Context | Order | Winner |
|---|---|---|
| Next.js dev/build | Framework default | **`.env.local`** overrides `.env` |
| `prisma.config.ts`, `seed.ts`, `syncCatalog.ts` | `dotenv(".env.local")` then `dotenv(".env", { override: true })` | **`.env`** overrides `.env.local` |

Both files exist in this working tree with overlapping keys. The Prisma CLI and the seed scripts therefore read a different `DATABASE_URL` than the running app does whenever the two files disagree.

### ⚠️ Live-payment guard

`getIyzicoCredentials()` throws if `IYZICO_BASE_URL` points at the production iyzico endpoint while `NODE_ENV !== "production"`. The comment in [iyzico.ts](lib/iyzico.ts) records the incident that produced this guard: `.env.local` (pulled from Vercel) pointed at live iyzico while `.env` pointed at sandbox, and because `.env.local` wins at runtime, local development was charging real cards.

Setting `IYZICO_ALLOW_PRODUCTION_IN_DEV=1` disables the guard. **Real money moves when it is set.**

---

## Available Scripts

Single package; all scripts are root-level.

| Script | Command | What it does |
|---|---|---|
| `dev` | `next dev` | Development server |
| `build` | `prisma generate && next build` | Regenerates the client, then builds. Does not touch the database. |
| `start` | `next start` | Serves a completed build |
| `test` | `tsx --test tests/*.test.ts` | Runs the `node:test` suite — see [Testing](#testing) |
| `seed` | `npx tsx prisma/seed.ts` | Loads `data/*.json` and creates the admin user from `ADMIN_*` |
| `sync-catalog` | `npx tsx prisma/syncCatalog.ts` | Idempotently adds sizes 5XL–8XL and 66/68/70/72, plus brands "Bmes", "Pars", "İş Pool", using `skipDuplicates`. Safe against a populated database. |
| `postinstall` | `prisma generate` | Runs automatically after `npm install` |
| `build:fresh` | see below | **Destroys the database.** See the warning. |

> ### 🔴 `build:fresh` destroys data
>
> ```
> prisma migrate reset --force && prisma db push --force-reset && prisma generate && npm run seed && next build
> ```
>
> Two separate forced resets. Every row in whatever database `DATABASE_URL` resolves to is dropped — and per the precedence table above, that may not be the database you think you are pointed at. Never run this against production, staging, or any shared database. For a normal build use `npm run build`.

---

## Development

```bash
npm run dev
```

Prisma CLI commands (not npm scripts; `prisma.config.ts` supplies the schema path and datasource):

```bash
npx prisma studio        # browse data
npx prisma migrate dev   # create and apply a migration
npx prisma generate      # regenerate the client after schema edits
```

There is no lint or format script. Code style is not machine-enforced anywhere in this repository.

---

## Testing

One suite exists: [pricing.test.ts](tests/pricing.test.ts), using the built-in `node:test` runner via `tsx`. No Jest, Vitest, Playwright, or Cypress configuration is present.

```bash
npm test
```

15 tests, all passing as of this audit. They cover the payment amount chain exclusively — `calculatePricing()` and `buildIyzicoBasket()` are pure functions, so the suite needs no database, no network, and no credentials:

| Group | Asserts |
|---|---|
| `PAY-003` | `sum(basketItems[].price) === price` across the seeded catalog x quantities 1–5 x all 6 installment counts x 4 coupon rates; plus kuruş-denominated prices and a 2850 TRY / 2-installment regression that previously returned iyzico `5062` |
| `PAY-008` | The installment surcharge never becomes a basket line; `price === paidPrice` for single payment; `paidPrice > price` for installments |
| `PAY-001` / `PAY-002` | The coupon base includes shipping; the displayed and charged totals match; `minAmount` is evaluated against that same single base |
| `PAY-005` | Variant price modifiers: base 100 + modifier 20 x qty 2 = 240 |
| Shipping | Threshold boundaries, evaluated on the VAT-inclusive amount |
| Rounding and format | Discounts larger than the basket clamp the total to 0 without any line going negative; every amount is emitted with `.` as decimal separator and exactly 2 decimals |

That last case matters: [pricing.ts](lib/pricing.ts) exports a `formatPrice()` that produces `tr-TR` comma decimals for display. A comma reaching the iyzico payload would break the request, and this test guards the boundary.

Nothing else is covered — no route handler, component, auth, or database test exists.

---

## Build

```bash
npm run build
npm start
```

`build` runs `prisma generate` first, so a schema change is picked up without a separate step. It performs no migration and no data change.

---

## API

54 route handlers under `app/api/`. Methods and auth below reflect the guard actually present in each handler.

**Auth legend** — `public`: no check · `session`: any signed-in user · `admin`: `session.user.role === "ADMIN"` · `internal`: valid session *or* the `x-internal-secret` header.

### Auth and account

| Method | Path | Auth | Notes |
|---|---|---|---|
| GET, POST | `/api/auth/[...nextauth]` | public | NextAuth handler |
| POST | `/api/auth/logout` | public | Clears the session cookie (`__Secure-next-auth.session-token` in production) |
| POST | `/api/account/register` | public | Requires a password of at least 8 characters; 5 requests / 15 min per IP |
| GET | `/api/account/check` | public | Returns `{ user }` for the current session, or `{ user: null }` with **status 200** |
| POST | `/api/account/forgot_password` | public | 32-byte token, 30-minute expiry; 3 requests / 5 min per IP |
| POST | `/api/account/reset_password` | public | 10 requests / 10 min per IP |

### Catalog

`GET` is public throughout; writes are admin-only.

| Method | Path | Auth |
|---|---|---|
| GET | `/api/products` | public — `?page` (default 1), `?limit` (default 24, max 100), `?ids=1,2,3` (skips pagination); returns `{ products, pagination }` |
| POST | `/api/products` | admin |
| GET | `/api/products/[id]` | public |
| PUT, DELETE | `/api/products/[id]` | admin — HTML description passed through [sanitize.ts](lib/sanitize.ts) |
| GET | `/api/products/category/[id]`, `/[midId]`, `/[subId]` | public |
| GET | `/api/search?q=` | public — min 2 chars, max 6 results |
| GET | `/api/category`, `/api/category/[id]`, `/[midId]`, `/[subId]` | public |
| GET / POST | `/api/brand` | public / admin |
| GET / PATCH / DELETE | `/api/brand/[id]` | public / admin / admin |
| GET / POST | `/api/color` | public / admin |
| GET / PATCH / DELETE | `/api/color/[id]` | public / admin / admin |
| GET / POST | `/api/size` | public / admin |
| GET / PATCH / DELETE | `/api/size/[id]` | public / admin / admin |

### Cart, favorites, reviews

| Method | Path | Auth | Notes |
|---|---|---|---|
| GET | `/api/cart` | session | Returns `[]` with **status 200** when unauthenticated |
| POST | `/api/cart` | session | `multipart/form-data`; max qty 999; images capped at 5 MB and must be `image/*`; deduplicates on `(productId, sizeId, customImage)`; validates against `ProductStock` including the quantity already in the cart |
| PATCH, DELETE | `/api/cart/[id]` | session | Ownership-checked; a non-owned id returns 404 |
| GET, POST | `/api/favorites` | session | |
| DELETE | `/api/favorites/[id]` | session | |
| POST | `/api/review` | session | |
| GET | `/api/review/[id]` | public | `[id]` is a **product** id |

### Orders and payment

| Method | Path | Auth | Notes |
|---|---|---|---|
| POST | `/api/order` | session | Recalculates prices, revalidates the coupon, charges iyzico, then writes the order transactionally. `400` on validation or payment failure (returns the iyzico `errorCode`), `409` if the transaction failed after a successful charge — in which case a void was attempted. |
| GET | `/api/order` | **admin** | All orders; amounts converted from kuruş to TRY |
| PATCH | `/api/order` | admin | Status change plus customer and admin notification email |
| GET | `/api/order/user` | session | The caller's own orders |
| PATCH | `/api/order/user` | session | Cancel own order; rejected once `shipped`, `delivered`, or `cancelled`; a foreign order id returns 403 |

### Coupons

| Method | Path | Auth |
|---|---|---|
| GET, POST, DELETE | `/api/coupon` | admin |
| POST | `/api/coupon/validate` | public — body `{ code, cartTotal }`; returns `{ discountAmount, finalPrice }`. Advisory only; `/api/order` revalidates independently. |

### Content

| Method | Path | Auth |
|---|---|---|
| GET / POST | `/api/blog` | public / admin |
| GET / PUT / DELETE | `/api/blog/[id]` | public / admin / admin |
| GET / POST | `/api/banner` | public / admin |
| DELETE | `/api/banner/[id]` | admin |
| GET / POST | `/api/hero-slides` | public / admin |
| PATCH / DELETE | `/api/hero-slides/[id]` | admin |
| GET / POST | `/api/showcase` | public (active only, ordered) / admin |
| DELETE | `/api/showcase/[id]` | admin |
| GET / POST | `/api/subscribe` | admin / public |
| DELETE | `/api/subscribe/[id]` | admin |

> `app/api/subscribe/route.js` and `app/api/subscribe/[id]/route.js` are the only plain-JavaScript files in the API. Everything else is TypeScript.

### Addresses and location

| Method | Path | Auth |
|---|---|---|
| GET, POST | `/api/address` | session |
| PATCH, DELETE | `/api/address/[id]` | session |
| GET | `/api/location/ilceler/[ilId]` | public — proxies `api.turkiyeapi.dev` |
| GET | `/api/location/mahalleler/[ilceId]` | public — proxies `api.turkiyeapi.dev` |

Province data is *not* fetched — it is bundled as [city.json](public/city.json) and imported directly by the billing and address forms.

### Users

| Method | Path | Auth |
|---|---|---|
| GET, PATCH | `/api/user` | session — own profile |
| GET | `/api/user/all` | admin |
| DELETE | `/api/user/all/[id]` | admin |

### Utilities

| Method | Path | Auth | Notes |
|---|---|---|---|
| POST | `/api/upload` | internal | Cloudinary upload; 400 on `UploadError`, 500 otherwise |
| POST | `/api/cloudinary-signature` | admin | Returns a signed direct-upload payload |
| POST | `/api/remove-bg` | session | 10 requests / 10 min per IP |
| POST | `/api/send-mail` | internal | Internal and admin callers may send anywhere. Anonymous callers are limited to 5 requests / 10 min per IP **and** may only send to `info@ispool.com.tr` — this prevents the endpoint being used as an open relay. |
| GET | `/api/cargo-tracking?requestNumber=` | **public** | Throttled to one lookup per `requestNumber` per hour, in memory. Returns 429 with `code: "ERR-20002"` when throttled, 500 when `HOROZ_PROCESS_KEY` is unset. |

---

## Database

PostgreSQL through Prisma 7. Schema: [schema.prisma](prisma/schema.prisma). The client is generated to `generated/prisma` — **not** the default `node_modules/.prisma` — so new files must import from there, as [db.ts](lib/db.ts) does.

### Two connection modes

```ts
const prisma =
  process.env.VERCEL && process.env.PRISMA_DATABASE_URL
    ? new PrismaClient({ accelerateUrl: process.env.PRISMA_DATABASE_URL })
    : new PrismaClient({
        adapter: new PrismaPg({ connectionString: process.env.DATABASE_URL }),
      })
```

On Vercel with `PRISMA_DATABASE_URL` set, the client goes through **Prisma Accelerate**; everywhere else it opens a direct `pg` connection. The in-file comment records why: each serverless instance opening its own raw connection exhausted the database's connection limit and produced `P2037` ("Too many database connections").

`@prisma/extension-accelerate` is a dependency but is never imported. Accelerate is engaged through Prisma 7's built-in `accelerateUrl` option instead.

### Models

| Model | Table | Purpose |
|---|---|---|
| `Category` / `MiddleCategory` / `SubCategory` | `category` / `middle_category` / `sub_category` | Three-level hierarchy |
| `Brand` | `brand` | |
| `Color` | `color` | Name plus hex code |
| `Size` | `size` | Value, sort order, active flag |
| `product` | `product` | Catalog entry. Lowercase model name; the table is not remapped. |
| `ProductSize` | `product_size` | Which sizes a product offers |
| `ProductStock` | `product_stock` | Stock and `priceModifier` per `(productId, sizeId)` |
| `User` | `user` | Includes `resetToken` / `resetTokenExpires` |
| `Address` | `address` | Saved addresses |
| `Favorite` | `favorite` | Unique per `(userId, productId)` |
| `CartItem` | `cartitem` | `userId` nullable; `customImage` for designs |
| `Order` | `order` | |
| `OrderItem` | `orderitem` | |
| `OrderAddress` | `orderaddress` | Point-in-time snapshot, independent of `Address` |
| `Review` | `review` | Unique per `(userId, productId)` |
| `Blog`, `Subscribe`, `Banner`, `HeroSlide`, `ShowcaseImage` | `blog`, `subscribe`, `banner`, `hero_slide`, `showcase_image` | Content |
| `Coupon` | `coupons` | |

Enums: `OrderStatus` (`pending`, `paid`, `shipped`, `delivered`, `cancelled`) · `UserRole` (`USER`, `ADMIN`) · `CouponType` (`PERCENTAGE`, `FIXED`).

### ⚠️ Money is stored in two different units

| Field | Prisma type | Unit |
|---|---|---|
| `Order.totalPrice`, `Order.paidPrice` | `Int` | **kuruş** — written as `Math.round(total * 100)` |
| `Order.discountAmount` | `Float?` | **TRY** |
| `OrderItem.unitPrice`, `OrderItem.totalPrice` | `Float` | **TRY** |
| `product.price`, `oldPrice` | `Int` | **TRY**, VAT-exclusive |

`/api/order` (GET), `/api/order/user`, and the admin order views divide the `Order` amounts by 100 before returning them; `OrderItem` amounts are passed through untouched. Any new query reading `Order.totalPrice` or `Order.paidPrice` must do the same conversion, and any comparison between an `Order` total and the sum of its `OrderItem` totals must reconcile the units first.

### Guest carts are not database rows

`CartItem.userId` is nullable in the schema, but no code path creates a `CartItem` without a user — `/api/cart` rejects unauthenticated POSTs with 401. Guest carts live in `localStorage` under the key `guest_cart` ([cart.ts](utils/cart.ts)) and are replayed into the API on login ([mergeGuestData.ts](utils/mergeGuestData.ts)). The merge clears local storage even on partial failure — deliberately, to avoid duplicating items on the next login — and reports the failed count to its caller.

### Migrations

7 migrations in [prisma/migrations/](prisma/migrations/), from `20260114090312_tablo_ekleme_mesaji` through `20260720111601_add_showcase_image`. `migration_lock.toml` pins the provider to `postgresql`.

---

## Authentication

**NextAuth v4**, single `CredentialsProvider` ([auth.ts](lib/auth.ts)) — email plus password verified with `bcrypt.compare` against `User.password`. No OAuth provider is configured.

| Aspect | Value |
|---|---|
| Session strategy | JWT |
| Session lifetime | 24 hours (`maxAge: 24 * 60 * 60`) |
| Sign-in page | `/auth/login` |
| Claims carried onto the session | `id`, `name`, `surname`, `email`, `role` |
| Secret | `NEXTAUTH_SECRET` |

### Route protection

[proxy.ts](proxy.ts) — the Next.js 16 middleware file — matches `/admin/:path*`, `/profile/:path*`, `/checkout/:path*`, `/favorites/:path*`, and `/api/admin/:path*`.

- `/admin` itself is deliberately **open** because it renders its own login component. Every deeper admin path requires `token.role === "ADMIN"`.
- `/profile`, `/checkout`, and `/favorites` require any valid token.
- Rejected requests redirect to `/auth/login?callbackUrl=<original path>`.
- The `/api/admin/:path*` matcher is present but **no route exists under `app/api/admin/`.** Admin API routes live at their resource paths (`/api/coupon`, `/api/user/all`, and so on) and enforce the role check inside each handler, not through the matcher.

Because the matcher covers only those five prefixes, every other API route is responsible for its own authorization. The per-route auth column in the [API](#api) section is the authoritative reference.

### Password reset

`/api/account/forgot_password` writes a 32-byte hex `resetToken` with a 30-minute expiry to the `User` row and emails a link built from `NEXT_PUBLIC_BASE_URL`. `/api/account/reset_password` consumes it.

### Internal calls

`x-internal-secret`, valued at `NEXTAUTH_SECRET` ([internalAuth.ts](lib/internalAuth.ts)). `isInternalRequest()` returns `false` whenever `NEXTAUTH_SECRET` is unset, so a missing secret closes the path rather than opening it. This is an internal-call guard only — not a general auth mechanism, and not a substitute for the session check the calling route must already have performed.

---

## Configuration

### `next.config.ts`

Written as `.ts` but exports via `module.exports` (CommonJS).

- **Images**: only `res.cloudinary.com` is allowed as a remote host.
- **Security headers** on every route: `X-Content-Type-Options`, `X-Frame-Options: SAMEORIGIN`, `X-XSS-Protection`, `Referrer-Policy`, `Permissions-Policy` (camera and microphone denied; geolocation and payment restricted to `self`), and HSTS with a two-year max-age and `preload`.
- **CSP**:

  | Directive | Value |
  |---|---|
  | `default-src` | `'self'` |
  | `script-src` | `'self' 'unsafe-inline' 'unsafe-eval'` plus `cdn.iyzipay.com`, `js.iyzipay.com` |
  | `style-src` | `'self' 'unsafe-inline'` plus Google Fonts |
  | `img-src` | `'self' data: blob:` plus Cloudinary, `www.instagram.com` |
  | `connect-src` | `'self'` plus Cloudinary and both iyzico API hosts |
  | `frame-src` | `'none'` |
  | `form-action` | `'self'` |

  `frame-src 'none'` and `form-action 'self'` are consistent with the absence of 3-D Secure. Introducing a 3DS flow would require relaxing both, since the bank's ACS page is framed or posted to cross-origin.

### Other config

| File | Contents |
|---|---|
| [tsconfig.json](tsconfig.json) | `strict: true`, `target: ES2017`, `moduleResolution: bundler`, `noEmit`, `@/*` mapped to the repo root, Next TS plugin |
| [components.json](components.json) | shadcn: style `new-york`, RSC and TSX, base color `slate`, Lucide icons, CSS variables, `app/globals.css` |
| [postcss.config.mjs](postcss.config.mjs) | Single plugin: `@tailwindcss/postcss` |
| [prisma.config.ts](prisma.config.ts) | Schema and migration paths; loads `.env.local` then `.env` **with override** |

---

## Deployment

The repository confirms **Vercel** as a deployment target: [db.ts](lib/db.ts) branches on `process.env.VERCEL` to switch to Prisma Accelerate, and the working tree contains a `.vercel/` directory (gitignored, so not part of the committed repository).

Nothing else about deployment is verifiable here. There is no CI configuration, no Dockerfile, no `vercel.json`, no deploy script, and no infrastructure definition of any kind. Domain, environment provisioning, database hosting, and release process **could not be verified from the repository.**

For a Vercel deployment, `PRISMA_DATABASE_URL` must be set or the app silently falls back to opening a direct `pg` connection per instance — the exact condition the Accelerate branch exists to avoid.

---

## Troubleshooting

**A payment succeeded but no order exists.**
It should not persist: the `catch` around the transaction in [order/route.ts](app/api/order/route.ts) calls `voidIyzicoPayment()` and returns `409`. Check the server log for `Sipariş kaydı oluşturulamadı` followed by `İyzico ödeme iptali başarısız` — the second line means the void itself failed and the charge needs manual reversal in the iyzico panel using the `paymentId`.

**iyzico rejects the request with `errorCode 5062`.**
"The submitted amount must equal the sum of all breakdowns." `buildIyzicoBasket()` derives `price` from the emitted line strings specifically to make this structurally impossible. If it recurs, some code path is adding to the basket or to `price` without going through that function. `tests/pricing.test.ts` carries a regression case for the original occurrence.

**Local development charged a real card.**
`.env.local` overrides `.env` at runtime. If `.env.local` came from `vercel env pull`, it carries production iyzico credentials. The guard in `getIyzicoCredentials()` now throws in this situation — unless `IYZICO_ALLOW_PRODUCTION_IN_DEV=1` is set, which disables it.

**Prisma commands hit a different database than the app does.**
See the precedence table in [Environment Variables](#environment-variables): the CLI and seed scripts let `.env` override `.env.local`, the opposite of the Next.js runtime. Confirm which `DATABASE_URL` actually resolves before running anything destructive.

**`P2037` / too many database connections on Vercel.**
`PRISMA_DATABASE_URL` is not set, so [db.ts](lib/db.ts) fell through to the direct `pg` adapter and every serverless instance opened its own connection.

**Prisma Client not found, or types out of date.**
Run `npx prisma generate`. The client is emitted to `generated/prisma`; imports must target that path, not `@prisma/client`.

**Amounts in the admin panel are 100x off.**
`Order.totalPrice` and `Order.paidPrice` are kuruş integers while `OrderItem` amounts are TRY floats. See [Database](#database).

**Checkout shows one installment total but a different amount is charged.**
The surcharge table exists twice — `INSTALLMENT_RATES` in [iyzico.ts](lib/iyzico.ts) and `installmentOptions` in [stepPayment.tsx](components/modules/checkout/stepPayment.tsx). They must be edited together.

**`/api/remove-bg` returns 429, or `/api/send-mail` rejects a recipient.**
The limiter is in-memory and per-process, so limits are per instance and reset on restart. `/api/send-mail` additionally restricts anonymous callers to `info@ispool.com.tr`.

**Cargo tracking returns test data.**
`HOROZ_API_BASE_URL` defaults to a hardcoded `b2btest.horoz.com.tr` endpoint when unset. Note also the one-lookup-per-hour, per-`requestNumber` in-memory throttle.

**Uploads fail.**
Files go from the browser straight to Cloudinary using a signature from `/api/cloudinary-signature` (admin-only). Verify `CLOUD_NAME`, `API_KEY`, and `API_SECRET`. Cart custom images are additionally capped at 5 MB and must be `image/*`.

---

## Contributing

The repository carries no `CONTRIBUTING.md`, issue or PR templates, CI pipeline, linter, formatter, or commit-message convention, so there is no documented contribution process to describe. Two conventions are nonetheless evident in the code and worth following:

- **Comments and user-facing strings are Turkish.** Comments explain *why* a non-obvious choice was made — several record the incident that motivated the current implementation. Preserve that style; those comments are the only record of some decisions.
- **Changes to the payment amount chain belong in [pricing.test.ts](tests/pricing.test.ts).** The suite is organised around finding IDs (`PAY-001`, `PAY-003`, `PAY-008`) and exists precisely because these bugs were expensive.

---

## License

No `LICENSE` file exists and `package.json` declares no `license` field, so the license **could not be verified from the repository.** `package.json` does set `"private": true`.

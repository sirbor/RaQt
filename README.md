# KDInsight

KDInsight is a data and growth intelligence company helping retail and
multi-branch businesses turn operational data into clear commercial decisions.

This repository powers the KDInsight web experience, including:

- the public marketing site,
- account registration and sign-in,
- administrator workspace tools, and
- the client demo marketplace where use cases can be added to cart and ordered.

## Company Profile

KDInsight combines analytics, product thinking, and implementation support
to help business teams:

- improve sales visibility,
- optimize inventory and branch operations,
- understand customer behavior, and
- prioritize high-impact growth actions.

## Product Areas

### Marketing Website

- Brand messaging, service pillars, and conversion-focused sections.
- "Book A Demo" flows connected to account onboarding.

### Client Demo Marketplace

- Authenticated client page at `/demo`.
- Demo use cases displayed as cards.
- Cart functionality (add, remove, quantity updates).
- Demo order placement with optional notes.

### Admin Workspace

- Dashboard shell and overview.
- User directory and role-based access controls.
- Home page content management tools.

## Current Core Features

- Email/password authentication (client and admin roles).
- Role-aware post-login routing:
  - clients -> `/demo`
  - admins -> `/dashboard`
- Session handling via JWT cookie + session storage metadata.
- Prisma + PostgreSQL persistence for users, content, demo catalog, cart, and orders.

## Tech Stack

- Next.js + React + TypeScript
- SCSS modules
- Prisma ORM
- PostgreSQL

## Local Development

### 1) Install dependencies

```bash
npm install
```

### 2) Configure environment

Create `.env.local` and provide at least:

- `DATABASE_URL`
- `ADMIN_JWT_SECRET` (minimum 32 characters)

### 3) Run database migrations

```bash
npm run db:migrate
```

### 4) Generate Prisma client (if needed)

```bash
npm run db:generate
```

### 5) Start development server

```bash
npm run dev
```

## Useful Scripts

- `npm run dev` - start local dev server
- `npm run build` - production build
- `npm run start` - run production server
- `npm run db:migrate` - apply migrations
- `npm run db:generate` - regenerate Prisma client
- `npm run db:seed` - seed a local login user

## Notes

- Use the account hub (`/sign-in`) to choose register or sign in.
- Client accounts are directed to the demo use-case marketplace.
- Admin accounts are directed to the dashboard and management tools.

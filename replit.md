# Essência Negra - Perfume E-commerce

## Overview

Essência Negra is a luxury perfume e-commerce platform built with a modern full-stack architecture. The application serves as a catalog and lead generation system for an exclusive perfumery brand, allowing customers to browse products, read blog posts, and connect with sales representatives via WhatsApp. The platform follows a dark luxury aesthetic theme with gold accents.

## User Preferences

Preferred communication style: Simple, everyday language.

## System Architecture

### Frontend Architecture
- **Framework**: React 18 with TypeScript
- **Routing**: Wouter (lightweight React router)
- **State Management**: TanStack React Query for server state caching and synchronization
- **Styling**: Tailwind CSS v4 with custom dark luxury theme using CSS variables
- **UI Components**: shadcn/ui component library (New York style) with Radix UI primitives
- **Animations**: Framer Motion for page transitions and micro-interactions
- **Build Tool**: Vite with custom plugins for Replit integration

### Backend Architecture
- **Runtime**: Node.js with Express.js
- **Language**: TypeScript with ESM modules
- **API Style**: RESTful JSON API under `/api` prefix
- **Development**: Hot module replacement via Vite middleware
- **Production**: Static file serving from built assets

### Data Layer
- **ORM**: Drizzle ORM with PostgreSQL dialect
- **Database**: PostgreSQL (Replit-provisioned or Supabase-compatible)
- **Schema Validation**: Zod with drizzle-zod integration for type-safe schemas
- **Migrations**: Drizzle Kit for schema push operations

### Key Design Patterns
- **Monorepo Structure**: Client, server, and shared code in single repository
- **Shared Schema**: Database schemas and validation defined once in `/shared/schema.ts`, used by both frontend and backend
- **Storage Abstraction**: `IStorage` interface in `/server/storage.ts` allows swapping database implementations
- **Path Aliases**: `@/` for client code, `@shared/` for shared modules

### Data Models
- **Products**: Perfume catalog with name, brand, price, image, category, and fragrance notes
- **Leads**: Customer contact information (name, phone) for WhatsApp-based sales
- **ViewedProducts**: Tracking which products each lead has viewed
- **BlogPosts**: Content marketing posts linked to products

## External Dependencies

### Third-Party Services
- **WhatsApp Integration**: Direct links to WhatsApp for customer communication (no API integration, uses wa.me URLs)
- **Google Fonts**: Playfair Display (headings) and Inter (body text)

### Database
- **PostgreSQL**: Primary database via `DATABASE_URL` environment variable
- **Connection**: Uses `pg` driver with connection pooling
- **Alternative**: Supabase connection string support documented in `/server/db.ts`

### Key NPM Packages
- **UI**: Full shadcn/ui component set with Radix primitives
- **Forms**: react-hook-form with @hookform/resolvers for Zod validation
- **Data Fetching**: @tanstack/react-query for caching and mutations
- **Date Handling**: date-fns for formatting
- **Build**: esbuild for server bundling, Vite for client

### Environment Variables Required
- `DATABASE_URL`: PostgreSQL connection string (required)
- `NODE_ENV`: development/production mode
# Web3 Stack Builder

## Overview

A Web3 stack builder application that helps users select compatible products based on their use case (trading, gaming, payments). The app demonstrates The Grid's product relationship data by visualizing compatibility between selected products and driving profile claims.

**Purpose:** Interactive tool for discovering and building Web3 technology stacks with real-time compatibility scoring

**Key Features:**
- Guided use case selection (Trading, Gaming, Payments)
- Category-based product selection with progressive disclosure
- Real-time compatibility visualization
- Stack export and sharing capabilities
- The Grid API integration for product and relationship data

## User Preferences

Preferred communication style: Simple, everyday language.

## System Architecture

### Frontend Architecture

**Framework:** React with TypeScript via Vite
- Single-page application with step-based navigation
- Client-side routing handled through component state (use-case → product-selection → results)
- No traditional router; uses conditional rendering based on application state

**State Management:** 
- Zustand for global stack state (`useStackStore`)
- Manages selected use case, products, category progression, and compatibility calculations
- React Query (@tanstack/react-query) for server state and API data fetching

**UI Component System:**
- shadcn/ui with Radix UI primitives
- Tailwind CSS for styling with custom design tokens
- Component library follows "New York" style variant
- Custom CSS variables for theming (light/dark mode support)

**Key Design Patterns:**
- Progressive disclosure through stepped category selection
- Information density optimized for technical users
- Accessibility-first with Radix UI primitives
- Responsive design with mobile-first breakpoints

### Backend Architecture

**Server:** Express.js with TypeScript
- RESTful API architecture
- Hot module replacement via Vite in development
- Static file serving for production builds

**API Design:**
- GraphQL proxy to The Grid's beta API (beta.node.thegrid.id)
- Server-side GraphQL queries for product data by type
- Product relationship data for compatibility scoring

**Data Flow:**
1. Client requests products by category (product type IDs)
2. Server queries The Grid GraphQL API
3. Response includes product metadata, deployments, assets, and relationships
4. Client calculates compatibility based on shared chains and relationships

### Data Storage

**Current Implementation:** In-memory storage (MemStorage class)
- User data stored in Map structure
- Suitable for development/demo purposes
- No persistence layer currently active

**Database Schema (Drizzle ORM):**
- Configured for PostgreSQL via Neon Database
- Schema defined in `shared/schema.ts`
- Migration support via drizzle-kit
- Database not actively used in current implementation

**Note:** Application is data-read focused (consuming The Grid API), with minimal need for persistent storage beyond potential user sessions.

### External Dependencies

**The Grid API:**
- **Endpoint:** https://beta.node.thegrid.id/v1/graphql
- **Purpose:** Source of truth for Web3 product data, relationships, and compatibility
- **Data Retrieved:** Products by type, deployments, assets, relationship scores
- **Authentication:** None required (public beta endpoint)

**Neon Database:**
- **Service:** PostgreSQL serverless database
- **Client:** @neondatabase/serverless
- **Current Status:** Configured but not actively used
- **Purpose:** Prepared for future user data persistence if needed

**Third-Party UI Libraries:**
- Radix UI components for accessible primitives
- Lucide React for iconography
- html2canvas for stack visualization export
- Embla Carousel for any carousel needs

**Development Tools:**
- Vite for build tooling and dev server
- Replit-specific plugins for runtime error handling and cartography
- ESBuild for server-side bundling in production

**Design System:**
- Google Fonts (Inter) for typography
- Tailwind CSS with custom configuration
- CSS variables for dynamic theming
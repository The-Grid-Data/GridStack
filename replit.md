# Web3 Stack Builder V1

## Overview

A Web3 stack builder application that helps users select compatible blockchain products based on their use case (trading, gaming, payments, infrastructure). The app demonstrates The Grid's product relationship data by visualizing compatibility between selected products and providing real-time compatibility scoring.

**Version:** 1.0.0  
**Status:** Production-ready MVP

**Purpose:** Interactive tool for discovering and building Web3 technology stacks with real-time compatibility scoring based on The Grid's product graph data.

**Key Features:**
- 5 guided use case templates (Trading, Gaming, Payments, DeFi Infrastructure, Developer Tools)
- Category-based product selection with progressive disclosure
- Real-time compatibility visualization with graph relationships
- Connection score ranking powered by The Grid's graph data
- PNG export capability for sharing stack configurations
- Dark mode default theme with toggle support
- Keyboard navigation (Enter key to advance)
- Visual consistency with square product icons

## User Preferences

Preferred communication style: Simple, everyday language.

## Recent Changes (V1)

**Date:** October 29, 2025

### Core Functionality
1. **Connection Score Sorting**
   - Fixed critical GraphQL API data extraction bug
   - Server now properly extracts `theGridRanking[0]` and `profileInfos[0]` from array responses
   - Products correctly sorted by descending connection score (Ethereum: 1201, Solana: 1195, etc.)

2. **Dark Mode Implementation**
   - Default theme set to dark mode for better technical user experience
   - ThemeProvider with localStorage persistence
   - Global theme toggle in app header (Sun/Moon icon)
   - Seamless light/dark mode switching

3. **Keyboard Navigation**
   - Added Enter key handler in ProductSelection step
   - Press Enter after selecting a product to auto-advance to next category
   - Improves workflow efficiency for power users

4. **Visual Design Consistency**
   - Changed from rectangular logos to square icons across all components
   - Updated ProductCard, StackSummary, CompatibilityGraph, ProductDetailModal
   - Better visual alignment and professional appearance

### Code Quality
- Removed debug badge component from production build
- Clean codebase ready for V1 release
- Production-ready error handling

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
- ThemeProvider for dark/light mode state with localStorage persistence

**UI Component System:**
- shadcn/ui with Radix UI primitives
- Tailwind CSS for styling with custom design tokens
- Component library follows "New York" style variant
- Custom CSS variables for theming (dark mode default)

**Key Design Patterns:**
- Progressive disclosure through stepped category selection
- Information density optimized for technical users
- Accessibility-first with Radix UI primitives
- Responsive design with mobile-first breakpoints
- Keyboard navigation support (Enter key handler)

**Key Components:**
- `UseCaseSelection.tsx` - Initial use case template picker
- `ProductSelection.tsx` - Category-by-category product selector with Enter key support
- `CompatibilityResults.tsx` - Final stack visualization and export
- `CompatibilityGraph.tsx` - Visual graph showing product relationships
- `ProductCard.tsx` - Reusable card with connection score badge, using icons
- `ThemeProvider.tsx` - Dark/light mode state management
- `ThemeToggle.tsx` - Sun/Moon toggle button

### Backend Architecture

**Server:** Express.js with TypeScript
- RESTful API architecture
- Hot module replacement via Vite in development
- Static file serving for production builds

**API Design:**
- GraphQL proxy to The Grid's beta API
- Server-side GraphQL queries for product data by type
- Product relationship data for compatibility scoring
- **Critical:** Server transforms array responses (`theGridRanking[0]`, `profileInfos[0]`) to objects

**API Endpoints:**
- `GET /api/products/:typeId` - Fetch products by category type ID
- Returns transformed product data with connection scores

**Data Transformation:**
```typescript
// Server extracts first element from arrays before sending to client
theGridRanking: ranking.theGridRanking?.[0] || null
profileInfos: profileInfos[0] || {}
```

**Data Flow:**
1. Client requests products by category (product type IDs)
2. Server queries The Grid GraphQL API at `https://beta.node.thegrid.id/graphql`
3. Server extracts `theGridRanking[0]` and `profileInfos[0]` from array responses
4. Response includes product metadata, deployments, assets, and transformed rankings
5. Client sorts by connection score and calculates compatibility based on shared chains/assets

### Product Type IDs (The Grid API)

The application uses these specific product type IDs:

- **Wallet:** 692
- **DEX (Decentralized Exchange):** 25
- **Bridge:** 23
- **Game:** 36
- **NFT Marketplace:** 37
- **RPC (Remote Procedure Call):** 305
- **Developer Tools:** 3607

### Compatibility Scoring Algorithm

**Client-Side Calculation:**
1. Compare selected products pairwise
2. **Shared Chains:** 20 points per matching blockchain deployment
3. **Shared Assets:** 10 points per matching supported asset
4. **Compatibility Threshold:** 30+ points = compatible

**Example:**
- Product A supports: Ethereum, Solana, USDC, ETH
- Product B supports: Ethereum, Bitcoin, USDC, BTC
- Score: Ethereum (20) + USDC (10) = 30 points → Compatible ✓

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
- **Endpoint:** `https://beta.node.thegrid.id/graphql` (NOT `/v1/graphql`)
- **Purpose:** Source of truth for Web3 product data, relationships, and compatibility
- **Data Retrieved:** Products by type, deployments, assets, relationship scores
- **Authentication:** None required (public beta endpoint)
- **Critical Data Structures:**
  - `theGridRanking` - Array containing connection scores (server extracts `[0]`)
  - `profileInfos` - Array containing product metadata (server extracts `[0]`)
  - `productDeploymentRelationships` - Chain deployments for compatibility
  - `productAssetRelationships` - Asset support for compatibility

**Neon Database:**
- **Service:** PostgreSQL serverless database
- **Client:** @neondatabase/serverless
- **Current Status:** Configured but not actively used
- **Purpose:** Prepared for future user data persistence if needed

**Third-Party UI Libraries:**
- Radix UI components for accessible primitives
- Lucide React for iconography
- html2canvas for stack visualization export (PNG)
- Framer Motion for animations

**Development Tools:**
- Vite for build tooling and dev server
- Replit-specific plugins for runtime error handling and cartography
- ESBuild for server-side bundling in production
- TypeScript for type safety across frontend and backend

**Design System:**
- Google Fonts (Inter) for typography
- Tailwind CSS with custom configuration
- CSS variables for dynamic theming (dark mode default)
- Custom design guidelines in `design_guidelines.md`

## Technical Implementation Notes

### Image Handling
- **Preference:** Product icons (square) over logos (rectangular)
- **Fallback:** If no icon exists, use logo, then fall back to initials badge
- **Components using images:** ProductCard, StackSummary, CompatibilityGraph, ProductDetailModal

### Theme System
- **Default:** Dark mode
- **Storage:** Theme preference saved to localStorage
- **Toggle:** Global theme toggle button in app header
- **Implementation:** ThemeProvider manages `theme` state and syncs with DOM `class="dark"`

### Performance Optimizations
- React Query caching for product data
- Zustand state management for instant UI updates
- Client-side compatibility calculations (no server round-trips)
- Lazy loading of components where appropriate

## Future Enhancements (Post-V1)

Potential features for future versions:
- Saved stacks with user accounts
- Stack sharing via unique URLs
- Community voting on popular stacks
- Integration with The Grid's relationship API for dynamic compatibility
- Advanced filtering (by chain, by asset, by connection score range)
- Stack comparison view
- Export to multiple formats (JSON, PDF, etc.)

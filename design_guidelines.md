# Design Guidelines: Web3 Stack Builder

## Design Approach

**Selected Approach:** Design System - shadcn/ui with Radix UI primitives
**Justification:** Utility-focused technical tool requiring information density, clarity, and developer-friendly patterns. The PRD specifies shadcn/ui, which provides accessible, customizable components ideal for data-heavy interfaces.

**Key Design Principles:**
1. **Clarity First** - Technical accuracy and readability trump decoration
2. **Guided Flow** - Progressive disclosure through stepped category selection
3. **Data Density** - Pack meaningful information without overwhelming
4. **Visual Feedback** - Instant compatibility scoring with clear indicators

---

## Typography

**Font System:** Inter (via Google Fonts) for clean, technical readability
- **Display (Use Case Headers):** text-4xl md:text-5xl, font-bold, tracking-tight
- **Section Headers:** text-2xl md:text-3xl, font-semibold
- **Card Titles:** text-lg font-semibold
- **Body Text:** text-sm md:text-base, font-normal, leading-relaxed
- **Metadata/Scores:** text-xs md:text-sm, font-medium, uppercase tracking-wide
- **Descriptions:** text-sm, leading-normal, max 2-3 lines with ellipsis

---

## Layout System

**Spacing Primitives:** Tailwind units of **2, 4, 6, 8, 12, 16, 24**
- Micro spacing (icons, badges): p-2, gap-2
- Card internal padding: p-4 md:p-6
- Section spacing: py-12 md:py-16, px-4 md:px-6
- Major gaps: gap-6 md:gap-8
- Page margins: max-w-7xl mx-auto

**Grid System:**
- Use Case Cards: grid-cols-1 md:grid-cols-2 lg:grid-cols-3, gap-6
- Product Cards: grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4, gap-4 md:gap-6
- Category Selection: Single column flow with stepped progression
- Compatibility Graph: Full-width container with max-w-5xl centering

---

## Component Library

### Navigation/Header
- Fixed top bar with logo, "Build Your Stack" title
- Progress indicator showing current step (1/3, 2/3, 3/3)
- Reset/Start Over button (ghost variant)
- Height: h-16, border-b with subtle divider

### Use Case Selection Cards
- Large interactive cards (min-h-[180px])
- Icon + Title + Description layout
- Hover state with subtle lift (transform, shadow)
- Stack icon indicators showing required/optional categories
- Grid layout with equal heights

### Product Cards
- Compact card design (aspect-ratio for consistency)
- Profile logo/icon at top (rounded, 48px-64px)
- Product name, sector badge, connection score badge
- Truncated description (2 lines)
- "View Details" link (text-sm, underlined on hover)
- Selected state: border accent, checkmark icon overlay
- Connection score badge: absolute top-right, rounded-full px-2 py-1

### Category Selection Interface
- Sidebar showing selected stack products (sticky on desktop)
- Main content area with category header + product grid
- Category progress: "1/3 Required", "Optional" labels
- Filter controls: "Most Popular" toggle, search input
- "Continue" button appears when required selections complete

### Compatibility Visualization
- Central graph using React Flow or similar
- Nodes: Selected product cards (smaller, icon + name)
- Edges: Connection lines with strength indicators
- Legend: Green (Compatible 30+), Yellow (Partial 10-29), Red (Incompatible)
- Compatibility scores shown as floating badges on edges
- "Why compatible?" tooltips on edge hover showing shared chains/assets

### Product Detail Modal
- Full-screen modal (md:max-w-3xl centered)
- Header: Large logo, product name, sector, connection score
- Tabs: Overview | Compatibility | Technical Details
- Overview: Full description, launch date, supported chains/assets
- Compatibility: List of compatible products from current stack
- Technical: Smart contract addresses, deployment chains, URLs
- Footer: "Add to Stack" / "Remove from Stack" action buttons

### Stack Summary/Export Panel
- Sidebar or bottom sheet showing complete stack
- Product thumbnails in vertical list
- Overall compatibility score (aggregate)
- Export actions: "Export as PNG", "Share Link", "Start Over"
- "Claim Your Profile" CTA with emphasis (larger, primary variant)

### Badges & Indicators
- Connection Score: Pill shape, text-xs font-medium, icon + number
- Sector Tags: Rounded corners, text-xs, subtle styling
- Required/Optional: Text-xs uppercase tracking-wide
- Compatibility Status: Icon + label (✅ Compatible, ⚠️ Partial, ❌ Incompatible)

### Forms & Inputs
- Search: Full-width input with search icon prefix, rounded borders
- Filters: Checkbox group or segmented controls for "Most Popular"
- All inputs: Consistent height h-10, padding px-4

---

## Page Layouts

### 1. Landing/Use Case Selection (Full Page)
- Hero section with gradient/pattern background (h-[40vh] min)
- Centered title: "Build Your Web3 Stack"
- Subtitle explaining the tool
- 5 use case cards in responsive grid below
- Each card shows icon, title, required categories preview

### 2. Product Selection Flow (Split Layout)
- Left sidebar (w-80 hidden lg:block): Stack summary, current selections
- Main area: Category header + product grid
- Top: Progress bar spanning full width
- Bottom: Floating action bar with "Back" and "Continue" buttons

### 3. Compatibility Results (Centered Layout)
- Full-width graph visualization (max-w-6xl)
- Above graph: Overall compatibility score with explanation
- Below graph: Detailed breakdown cards showing all relationships
- Right side: Export options panel

### 4. Mobile Adaptations
- Stack sidebar becomes bottom drawer (swipe up to view)
- Product grid: Single column on mobile
- Graph: Simplified view with list fallback
- Modal: Full-screen on mobile

---

## Animations

**Minimal and purposeful:**
- Page transitions: Subtle fade (200ms)
- Card hover: Scale 1.02 + shadow (150ms ease-out)
- Selection state: Checkmark fade-in (200ms)
- Modal open/close: Slide + fade (250ms)
- Compatibility graph: Stagger node entrance (50ms delay each)
- **No** parallax, scroll-triggered, or decorative animations

---

## Images

**Icon Library:** Lucide React (via shadcn/ui)
- Use case icons: Wallet, GameController, CreditCard, Image, Code
- UI icons: Check, X, ChevronRight, Search, Download, Share, Info

**Product Logos:** Fetched from API (`profileInfos.logo`)
- Display in rounded containers (rounded-lg or rounded-full)
- Fallback: First letter of product name in monogram

**No Hero Images** - This is a utility tool, launch directly into use case selection

---

## Responsive Breakpoints

- Mobile: < 640px (sm) - Single column, bottom sheets
- Tablet: 640-1024px (md/lg) - Two-column grids, condensed sidebar
- Desktop: > 1024px (lg+) - Full multi-column layouts, persistent sidebar
# Store.shahabned.xyz - Digital Art Gallery & E-commerce Platform

A sophisticated digital art gallery and e-commerce platform built with SvelteKit, featuring seamless integration with WooCommerce and Stripe for a robust shopping experience.

## Core Features

### 🎨 Gallery & Exhibition Features
- **Interactive Image Gallery**
  - Touch-friendly navigation
  - Zoom functionality on hover
  - Modal view for detailed inspection
  - Lazy loading with fallback images
  - Mobile-responsive design
- **Artist Showcases**
  - Dynamic artist portfolio pages
  - Latest exhibition highlights
  - Category-based navigation
  - Featured artist sliders

### 🛍️ E-commerce Integration
- **WooCommerce Integration**
  - Automated order processing
  - Order status management
  - Product variation support
  - Inventory tracking
- **Shopping Cart**
  - Persistent local storage
  - Real-time price updates
  - Sliding cart interface
  - Product quantity management
- **Secure Checkout**
  - Stripe payment integration
  - Form validation
  - Order confirmation system
  - Shipping calculation

### 🔧 Technical Features
- **SEO Optimization**
  - Schema.org implementation
  - Dynamic meta tags
  - OpenGraph integration
  - Canonical URL management
  - Automated sitemap generation
- **Performance**
  - Image lazy loading
  - Touch event optimization
  - Persistent state management
  - Mobile-first responsive design

## Tech Stack

### Frontend
- **Framework**: SvelteKit
- **Styling**: 
  - Tailwind CSS with plugins:
    - @tailwindcss/aspect-ratio
    - @tailwindcss/container-queries
    - @tailwindcss/forms
    - @tailwindcss/typography
  - Custom component styles
- **UI Components**:
  - Custom Svelte components
  - Svelte-Heros icons
  - Modal system
  - Interactive sliders

### Backend Integration
- **E-commerce**: 
  - WooCommerce REST API with caching
  - Stripe Payment Processing
  - CreativeHub API integration
- **Data Management**: 
  - Tiered caching system:
    - Products: 5 minutes
    - Variations: 5 minutes
    - Artists: 30 minutes
    - Exhibitions: 1 hour
    - Media: 24 hours
  - Optimized preview fetching
  - Error handling with retries
- **State Management**: 
  - Svelte stores
  - Local storage persistence
- **Build Tools**: 
  - Vite
  - PostCSS
  - ESLint & Prettier

## Project Structure

```
src/
├── lib/
│   ├── components/           # Reusable components
│   │   ├── base/            # Base UI components
│   │   ├── forms/           # Form components
│   │   ├── modal/           # Modal system
│   │   ├── navigation/      # Navigation components
│   │   └── slider/          # Slider components
│   ├── stores/              # State management
│   │   ├── cartStore.js     # Shopping cart logic
│   │   └── userInfoStore.js # User information
│   ├── utils/               # Utility functions
│   │   ├── checkoutUtils.js # Checkout logic
│   │   ├── mediaUtils.js    # Media handling
│   │   ├── seoUnified.js    # SEO management
│   │   └── sliderHelper.js  # Slider interactions
│   └── styles/              # CSS styles
└── routes/                  # SvelteKit routes
```

## Getting Started

### Prerequisites
- Node.js 20 or higher
- npm
- Stripe account
- WooCommerce installation with REST API access

### Installation

1. Clone the repository:
```bash
git clone https://github.com/yourusername/store.shahabned.xyz.git
cd store.shahabned.xyz
```

2. Install dependencies:
```bash
npm install
```

3. Configure environment variables:
```env
# WordPress/WooCommerce
VITE_WP_API_URL=your_wordpress_url
VITE_WOOCOMMERCE_CONSUMER_KEY=your_consumer_key
VITE_WOOCOMMERCE_CONSUMER_SECRET=your_consumer_secret

# Payment Processing
VITE_STRIPE_SECRET_KEY=your_stripe_secret_key
VITE_STRIPE_PUBLISHABLE_KEY=your_stripe_publishable_key

# CreativeHub Integration
VITE_CREATIVEHUB_API_KEY=your_creativehub_api_key

# Site Configuration
PUBLIC_URL=your_public_url
```

### Development

Start the development server:
```bash
npm run dev
```

### Available Scripts
- `npm run dev` - Start development server
- `npm run build` - Build for production
- `npm run preview` - Preview production build
- `npm run lint` - Lint code
- `npm run format` - Format code

## Key Features Implementation

### Media Management System
The media system features multiple components working together:

**Image Gallery** (`ImageGallery.svelte`):
- Touch event handling for mobile
- Zoom functionality on hover
- Modal view for detailed inspection
- Lazy loading with fallback images
- Responsive grid layout

**Slider System** (`sliderHelper.js`):
- Smooth scrolling animation
- Mouse-based navigation
- Touch event handling
- Performance-optimized animation frames
- Automatic cleanup

**Media Utilities** (`mediaUtils.js`):
- Smart image loading with fallbacks
- URL generation for products/artists/exhibitions
- Media fingerprint handling
- SEO-friendly slug generation
- Consistent URL structure

### Cart System
Implemented in `cartStore.js`:
- Persistent local storage
- Real-time price updates
- Product variation support
- Quantity management
- Sliding cart interface

### Checkout Process
Managed by `checkoutUtils.js`:
- Form validation
- WooCommerce order creation
- Stripe payment processing
- Order confirmation handling
- Shipping calculation

### SEO Implementation
Unified SEO system (`seoUnified.js`):
- Dynamic meta tag generation
- Schema.org data structure
- OpenGraph integration
- Canonical URL management
- Page-specific optimization

### Product Filtering System
Implemented in `ProductFilter.svelte`:
- Multi-criteria filtering:
  - Categories
  - Tags
  - Artists
  - Price ranges
- Advanced sorting options:
  - Newest first
  - Price: Low to High
  - Price: High to Low
- Pagination features:
  - Configurable items per page (12/24/48/96)
  - Dynamic page navigation
- Real-time filtering:
  - Instant updates
  - Active filter indicators
  - Price range sliders
- Responsive grid layout
- Animated transitions

## Deployment & Performance

### Nixpack Deployment
The application uses Nixpack for standardized deployment:
```toml
[phases.install]
cmd = "npm install"

[phases.build]
cmd = "npm run build"

[phases.start]
cmd = "vite preview"
```

### API Performance
The API layer implements a sophisticated caching strategy:
- **Tiered Caching**:
  - Products and variations: 5-minute cache
  - Artists: 30-minute cache
  - Exhibitions: 1-hour cache
  - Media: 24-hour cache
- **Error Handling**:
  - Automatic retries
  - Fallback responses
  - Detailed error logging
- **Performance Optimizations**:
  - Batch requests
  - Preview data fetching
  - Response compression

### Deployment Checklist
- Configure environment variables
- Set up SSL certificates
- Configure webhooks:
  - WooCommerce order webhooks
  - Stripe payment webhooks
  - CreativeHub integration webhooks
- Set up monitoring:
  - Server health checks
  - API performance metrics
  - Error tracking
- Configure CDN:
  - Static asset caching
  - Image optimization
  - Geographic distribution

## License

This project is proprietary software. All rights reserved.

# Store.shahabned.xyz - Digital Art Gallery & E-commerce Platform

A sophisticated digital art gallery and e-commerce platform built with SvelteKit, featuring virtual exhibitions, 3D art experiences, and integrated e-commerce capabilities. This platform bridges traditional art galleries with digital commerce through immersive virtual experiences.

## Core Features

### 🎨 Artist & Exhibition Platform
- **Artist Showcases**
  - Dynamic artist portfolio pages (`/artist/[title]`)
  - Exhibition history and biography
  - Contact integration via modal forms
  - Image galleries with high-resolution support
- **Virtual Exhibitions**
  - Interactive 3D Fauna exhibition
  - Custom terrain generation system
  - Dynamic lighting and atmospheric effects
  - Optimized Three.js integration
  - Mobile-responsive 3D rendering

### 🛍️ E-commerce Features
- **Shop System**
  - Product catalog with filtering
  - Category-based navigation
  - Featured products slider
  - Detailed product pages
  - High-resolution image galleries
- **Shopping Cart**
  - Sliding cart interface
  - Persistent storage
  - Real-time updates
  - Product variations support
  - Quantity management

### 🔧 Technical Features
- **Performance Optimizations**
  - Lazy-loaded components
  - Optimized image loading
  - Dynamic imports
  - Mobile-first responsive design
- **SEO & Accessibility**
  - Dynamic meta tags
  - OpenGraph integration
  - Automated sitemap generation
  - Structured data implementation
- **User Experience**
  - Loading indicators
  - Smooth transitions
  - Responsive layouts
  - Interactive sliders

## Tech Stack

### Frontend
- **Framework**: SvelteKit 2.0
- **Styling**: 
  - Tailwind CSS with custom plugins
  - Custom component styles
  - Responsive design system
- **3D Graphics**: 
  - Three.js
  - Custom terrain generation
  - Optimized 3D rendering
- **UI Components**:
  - Custom Svelte components
  - Svelte-Heros icons
  - Modal system
  - Slider components

### Backend & Integration
- **Payment Processing**: Stripe
- **State Management**: Svelte stores
- **Build Tools**: 
  - Vite
  - PostCSS
  - TypeScript
  - ESLint & Prettier

## Project Structure

```
src/
├── lib/                      # Library code
│   ├── components/           # Reusable components
│   │   ├── base/            # Base components
│   │   ├── modal/           # Modal system
│   │   ├── navigation/      # Navigation components
│   │   └── slider/          # Slider components
│   ├── exhbitions/          # Exhibition features
│   │   └── fauna/           # Fauna 3D exhibition
│   │       ├── 3d/          # Three.js components
│   │       └── utils/       # Exhibition utilities
│   ├── stores/              # State management
│   ├── styles/              # CSS styles
│   │   ├── components/      # Component styles
│   │   └── pages/          # Page-specific styles
│   └── utils/               # Utility functions
└── routes/                  # SvelteKit routes
    ├── artist/              # Artist pages
    ├── exhibitions/         # Exhibition pages
    ├── shop/                # Shop pages
    └── checkout/            # Checkout process
```

## Getting Started

### Prerequisites
- Node.js 20 or higher
- npm (Node Package Manager)
- Stripe account for payments

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

3. Set up environment variables:
Create a `.env` file:
```env
STRIPE_SECRET_KEY=your_stripe_secret_key
STRIPE_PUBLISHABLE_KEY=your_stripe_publishable_key
PUBLIC_URL=your_public_url
```

### Development

Start the development server:
```bash
npm run dev
```
Access the site at `http://localhost:5173`

### Available Scripts
- `npm run dev` - Development server with hot reloading
- `npm run build` - Production build
- `npm run preview` - Preview production build
- `npm run check` - TypeScript checks
- `npm run lint` - Code linting
- `npm run format` - Code formatting

## Key Components

### Virtual Exhibition System
The Fauna exhibition (`/lib/exhibitions/fauna/`) features:
- Interactive 3D environment
- Custom terrain generation
- Dynamic lighting
- Atmospheric effects
- Performance-optimized rendering
- Mobile responsiveness

### Cart System
Implemented in `/lib/stores/cartStore.js`:
- Persistent localStorage storage
- Real-time updates
- Product variation handling
- Quantity management
- Sliding cart interface

### Product Management
Features include:
- Advanced filtering
- Category organization
- Image galleries
- Variation support
- Price management
- Inventory tracking

## Deployment

1. Build the application:
```bash
npm run build
```

2. Preview the build:
```bash
npm run preview
```

### Deployment Checklist
- Configure environment variables
- Set up SSL certificates
- Configure Stripe webhooks
- Set up monitoring
- Configure CDN (recommended)
- Set up backup systems

## Contributing

1. Fork the repository
2. Create your feature branch
3. Commit your changes
4. Push to the branch
5. Create a Pull Request

### Development Guidelines
- Follow TypeScript standards
- Use component-based architecture
- Implement responsive design
- Follow SEO best practices
- Write clear documentation

## Support

For support:
- Email: support@shahabned.xyz
- GitHub Issues: [Create an issue](https://github.com/yourusername/store.shahabned.xyz/issues)

## License

This project is proprietary software. All rights reserved.

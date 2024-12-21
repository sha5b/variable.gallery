/**
 * Gallery information used across SEO and Schema generation
 */
export const GALLERY_INFO = {
    name: 'variable.gallery',
    baseUrl: 'https://variable.gallery',
    address: {
        locality: 'Berlin',
        country: 'DE'
    },
    openingHours: 'Mo-Su 00:00-24:00',
    telephone: '+49000000000',
    social: {
        twitter: 'https://twitter.com/variablegallery',
        instagram: 'https://instagram.com/variable.gallery'
    }
};

/**
 * Page type definitions for SEO and Schema generation
 */
export const PAGE_TYPES = {
    HOME: 'home',
    SHOP: 'shop',
    ARTIST: 'artist',
    PRODUCT: 'product',
    EXHIBITIONS: 'exhibitions',
    CART: 'cart',
    CHECKOUT: 'checkout'
};

/**
 * Default metadata configuration
 */
export const DEFAULT_META = {
    title: GALLERY_INFO.name,
    description: 'Digital art gallery showcasing unique artworks and NFTs',
    keywords: [
        'digital art',
        'NFT',
        'virtual gallery',
        'digital artists',
        'art collection'
    ],
    openGraph: {
        image: `${GALLERY_INFO.baseUrl}/og-image.jpg`,
        url: GALLERY_INFO.baseUrl,
        type: 'website'
    }
};

/**
 * Page-specific metadata configurations
 */
export const PAGE_CONFIGS = {
    [PAGE_TYPES.HOME]: {
        title: `${GALLERY_INFO.name} | Digital Gallery Space`,
        description: 'Discover unique digital artworks, NFTs, and experimental media in our virtual gallery. Experience art in a new dimension.',
        keywords: [
            'digital artwork',
            'virtual exhibition',
            'contemporary art',
            'crypto art',
            'digital collectibles'
        ],
        openGraph: {
            url: GALLERY_INFO.baseUrl,
            type: 'website'
        },
        schemaType: 'ArtGallery'
    },
    [PAGE_TYPES.SHOP]: {
        title: `Shop Digital Art | ${GALLERY_INFO.name}`,
        description: 'Browse and collect unique digital artworks, NFTs, and experimental media. Discover limited editions and original pieces from emerging and established artists.',
        keywords: [
            'buy digital art',
            'collect NFTs',
            'digital art marketplace',
            'limited editions',
            'original artwork'
        ],
        openGraph: {
            url: `${GALLERY_INFO.baseUrl}/shop`,
            type: 'website'
        },
        schemaType: 'CollectionPage'
    },
    [PAGE_TYPES.ARTIST]: {
        title: `Artists | ${GALLERY_INFO.name}`,
        description: 'Discover our curated selection of digital artists. Explore their virtual exhibitions, NFT collections, and experimental media artworks.',
        keywords: [
            'digital artists',
            'NFT creators',
            'virtual exhibitions',
            'digital art creators',
            'experimental artists'
        ],
        openGraph: {
            url: `${GALLERY_INFO.baseUrl}/artist`,
            type: 'website'
        },
        schemaType: 'CollectionPage'
    },
    [PAGE_TYPES.PRODUCT]: {
        title: `Digital Artwork | ${GALLERY_INFO.name}`,
        description: 'Explore and collect this unique digital artwork. Experience the intersection of art and technology.',
        keywords: [
            'digital artwork',
            'NFT collection',
            'digital art piece',
            'art collecting',
            'digital creation'
        ],
        openGraph: {
            url: `${GALLERY_INFO.baseUrl}/product`,
            type: 'Product'
        },
        schemaType: 'Product'
    },
    [PAGE_TYPES.EXHIBITIONS]: {
        title: `Exhibitions | ${GALLERY_INFO.name}`,
        description: 'Explore our curated digital art exhibitions featuring innovative artists and experimental media. Experience virtual and physical exhibitions.',
        keywords: [
            'digital art exhibitions',
            'virtual exhibitions',
            'art shows',
            'gallery exhibitions',
            'digital installations'
        ],
        openGraph: {
            url: `${GALLERY_INFO.baseUrl}/exhibitions`,
            type: 'website'
        },
        schemaType: 'CollectionPage'
    },
    [PAGE_TYPES.CART]: {
        title: `Cart | ${GALLERY_INFO.name}`,
        description: 'Review your selected digital artworks and NFTs. Complete your purchase of unique pieces.',
        keywords: [
            'digital art purchase',
            'NFT shopping cart',
            'buy digital art',
            'art collection',
            'checkout'
        ],
        openGraph: {
            url: `${GALLERY_INFO.baseUrl}/cart`,
            type: 'website'
        },
        schemaType: 'ItemPage'
    },
    [PAGE_TYPES.CHECKOUT]: {
        title: `Checkout | ${GALLERY_INFO.name}`,
        description: 'Securely complete your purchase of digital artworks and NFTs.',
        keywords: [
            'secure checkout',
            'digital art purchase',
            'NFT payment',
            'art transaction',
            'buy artwork'
        ],
        openGraph: {
            url: `${GALLERY_INFO.baseUrl}/checkout`,
            type: 'website'
        },
        schemaType: 'CheckoutPage'
    }
};

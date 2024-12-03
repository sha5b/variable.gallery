import { browser } from '$app/environment';

// Cache storage
const cache = {
    data: new Map(),
    timestamp: new Map()
};

const CACHE_DURATION = {
    products: 5 * 60 * 1000,      // 5 minutes
    variations: 5 * 60 * 1000,    // 5 minutes
    artists: 30 * 60 * 1000,      // 30 minutes
    exhibitions: 60 * 60 * 1000,  // 1 hour
    media: 24 * 60 * 60 * 1000    // 24 hours
};

async function fetchWithCache(cacheKey, fetchFunction, type = 'products') {
    const cachedData = cache.data.get(cacheKey);
    const cachedTime = cache.timestamp.get(cacheKey);
    
    if (cachedData && cachedTime && (Date.now() - cachedTime < CACHE_DURATION[type])) {
        return cachedData;
    }

    const data = await fetchFunction();
    cache.data.set(cacheKey, data);
    cache.timestamp.set(cacheKey, Date.now());
    
    return data;
}

// Centralized fetch function with authorization options and error handling
async function fetchData(baseURL, endpoint, options = {}, authType = null) {
    const url = `${baseURL}/${endpoint}`;
    const headers = {
        'Content-Type': 'application/json',
        ...options.headers,
    };

    // Add authorization headers based on authType
    if (authType === 'basic') {
        const { consumerKey, consumerSecret } = options;
        headers['Authorization'] = 'Basic ' + btoa(`${consumerKey}:${consumerSecret}`);
    } else if (authType === 'bearer') {
        headers['Authorization'] = `Bearer ${options.apiKey}`;
    }

    try {
        const response = await fetch(url, {
            method: options.method || 'GET',
            headers,
            body: options.body || null,
        });

        if (!response.ok) {
            const errorText = await response.text();
            console.error(`Error: ${response.status} - ${errorText}`);
            throw new Error(`Error: ${response.status} - ${errorText}`);
        }
        return await response.json();
    } catch (error) {
        console.error("Fetch error:", error);
        throw error;
    }
}

// Unified error handling function for fetch requests
async function handleFetch(fetchFunction, fallback = {}) {
    try {
        return await fetchFunction();
    } catch (error) {
        console.error("Fetch error:", error);
        return fallback;
    }
}

// Helper function to fetch WooCommerce data
export function fetchWooCommerceData(endpoint, options = {}) {
    const params = new URLSearchParams(options.params || {});
    // Set per_page to 100 (max allowed) if not specified
    if (!params.has('per_page')) params.set('per_page', '100');
    
    const endpointWithParams = `${endpoint}${params.toString() ? '?' + params.toString() : ''}`;
    
    return handleFetch(() => fetchData(
        import.meta.env.VITE_WP_API_URL + '/wc/v3',
        endpointWithParams,
        {
            ...options,
            consumerKey: import.meta.env.VITE_WOOCOMMERCE_CONSUMER_KEY,
            consumerSecret: import.meta.env.VITE_WOOCOMMERCE_CONSUMER_SECRET,
        },
        'basic'
    ));
}

// Helper function to fetch Stripe data
export async function fetchStripeData(endpoint, options = {}) {
    const stripeSecretKey = import.meta.env.VITE_STRIPE_SECRET_KEY;
    const url = `https://api.stripe.com/v1/${endpoint}`;

    // Convert JSON body to URL-encoded form data if provided
    const bodyData = new URLSearchParams();
    if (options.body) {
        const body = JSON.parse(options.body);
        for (const [key, value] of Object.entries(body)) {
            bodyData.append(key, value);
        }
    }

    const response = await fetch(url, {
        method: options.method || 'POST',
        headers: {
            'Authorization': `Bearer ${stripeSecretKey}`,
            'Content-Type': 'application/x-www-form-urlencoded',
            'Stripe-Version': '2022-08-01', // Ensure the correct Stripe API version
        },
        body: options.body ? bodyData : null
    });

    if (!response.ok) {
        const errorText = await response.text();
        throw new Error(`Failed to fetch data from ${endpoint}: ${response.statusText} - ${errorText}`);
    }

    return await response.json();
}

// Helper function to fetch WordPress data
export function fetchWordPressData(endpoint, options = {}) {
    const params = new URLSearchParams(options.params || {});
    // Set per_page to 100 (max allowed) if not specified
    if (!params.has('per_page')) params.set('per_page', '100');
    
    const endpointWithParams = `${endpoint}${params.toString() ? '?' + params.toString() : ''}`;
    
    return handleFetch(() => fetchData(
        import.meta.env.VITE_WP_API_URL + '/wp/v2',
        endpointWithParams,
        options
    ));
}

// Additional utility functions for specific data fetching

export async function fetchArtists(params = {}) {
    const cacheKey = `artists-${JSON.stringify(params)}`;
    return await fetchWithCache(cacheKey, () => fetchWordPressData('artist', { params }), 'artists');
}

export async function fetchExhibitions() {
    return await handleFetch(() => fetchWordPressData('exhibition'), []);
}

export async function fetchMedia() {
    return await handleFetch(() => fetchWordPressData('media'), []);
}

export async function fetchProducts(params = {}) {
    const cacheKey = `products-${JSON.stringify(params)}`;
    return await fetchWithCache(cacheKey, () => fetchWooCommerceData('products', { params }), 'products');
}

export async function fetchProductWithVariations(productId) {
    const product = await handleFetch(() => fetchWooCommerceData(`products/${productId}`), null);
    const variations = await handleFetch(() => fetchWooCommerceData(`products/${productId}/variations`), []);
    return { product, variation: variations.length > 0 ? variations[0] : null };
}

export async function createPaymentIntent(amount, currency, paymentMethodTypes) {
    const stripe = require('stripe')(import.meta.env.VITE_STRIPE_SECRET_KEY);
    
    try {
        const paymentIntent = await stripe.paymentIntents.create({
            amount,
            currency,
            payment_method_types: paymentMethodTypes,
            automatic_payment_methods: {
                enabled: true,
                allow_redirects: 'always'
            }
        });
        
        return paymentIntent;
    } catch (error) {
        console.error('Stripe PaymentIntent Error:', error);
        throw error;
    }
}

// Add new optimized fetch functions for partial data
export async function fetchProductPreview(productId) {
    const cacheKey = `product-preview-${productId}`;
    return await fetchWithCache(cacheKey, () => 
        fetchWooCommerceData(`products/${productId}`, {
            params: {
                _fields: 'id,name,price,images,categories'
            }
        })
    );
}

export async function fetchArtistPreview(artistId) {
    const cacheKey = `artist-preview-${artistId}`;
    return await fetchWithCache(cacheKey, () => 
        fetchWordPressData(`artist/${artistId}`, {
            params: {
                _fields: 'id,title,acf.image'
            }
        })
    );
}

// Add this with your other API functions
export async function notifyCreativeHubOrder(orderData) {
    try {
        const response = await fetch('https://api.creativehub.io/api/v1/orders', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
                'Authorization': `Bearer ${import.meta.env.VITE_CREATIVEHUB_API_KEY}`,
                'Accept': 'application/json'
            },
            body: JSON.stringify({
                orderId: orderData.id,
                customerEmail: orderData.billing.email,
                customerName: `${orderData.billing.first_name} ${orderData.billing.last_name}`,
                shippingAddress: {
                    address1: orderData.shipping.address_1,
                    address2: orderData.shipping.address_2 || '',
                    city: orderData.shipping.city,
                    country: orderData.shipping.country,
                    postalCode: orderData.shipping.postcode,
                    phone: orderData.billing.phone
                },
                items: orderData.line_items.map(item => ({
                    productId: item.product_id,
                    quantity: item.quantity,
                    price: item.price
                }))
            })
        });

        if (!response.ok) {
            const errorText = await response.text();
            throw new Error(`CreativeHub API error: ${response.status} - ${errorText}`);
        }

        return await response.json();
    } catch (error) {
        console.error('CreativeHub notification error:', error);
        throw error;
    }
}

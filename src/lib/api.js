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

    const response = await fetch(url, {
        method: options.method || 'GET',
        headers,
        body: options.body || null,
    });

    if (!response.ok) {
        const errorText = await response.text();
        throw new Error(`Error: ${response.status} - ${errorText}`);
    }
    return await response.json();
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
    return handleFetch(() => fetchData(
        import.meta.env.VITE_WP_API_URL + '/wc/v3',
        endpoint,
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
    return handleFetch(() => fetchData(
        import.meta.env.VITE_WP_API_URL + '/wp/v2',
        endpoint,
        options
    ));
}

// Additional utility functions for specific data fetching

export async function fetchArtists() {
    return await handleFetch(() => fetchWordPressData('artist'), []);
}
export async function fetchExhibitions() {
    return await handleFetch(() => fetchWordPressData('exhibition'), []);
}

export async function fetchMedia() {
    return await handleFetch(() => fetchWordPressData('media'), []);
}


export async function fetchProducts() {
    return await handleFetch(() => fetchWooCommerceData('products'), []);
}

export async function fetchProductWithVariations(productId) {
    const product = await handleFetch(() => fetchWooCommerceData(`products/${productId}`), null);
    const variations = await handleFetch(() => fetchWooCommerceData(`products/${productId}/variations`), []);
    return { product, variation: variations.length > 0 ? variations[0] : null };
}

export async function createPaymentIntent(amount, currency) {
    const body = JSON.stringify({ amount, currency });
    return await handleFetch(() => fetchStripeData('payment_intents', { method: 'POST', body }), {});
}

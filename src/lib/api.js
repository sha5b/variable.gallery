export async function fetchWooCommerceData(endpoint, options = {}) {
    const apiUrl = import.meta.env.VITE_WP_API_URL;
    const consumerKey = import.meta.env.VITE_WOOCOMMERCE_CONSUMER_KEY;
    const consumerSecret = import.meta.env.VITE_WOOCOMMERCE_CONSUMER_SECRET;
    const url = `${apiUrl}/wc/v3/${endpoint}`;

    const response = await fetch(url, {
        method: options.method || 'GET',
        headers: {
            'Authorization': 'Basic ' + btoa(`${consumerKey}:${consumerSecret}`),
            'Content-Type': 'application/json',
            ...options.headers
        },
        body: options.body || null
    });

    if (!response.ok) {
        const errorText = await response.text();
        throw new Error(`Failed to fetch data from ${endpoint}: ${response.statusText} - ${errorText}`);
    }

    return await response.json();
}

// api.js
export async function fetchStripeData(endpoint, options = {}) {
    const stripeSecretKey = import.meta.env.VITE_STRIPE_SECRET_KEY;
    const url = `https://api.stripe.com/v1/${endpoint}`;

    // Convert JSON body to URL-encoded form data
    const bodyData = new URLSearchParams();
    const body = JSON.parse(options.body);
    for (const [key, value] of Object.entries(body)) {
        bodyData.append(key, value);
    }

    const response = await fetch(url, {
        method: options.method || 'POST',
        headers: {
            'Authorization': `Bearer ${stripeSecretKey}`,
            'Content-Type': 'application/x-www-form-urlencoded',
            'Stripe-Version': '2022-08-01', // Ensure the correct Stripe API version
        },
        body: bodyData
    });

    if (!response.ok) {
        const errorText = await response.text();
        throw new Error(`Failed to fetch data from ${endpoint}: ${response.statusText} - ${errorText}`);
    }

    return await response.json();
}

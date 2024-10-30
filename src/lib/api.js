// src/lib/api.js
export async function fetchWooCommerceData(endpoint) {
    const apiUrl = import.meta.env.VITE_WP_API_URL;
    const consumerKey = import.meta.env.VITE_WOOCOMMERCE_CONSUMER_KEY;
    const consumerSecret = import.meta.env.VITE_WOOCOMMERCE_CONSUMER_SECRET;

    const response = await fetch(`${apiUrl}/wc/v3/${endpoint}`, {
        headers: {
            'Authorization': 'Basic ' + btoa(`${consumerKey}:${consumerSecret}`)
        }
    });

    if (!response.ok) {
        throw new Error(`Failed to fetch data from ${endpoint}`);
    }

    return await response.json();
}

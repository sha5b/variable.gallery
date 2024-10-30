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

import { fetchWooCommerceData, fetchWordPressData } from '$lib/api';

export async function load() {
    try {
        // Fetch all artists from WordPress
        const artists = await fetchWordPressData('artist');
        
        // Fetch all products from WooCommerce
        const products = await fetchWooCommerceData('products');

        // Return all artists and products to the Svelte page
        return { artists, products };
    } catch (error) {
        console.error("Error fetching data:", error);
        return { artists: [], products: [] }; // Fallback in case of error
    }
}

import { fetchWooCommerceData, fetchWordPressData } from '$lib/api';

export async function load() {
    try {
        // Fetch all products
        const products = await fetchWooCommerceData('products');

        // Fetch artist data from WordPress API
        const artists = await fetchWordPressData('artist');

        // Fetch variations for each product
        const productsWithVariations = await Promise.all(products.map(async (product) => {
            const variations = await fetchWooCommerceData(`products/${product.id}/variations`);
            return { ...product, variations };
        }));

        return { 
            products: productsWithVariations,
            artists // Pass artist data to the main page
        };
    } catch (error) {
        console.error(error);
        return { products: [], artists: [] }; // fallback in case of error
    }
}

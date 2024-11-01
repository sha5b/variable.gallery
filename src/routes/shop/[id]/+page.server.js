import { fetchWooCommerceData } from '$lib/api';

export async function load({ params }) {
    const productId = params.id;

    try {

        const products = await fetchWooCommerceData('products');
        // Fetch the product details
        const product = await fetchWooCommerceData(`products/${productId}`);

        // Fetch the variations for the product
        const variations = await fetchWooCommerceData(`products/${productId}/variations`);

        // Assuming there is only one variation
        const variation = variations.length > 0 ? variations[0] : null;

        // Return the product, variation, and products list
        return { product, variation, products};
    } catch (error) {
        console.error("Failed to fetch product or variation data:", error);
        return { product: null, variation: null, products: [] }; // Fallback in case of error
    }
}

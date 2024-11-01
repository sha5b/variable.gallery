import { fetchWooCommerceData } from '$lib/api';

export async function load() {
    try {
        // Fetch all products
        const products = await fetchWooCommerceData('products');

        // Fetch variations for each product
        const productsWithVariations = await Promise.all(products.map(async (product) => {
            const variations = await fetchWooCommerceData(`products/${product.id}/variations`);
            return { ...product, variations };
        }));

        return { products: productsWithVariations };
    } catch (error) {
        console.error(error);
        return { products: [] }; // fallback in case of error
    }
}

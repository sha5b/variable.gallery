import { fetchProductWithVariations, fetchProducts, fetchArtists } from '$lib/api';

export async function load({ params }) {
    const productId = params.id;

    try {
        // Fetch product with variations using the existing API function
        const { product, variation } = await fetchProductWithVariations(productId);
        
        // Fetch all products for related items
        const products = await fetchProducts();
        
        // Fetch artists
        const artists = await fetchArtists();

        if (!product) {
            throw new Error('Product not found');
        }

        return {
            product,
            products,
            artists,
            variation
        };
    } catch (error) {
        console.error("Failed to fetch product data:", error);
        return {
            product: null,
            products: [],
            artists: [],
            variation: null
        };
    }
}

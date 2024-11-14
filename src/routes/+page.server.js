import { fetchArtists, fetchProducts, fetchExhibitions, fetchMedia, fetchWooCommerceData } from '$lib/api';

export async function load() {
    try {
        // Fetch all base data concurrently
        const [baseProducts, artists, exhibitions, media] = await Promise.all([
            fetchProducts(),
            fetchArtists(),
            fetchExhibitions(),
            fetchMedia(),
        ]);

        // Batch fetch variations instead of individual requests
        const productIds = baseProducts.map(product => product.id);
        const allVariations = await fetchWooCommerceData(`products/variations/batch`, {
            method: 'POST',
            body: JSON.stringify({ product_ids: productIds })
        });

        // Map variations back to products
        const products = baseProducts.map(product => ({
            ...product,
            variation: allVariations[product.id]?.[0] || null
        }));

        return {
            products,
            artists,
            exhibitions,
            media
        };
    } catch (error) {
        console.error("Failed to fetch data:", error);
        return {
            products: [],
            artists: [],
            exhibitions: [],
            media: []
        };
    }
}

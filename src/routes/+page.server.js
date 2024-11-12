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

        // Fetch variations for each product
        const products = await Promise.all(
            baseProducts.map(async (product) => {
                const variations = await fetchWooCommerceData(`products/${product.id}/variations`);
                const variation = variations.length > 0 ? variations[0] : null;
                return {
                    ...product,
                    variation
                };
            })
        );

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

import { fetchProductWithVariations, fetchProducts, fetchArtists } from '$lib/api';

export async function load() {
    try {
        // Fetch all products with their variations
        const products = await fetchProducts({ 
            params: { 
                status: 'publish'
            } 
        });

        // Get the latest product
        const latestProduct = products.length > 0
            ? products.reduce(
                (latest, product) =>
                    new Date(product.date_modified) > new Date(latest.date_modified) ? product : latest,
                products[0]
            )
            : null;

        // Fetch variation for the latest product
        let variation = null;
        if (latestProduct && latestProduct.type === 'variable' && latestProduct.variations?.length > 0) {
            const { variation: latestVariation } = await fetchProductWithVariations(latestProduct.id);
            variation = latestVariation;
        }

        // Fetch artists
        const artists = await fetchArtists();

        return {
            products,
            artists,
            product: latestProduct,  // Add this to match shop/[id] structure
            variation               // Add this to match shop/[id] structure
        };
    } catch (error) {
        console.error("Failed to fetch data:", error);
        return {
            products: [],
            artists: [],
            product: null,
            variation: null
        };
    }
}

import { fetchArtists, fetchProducts } from '$lib/api';

export async function load() {
    // Fetch products and artists concurrently
    const [products, artists] = await Promise.all([
        fetchProducts(), // Fetch limited product data
        fetchArtists()
    ]);

    return {
        products,
        artists
    };
}

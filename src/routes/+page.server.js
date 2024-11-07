import { fetchArtists, fetchProducts,fetchExhibitions, fetchMedia } from '$lib/api';

export async function load() {
    // Fetch products and artists concurrently
    const [products, artists, exhibitions, media] = await Promise.all([
        fetchProducts(), // Fetch limited product data
        fetchArtists(),
        fetchExhibitions(),
        fetchMedia(),
    ]);
    return {
        products,
        artists, 
        exhibitions,
        media
    };
}

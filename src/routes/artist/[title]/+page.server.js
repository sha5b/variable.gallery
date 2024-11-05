import { fetchArtists, fetchProducts } from '$lib/api';

export async function load() {
    // Fetch artists and products concurrently
    const [artists, products] = await Promise.all([
        fetchArtists(),
        fetchProducts()
    ]);

    return { artists, products };
}

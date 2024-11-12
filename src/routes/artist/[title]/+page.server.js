import { fetchArtists, fetchProducts, fetchExhibitions } from '$lib/api';

export async function load() {
    const [artists, products, exhibitions] = await Promise.all([
        fetchArtists(),
        fetchProducts(),
        fetchExhibitions()
    ]);

    return { artists, products, exhibitions };
}

import { fetchArtists } from '$lib/api';

export async function load() {
    // Fetch artist data
    const artists = await fetchArtists();
    return { artists };
}

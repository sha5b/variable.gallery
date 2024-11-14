import { fetchArtists, fetchExhibitions, fetchMedia } from '$lib/api';

export async function load() {
    try {
        const [artists, exhibitions, media] = await Promise.all([
            fetchArtists(),
            fetchExhibitions(),
            fetchMedia()
        ]);

        return {
            artists,
            exhibitions,
            media,
            timestamp: Date.now()
        };
    } catch (error) {
        console.error("Root layout fetch error:", error);
        return {
            artists: [],
            exhibitions: [],
            media: [],
            timestamp: Date.now()
        };
    }
}

// exhibition/[title]/+page.server.js
import { fetchExhibitions, fetchMedia } from '$lib/api';

export async function load({ params }) {
    const [exhibitions, media] = await Promise.all([
        fetchExhibitions(),
        fetchMedia(),
    ]);

    return {
        exhibitions,
        media,
    };
}

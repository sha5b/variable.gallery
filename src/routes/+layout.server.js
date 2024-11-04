import { fetchWordPressData } from '$lib/api';

export async function load() {
    try {
        // Fetch artist data from WordPress API
        const artists = await fetchWordPressData('artist');
        
        return { artists };
    } catch (error) {
        console.error(error);
        return { artists: [] }; // Fallback in case of an error
    }
}
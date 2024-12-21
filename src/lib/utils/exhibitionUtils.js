/**
 * Get the latest virtual exhibition for a given artist ID
 * @param {import('./types').Exhibition[]} exhibitions
 * @param {number} artistId - The ID of the artist
 * @returns {import('./types').Exhibition | undefined} The latest exhibition or undefined if none found
 */
export function getLatestVirtualExhibitionForArtist(exhibitions, artistId) {
    return exhibitions
        .filter(exhibition =>
            exhibition.acf &&
            exhibition.acf.virtual === true &&
            exhibition.acf.artist.includes(artistId)
        )
        .sort((a, b) => 
            new Date(b.date).getTime() - new Date(a.date).getTime()
        )[0];
}

import { generateSitemap } from '$lib/utils/sitemap';

export async function GET() {
    // Mock data for testing
    const artists = [{ slug: 'artist', modified: new Date() }];
    const products = [{ slug: 'product', modified: new Date() }];
    const exhibitions = [{ slug: 'exhibition', modified: new Date() }];

    const sitemap = await generateSitemap(artists, products, exhibitions);

    return new Response(sitemap, {
        headers: {
            'Content-Type': 'application/xml',
            'Cache-Control': 'max-age=0, s-maxage=3600'
        }
    });
}

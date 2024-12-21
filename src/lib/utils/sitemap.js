import { GALLERY_INFO } from './constants.js';

/**
 * Generate XML sitemap for the website
 * @param {import('./types').Artist[]} artists - Array of artist objects
 * @param {import('./types').Product[]} products - Array of product objects
 * @param {import('./types').Exhibition[]} exhibitions - Array of exhibition objects
 * @returns {Promise<string>} XML sitemap content
 */
export async function generateSitemap(artists, products, exhibitions) {
    const staticPages = [
        '',
        '/about',
        '/artist',
        '/shop',
        '/cart',
        '/impressum',
        '/privacy-policy',
        '/terms-and-conditions'
    ];

    const staticUrls = staticPages.map(page => ({
        url: `${GALLERY_INFO.baseUrl}${page}`,
        lastmod: new Date().toISOString(),
        changefreq: page === '' ? 'daily' : 'weekly',
        priority: page === '' ? '1.0' : '0.8'
    }));

    const artistUrls = artists.map(artist => ({
        url: `${GALLERY_INFO.baseUrl}/artist/${artist.slug}`,
        lastmod: new Date().toISOString(), // Artists don't have a modification date
        changefreq: 'weekly',
        priority: '0.9'
    }));

    const productUrls = products.map(product => ({
        url: `${GALLERY_INFO.baseUrl}/shop/${product.id}`,
        lastmod: new Date(product.date_modified).toISOString(),
        changefreq: 'daily',
        priority: '0.9'
    }));

    const exhibitionUrls = exhibitions.map(exhibition => ({
        url: `${GALLERY_INFO.baseUrl}/exhibitions/${exhibition.slug}`,
        lastmod: new Date(exhibition.acf?.date || new Date()).toISOString(),
        changefreq: 'weekly',
        priority: '0.9'
    }));

    const allUrls = [...staticUrls, ...artistUrls, ...productUrls, ...exhibitionUrls];

    return `<?xml version="1.0" encoding="UTF-8"?>
<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">
    ${allUrls.map(url => `
    <url>
        <loc>${url.url}</loc>
        <lastmod>${url.lastmod}</lastmod>
        <changefreq>${url.changefreq}</changefreq>
        <priority>${url.priority}</priority>
    </url>
    `).join('')}
</urlset>`;
}

const baseUrl = 'https://variable.gallery';

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
        url: `${baseUrl}${page}`,
        lastmod: new Date().toISOString(),
        changefreq: page === '' ? 'daily' : 'weekly',
        priority: page === '' ? '1.0' : '0.8'
    }));

    const artistUrls = artists.map(artist => ({
        url: `${baseUrl}/artist/${artist.slug}`,
        lastmod: new Date(artist.modified).toISOString(),
        changefreq: 'weekly',
        priority: '0.9'
    }));

    const productUrls = products.map(product => ({
        url: `${baseUrl}/shop/${product.slug}`,
        lastmod: new Date(product.modified).toISOString(),
        changefreq: 'daily',
        priority: '0.9'
    }));

    const exhibitionUrls = exhibitions.map(exhibition => ({
        url: `${baseUrl}/exhibition/${exhibition.slug}`,
        lastmod: new Date(exhibition.modified).toISOString(),
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
export const defaultSEO = {
  title: 'variable.gallery | Digital Art Gallery',
  description: 'Explore digital art, NFTs, and experimental media formats in our virtual gallery space.',
  keywords: ['digital art', 'NFT', 'art gallery', 'virtual gallery', 'experimental art'],
  openGraph: {
    type: 'website',
    siteName: 'variable.gallery',
    url: 'https://variable.gallery',
    image: 'https://variable.gallery/og-image.jpg'
  }
};

export function generateMetaTags(seo) {
  const tags = [
    { name: 'description', content: seo.description },
    { name: 'keywords', content: seo.keywords?.join(', ') || '' }
  ];

  if (seo.noindex || seo.nofollow) {
    tags.push({
      name: 'robots',
      content: `${seo.noindex ? 'noindex' : 'index'}, ${seo.nofollow ? 'nofollow' : 'follow'}`
    });
  }

  if (seo.openGraph) {
    const og = seo.openGraph;
    tags.push(
      { property: 'og:title', content: seo.title },
      { property: 'og:description', content: seo.description },
      { property: 'og:type', content: og.type },
      { property: 'og:site_name', content: og.siteName },
      { property: 'og:url', content: og.url },
      { property: 'og:image', content: og.image }
    );
  }

  if (seo.additionalMetaTags) {
    tags.push(...seo.additionalMetaTags);
  }

  return tags;
} 
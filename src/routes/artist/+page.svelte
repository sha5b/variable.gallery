<script>
    import ArtistSlider from '$lib/components/slider/ArtistSlider.svelte';
    import LatestArtistExhibition from '$lib/components/LatestArtistExhibition.svelte';
    import { defaultSEO, generateMetaTags } from '$lib/utils/seo';
    import { page } from '$app/stores';

    /**
     * @typedef {Object} Exhibition
     * @property {string} date
     * @property {Object} acf
     * @property {boolean} acf.virtual
     * @property {number[]} acf.artist
     */

    /**
     * @typedef {Object} Artist
     * @property {number} id
     * @property {Object} title
     * @property {string} title.rendered
     * @property {string} slug
     * @property {{description?: string, location?: string}} [acf]
     */

    /**
     * @typedef {Object} MetaTag
     * @property {string} [name]
     * @property {string} [property]
     * @property {any} content
     */

    /**
     * @typedef {Object} PageData
     * @property {Artist[]} artists
     * @property {any[]} products
     * @property {Exhibition[]} exhibitions
     * @property {any[]} media
     */

    /** @type {PageData} */
    export let data;
    let { artists, products, exhibitions, media } = data;

    // Create artists-specific SEO
    const pageSEO = {
        ...defaultSEO,
        title: 'Artists | variable.gallery',
        description: 'Discover our curated selection of digital artists. Explore their virtual exhibitions, NFT collections, and experimental media artworks.',
        keywords: [
            ...defaultSEO.keywords,
            'digital artists',
            'NFT creators',
            'virtual exhibitions',
            'digital art creators',
            'experimental artists',
            'contemporary digital art'
        ],
        openGraph: {
            ...defaultSEO.openGraph,
            title: 'Artists | variable.gallery',
            description: 'Discover our curated selection of digital artists. Explore their virtual exhibitions, NFT collections, and experimental media artworks.',
            url: 'https://variable.gallery/artist'
        }
    };

    /** @type {MetaTag[]} */
    $: metaTags = generateMetaTags(pageSEO);

    /**
     * Get the latest virtual exhibition for a given artist ID
     * @param {number} artistId
     * @returns {Exhibition | undefined}
     */
    /**
     * Get the latest virtual exhibition for a given artist ID
     * @param {number} artistId - The ID of the artist
     * @returns {Exhibition | undefined} The latest exhibition or undefined if none found
     */
    function getLatestVirtualExhibitionForArtist(artistId) {
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

    /** @type {Object} */
    $: artistsStructuredData = {
        "@context": "https://schema.org",
        "@type": "CollectionPage",
        "name": "Artists at variable.gallery",
        "description": pageSEO.description,
        "url": pageSEO.openGraph.url,
        "mainEntity": {
            "@type": "ItemList",
            "itemListElement": artists.map((artist, index) => ({
                "@type": "ListItem",
                "position": index + 1,
                "item": {
                    "@type": "Person",
                    "name": artist.title.rendered,
                    "url": `https://variable.gallery/artist/${artist.slug}`,
                    "@id": `https://variable.gallery/artist/${artist.slug}`
                }
            }))
        }
    };
</script>

<svelte:head>
    <title>{pageSEO.title}</title>
    {#each metaTags as tag}
        {#if tag.name}
            <meta name={tag.name} content={tag.content}>
        {:else if tag.property}
            <meta property={tag.property} content={tag.content}>
        {/if}
    {/each}
    <script type="application/ld+json">
        {JSON.stringify(artistsStructuredData)}
    </script>
</svelte:head>

<div class="page-container">
    <div class="content-section space-y-md">
        <section class="space-y-sm">
            <h1 class="h1">Featured Artists</h1>
            <p>
                Meet our exceptional digital artists pushing the boundaries of art and technology. 
                Each artist brings a unique perspective to the digital art landscape through virtual exhibitions, 
                NFT collections, and experimental media.
            </p>
        </section>

        <section class="space-y-md">
            <div class="grid grid-cols-1 gap-xl md:grid-cols-2">
                {#each artists as artist}
                    {#if getLatestVirtualExhibitionForArtist(artist.id) !== undefined}
                        <div class="space-y-lg">
                            <a href={`/artist/${artist.slug}`}>
                                <h3 class="h3">
                                    {artist.title.rendered}
                                </h3>
                            </a>
                            <div class="overflow-hidden">
                                <ArtistSlider {products} artistName={artist.title.rendered} />
                            </div>
                            <p class="text-base">
                                {artist.acf?.description || `Artist based in ${artist.acf?.location || 'various locations'}`}
                            </p>
                        </div>
                    {/if}
                {/each}
            </div>
        </section>
    </div>
</div>

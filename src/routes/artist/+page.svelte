<script>
    import ArtistSlider from '$lib/components/slider/ArtistSlider.svelte';
    import LatestArtistExhibition from '$lib/components/LatestArtistExhibition.svelte';
    import { defaultSEO, generateMetaTags } from '$lib/utils/seo';
    import { page } from '$app/stores';

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

    $: metaTags = generateMetaTags(pageSEO);

    // Helper function to get the latest virtual exhibition for a given artist ID
    function getLatestVirtualExhibitionForArtist(artistId) {
        return exhibitions
            .filter(exhibition =>
                exhibition.acf &&
                exhibition.acf.virtual === true &&
                exhibition.acf.artist.includes(artistId)
            )
            .sort((a, b) => new Date(b.date) - new Date(a.date))[0];
    }

    // Create structured data for the artists
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

<div class="artist-page px-page space-y-lg">
    <div class="gap-lg grid md:grid-cols-2">
        {#each artists as artist}
            {#if getLatestVirtualExhibitionForArtist(artist.id) !== undefined}
                <section class="artist-section space-y-md bg-background p-md flex flex-col justify-between rounded-lg">
                    <div class="artist-info text-text-color space-y-sm">
                        <a href={`/artist/${artist.slug}`}>
                            <h2 class="text-6xl font-heading text-text-color font-bold">
                                {artist.title.rendered}
                            </h2>
                        </a>
                    </div>
                    <div class="sphere-container-wrapper flex items-center justify-center overflow-hidden">
                        <ArtistSlider {products} artistName={artist.title.rendered} />
                    </div>
                </section>
            {/if}
        {/each}
    </div>
</div>

<style>
    .sphere-container-wrapper {
        /* Add any specific styles needed */
    }
    .artist-page {
        height: 100%;
    }
    .artist-section {
        transition: transform 0.3s ease;
    }
    .artist-section:hover {
        transform: translateY(-4px);
    }
    .artist-info {
        z-index: 1;
    }
</style>

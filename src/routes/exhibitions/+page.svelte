<script>
    import { defaultSEO, generateMetaTags } from '$lib/utils/seo';
    import LatestVirtualExhibition from '$lib/components/LatestVirtualExhibition.svelte';
    import ExhibitionGrid from '$lib/components/ExhibitionGrid.svelte';
    
    /**
     * @typedef {Object} MetaTag
     * @property {string} [name]
     * @property {string} [property]
     * @property {string} content
     */

    /**
     * @typedef {Object} Media
     * @property {number} id
     * @property {string} source_url
     */

    /**
     * @typedef {Object} Exhibition
     * @property {{virtual: boolean, fingerprint: number, artist?: string[], location?: string}} acf
     * @property {{rendered: string}} title
     * @property {string} date
     * @property {string} description
     */

    /**
     * @typedef {Object} PageData
     * @property {Exhibition[]} exhibitions
     * @property {Media[]} media
     */

    /** @type {PageData} */
    export let data;
    const { exhibitions, media } = data;

    // Create exhibitions-specific SEO
    const pageSEO = {
        ...defaultSEO,
        title: 'Exhibitions | variable.gallery',
        description: 'Explore our curated digital art exhibitions featuring innovative artists and experimental media. Experience virtual and physical exhibitions.',
        keywords: [
            ...defaultSEO.keywords,
            'digital art exhibitions',
            'virtual exhibitions',
            'art shows',
            'gallery exhibitions',
            'digital installations'
        ],
        openGraph: {
            ...defaultSEO.openGraph,
            title: 'Exhibitions | variable.gallery',
            description: 'Explore our curated digital art exhibitions featuring innovative artists and experimental media. Experience virtual and physical exhibitions.',
            url: 'https://variable.gallery/exhibitions'
        }
    };

    /** @type {MetaTag[]} */
    $: metaTags = generateMetaTags(pageSEO);
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
</svelte:head>

<div class="page-container">
    <div class="content-section space-y-md">
        <section class="space-y-sm">
            <h1 class="h1">Current Exhibitions</h1>
            <p>
                Discover our latest digital art exhibitions, featuring groundbreaking works from emerging and established artists.
                Experience immersive virtual installations and innovative media art.
            </p>
        </section>
        
        <section class="space-y-md">
            <h2 class="section-title">Featured Exhibition</h2>
            <LatestVirtualExhibition {exhibitions} {media} />
        </section>

        <section class="space-y-md">
            <h2 class="section-title">All Exhibitions</h2>
            <ExhibitionGrid {exhibitions} {media} />
        </section>
    </div>
</div>

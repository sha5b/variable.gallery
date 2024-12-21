<script>
    import { generateUnifiedSeo } from '$lib/utils/seoUnified.js';
    import { page } from '$app/stores';

    /** @type {keyof typeof import('$lib/utils/constants').PAGE_TYPES} */
    export let pageType;
    
    /** @type {import('$lib/utils/types').PageData} */
    export let data = {};
    
    /** @type {Partial<import('$lib/utils/types').SeoConfig>} */
    export let customSEO = {};

    // Generate unified SEO configuration
    $: seo = generateUnifiedSeo({
        pageType,
        customConfig: customSEO,
        data,
        path: $page.url.pathname
    });
</script>

<svelte:head>
    <title>{seo.title}</title>
    {#each seo.metaTags as tag}
        {#if tag.name}
            <meta name={tag.name} content={tag.content}>
        {:else if tag.property}
            <meta property={tag.property} content={tag.content}>
        {/if}
    {/each}
    {#if seo.canonical}
        <link rel="canonical" href={seo.canonical}>
    {/if}
    <script type="application/ld+json">
        {JSON.stringify(seo.schema)}
    </script>
</svelte:head>

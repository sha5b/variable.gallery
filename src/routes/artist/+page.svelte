<script>
    import ArtistSlider from '$lib/components/slider/ArtistSlider.svelte';
    import PageSEO from '$lib/components/base/PageSEO.svelte';
    import { page } from '$app/stores';
    
    /** @type {import('$lib/utils/types').PageData} */
    export let data;
    const { artists = [], products = [], exhibitions = [], media = [] } = data;
</script>

<PageSEO pageType="ARTIST" {data} />

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
    </div>
</div>

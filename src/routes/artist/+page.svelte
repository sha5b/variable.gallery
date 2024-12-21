<script>
    import ArtistSlider from '$lib/components/slider/ArtistSlider.svelte';
    import LatestArtistExhibition from '$lib/components/LatestArtistExhibition.svelte';
    import PageSEO from '$lib/components/base/PageSEO.svelte';
    import { page } from '$app/stores';
    import { getLatestVirtualExhibitionForArtist } from '$lib/utils/exhibitionUtils';

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

        <section class="space-y-md">
            <div class="grid grid-cols-1 gap-xl md:grid-cols-2">
                {#each artists as artist (artist.id)}
                    {#if getLatestVirtualExhibitionForArtist(exhibitions, artist.id) !== undefined}
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

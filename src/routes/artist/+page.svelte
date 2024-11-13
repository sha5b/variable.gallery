<script>
    import ArtistSlider from '$lib/components/slider/ArtistSlider.svelte';
    import LatestArtistExhibition from '$lib/components/LatestArtistExhibition.svelte';
    import { page } from '$app/stores';

    export let data;
    let { artists, products, exhibitions, media } = data;

    // Helper function to get the latest virtual exhibition for a given artist ID
    function getLatestVirtualExhibitionForArtist(artistId) {
        return exhibitions
            .filter(exhibition =>
                exhibition.acf &&
                exhibition.acf.virtual === true &&
                exhibition.acf.artist.includes(artistId) // Check if artistId is in the artist array
            )
            .sort((a, b) => new Date(b.date) - new Date(a.date))[0]; // Sort by date and get latest
    }
</script>

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

                    <!-- Pass the latest virtual exhibition for each artist to the component -->
                    <!-- <LatestArtistExhibition
                        exhibition={getLatestVirtualExhibitionForArtist(artist.id)}
                        media={media}
                    /> -->

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

    }
    .artist-page {
        height: 100%;
    }
</style>

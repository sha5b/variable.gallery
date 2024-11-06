<script>
    import ArtistSlider from '$lib/components/slider/ArtistSlider.svelte';
    export let data;
    let { artists, products } = data;
</script>

<div class="artist-page px-page-md space-y-lg">
    {#each artists as artist}
        <section class="space-y-md">
            <h2 class="text-large font-heading font-bold text-text-color">{artist.title.rendered}</h2>
            <!-- Pass artist.works if it exists, otherwise adapt to your data structure -->
            <ArtistSlider {products} artistName={artist.title.rendered} />
        </section>
    {/each}
</div>

<style>
    .artist-page {
        padding-top: var(--spacing-xl);
    }
    section {
        margin-bottom: var(--spacing-lg);
    }
</style>

<script>
    import { page } from '$app/stores';
    import ArtistSlider from '$lib/components/slider/ArtistSlider.svelte';

    export let data;
    let { products, artists } = data;

    let filteredArtist = null;
    let artistProducts = [];

    function normalizeTitle(title) {
        return title.toLowerCase().replace(/-/g, ' ').trim();
    }

    $: {
        const artistTitle = normalizeTitle($page.params.title || '');
        filteredArtist = artists.find(artist => normalizeTitle(artist.title.rendered) === artistTitle);

        if (filteredArtist) {
            artistProducts = products.filter(product =>
                product.attributes.some(attr =>
                    attr.name.toLowerCase() === 'artist' && 
                    attr.options.includes(filteredArtist.title.rendered)
                )
            );
        } else {
            artistProducts = [];
        }
    }
</script>

<div class="artist-container px-4 md:px-8 my-8">
    {#if filteredArtist}
        <div class="artist-info flex flex-col md:flex-row gap-8 items-start bg-white ">
            {#if filteredArtist.acf?.image}
                <div class="artist-thumbnail w-full md:w-1/3">
                    <img src={`/wp-content/uploads/${filteredArtist.acf.image}`} alt={filteredArtist.title.rendered} class="w-full h-auto object-cover " />
                </div>
            {/if}

            <div class="artist-details md:w-2/3 space-y-4">
                <h1 class="text-2xl md:text-3xl font-bold text-primary">{filteredArtist.title.rendered}</h1>
                <p class="text-base md:text-lg text-secondary"><strong>Bio:</strong> {filteredArtist.acf?.description || 'No description available.'}</p>
                <p class="text-base md:text-lg text-secondary"><strong>Location:</strong> {filteredArtist.acf?.location || 'Unknown location'}</p>
            </div>
        </div>
    {:else}
        <p class="text-center text-secondary">Artist information not found.</p>
    {/if}

    {#if artistProducts && artistProducts.length > 0}
        <section class="artist-products mt-8">
            <ArtistSlider products={artistProducts} artistName={filteredArtist.title.rendered}/>
        </section>
    {:else if filteredArtist}
        <p class="mt-8 text-center text-secondary">No products available from {filteredArtist.title.rendered} at this time.</p>
    {/if}
</div>

<style>
    .artist-container {
        display: flex;
        flex-direction: column;
        gap: var(--spacing-lg);
    }

    .artist-info {
        background-color: var(--background-color);
        border-radius: var(--rounded-md);
        display: flex;
        gap: var(--spacing-lg);
    }

    .artist-thumbnail img {
        border-radius: var(--rounded-md);
    }

    .artist-details {
        display: flex;
        flex-direction: column;
        gap: var(--spacing-md);
    }

    .artist-products {
        margin-top: var(--spacing-lg);
    }
</style>

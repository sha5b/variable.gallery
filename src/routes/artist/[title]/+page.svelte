<script>
    import { page } from '$app/stores';
    import ArtistSlider from '$lib/components/ArtistSlider.svelte';

    export let data;
    let { products, artists } = data;

    // Reactive variable for the filtered artist and artist's products
    let filteredArtist = null;
    let artistProducts = [];

    // Helper function to normalize titles for comparison
    function normalizeTitle(title) {
        return title.toLowerCase().replace(/-/g, ' ').trim();
    }

    // Filter the artist and their products based on the page title parameter
    $: {
        const artistTitle = normalizeTitle($page.params.title || '');
        console.log("Normalized Artist Title from Params:", artistTitle);

        // Find the artist by matching the normalized title with the page parameter
        filteredArtist = artists.find(artist => normalizeTitle(artist.title.rendered) === artistTitle);
        console.log("Filtered Artist Match Check:", filteredArtist);

        if (filteredArtist) {
            // Filter products based on the artist's name in the attributes
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

    // Logging for debugging
    console.log("Artists:", artists);
    console.log("Products:", products);
    console.log("Page Params:", $page.params);
    console.log("Filtered Artist:", filteredArtist);
    console.log("Artist Products:", artistProducts);
</script>

<div class="artist-container px-page my-8">
    <!-- Artist Information Section -->
    {#if filteredArtist}
        <div class="artist-info flex flex-col md:flex-row gap-lg items-start bg-background p-lg rounded-md shadow-lg">
            <!-- Artist Image -->
            {#if filteredArtist.acf?.image}
                <div class="artist-thumbnail w-full md:w-1/3">
                    <img src={`/wp-content/uploads/${filteredArtist.acf.image}`} alt={filteredArtist.title.rendered} class="w-full h-auto object-cover rounded-md" />
                </div>
            {/if}

            <!-- Artist Details -->
            <div class="artist-details md:w-2/3 space-y-md">
                <h1 class="text-3xl font-bold text-primary">{filteredArtist.title.rendered}</h1>
                <p class="text-base text-secondary"><strong>Bio:</strong> {filteredArtist.acf?.description || 'No description available.'}</p>
                <p class="text-base text-secondary"><strong>Location:</strong> {filteredArtist.acf?.location || 'Unknown location'}</p>
            </div>
        </div>
    {:else}
        <p class="text-center text-secondary">Artist information not found.</p>
    {/if}

    <!-- Artist's Products Section with ArtistSlider Component -->
    {#if artistProducts && artistProducts.length > 0}
        <section class="artist-products mt-12">
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
        padding: var(--spacing-lg);
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

<script>
    import { handleMouseMove, handleTouchStart, handleTouchMove, handleTouchEnd } from '$lib/utils/sliderHelper';
    import { goto } from '$app/navigation';
    import { handleImageLoad, getProductUrl, getProductImageUrl } from '$lib/utils/mediaUtils';

    /** @type {import('$lib/utils/types').Product[]} */
    export let products = [];
    /** @type {string} */
    export let artistName = '';

    $: filteredProducts = products.filter(product =>
        product.attributes.some(attr => attr.name.toLowerCase() === 'artist' && attr.options.includes(artistName))
    );

    /** @type {HTMLElement|null} */
    let slider = null;

    /**
     * @param {MouseEvent} event
     */
    function onHandleMouseMove(event) {
        if (slider) {
            handleMouseMove(event, slider);
        }
    }

    /**
     * Handle touch events with null checks
     * @param {TouchEvent} event
     * @param {(event: TouchEvent, slider: HTMLElement) => void} handler
     */
    function handleTouch(event, handler) {
        if (slider) {
            handler(event, slider);
        }
    }

    /**
     * @param {import('$lib/utils/types').Product} product
     */
    function onProductClick(product) {
        goto(getProductUrl(product.id));
    }

    // Add this to handle reactive loading of images
    $: imagePromises = filteredProducts.map(product => ({
        ...product,
        loadedSrc: handleImageLoad(getProductImageUrl(product))
    }));
</script>

<section class='artist-slider-section'>
    <div 
        class="artist-slider-container" 
        bind:this={slider} 
        on:mousemove={onHandleMouseMove}
        on:touchstart={(e) => handleTouch(e, handleTouchStart)}
        on:touchmove={(e) => handleTouch(e, handleTouchMove)}
        on:touchend={(e) => handleTouch(e, handleTouchEnd)}
    >
        <div class="artist-slider gap-lg flex">
            {#each filteredProducts as product}
                <div class="artist-card" on:click={() => onProductClick(product)}>
                    <div class="product-tag-container">
                        {#each product.tags as tag}
                            <span class="pill pill-primary pill-sm">{tag.name}</span>
                        {/each}
                    </div>
                    {#await imagePromises.find(p => p.id === product.id)?.loadedSrc || handleImageLoad(getProductImageUrl(product))}
                        <img src="/placeholder.jpg" alt="Loading..." class="product-image" />
                    {:then src}
                        <img {src} alt={product.name} class="product-image" />
                    {/await}
                </div>
            {/each}
        </div>
    </div>
</section>

<script>
    import { handleMouseMove, handleTouchStart, handleTouchMove, handleTouchEnd } from '$lib/utils/sliderHelper';
    import { goto } from '$app/navigation';
    import { handleImageLoad, getProductUrl, getProductImageUrl } from '$lib/utils/mediaUtils';

    /** @type {import('$lib/utils/types').Product[]} */
    export let products = [];
    /** @type {string} */
    export let category = '';

    $: filteredProducts = products.filter((product) =>
        product.categories.some((cat) => cat.name === category)
    );

    $: displayedProducts = filteredProducts
        .slice()
        .sort((a, b) => new Date(b.date_modified).getTime() - new Date(a.date_modified).getTime());

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
    $: imagePromises = displayedProducts.map(product => ({
        ...product,
        loadedSrc: handleImageLoad(getProductImageUrl(product))
    }));
</script>

<section class='mt-12 '>
    <div class="category-header pl-page py-page">
        <h1 class="category-title text-6xl font-bold">{category}</h1>
    </div>

    <div 
        class="category-slider-container" 
        bind:this={slider} 
        on:mousemove={onHandleMouseMove}
        on:touchstart={(e) => handleTouch(e, handleTouchStart)}
        on:touchmove={(e) => handleTouch(e, handleTouchMove)}
        on:touchend={(e) => handleTouch(e, handleTouchEnd)}
    >
        <div class="category-slider gap-lg flex">
            {#each displayedProducts as product}
                <div class="category-card" on:click={() => onProductClick(product)}>
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

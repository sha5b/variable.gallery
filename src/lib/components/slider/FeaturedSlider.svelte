<script>
    import { handleMouseMove } from '$lib/utils/sliderHelper';
    import { isCartSliderOpen } from '$lib/stores/cartStore';
    import { goto } from '$app/navigation';
    import { handleImageLoad, getProductUrl, getProductImageUrl } from '$lib/utils/mediaUtils';

    /** @type {import('$lib/utils/types').Product[]} */
    export let products;

    let limitedProducts = products
        .slice()
        .sort(() => Math.random() - 0.5);

    /** @type {HTMLElement|null} */
    let slider = null;
    let scrollState = {
        scrollTarget: 0,
        isAnimating: false
    };

    let isCartOpen = false;
    $: isCartSliderOpen.subscribe((value) => {
        isCartOpen = value;
    });

    /**
     * @param {MouseEvent} event
     */
    function onHandleMouseMove(event) {
        if (slider) {
            handleMouseMove(event, slider, scrollState);
        }
    }

    /**
     * @param {number} productId
     */
    function onProductClick(productId) {
        goto(getProductUrl(productId));
    }

    // Add this to handle reactive loading of images
    $: imagePromises = limitedProducts.map(product => ({
        ...product,
        loadedSrc: handleImageLoad(getProductImageUrl(product))
    }));
</script>

<div class="featured-slider-container bg-background" bind:this={slider} on:mousemove={onHandleMouseMove}>
    <div class="featured-slider gap-md">
        {#each limitedProducts as product}
            <div class="featured-card transition-default" on:click={() => onProductClick(product.id)}>
                <div class="tag-container gap-xs">
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

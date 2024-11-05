<script>
    import { handleMouseMove, handleProductClick, preloadImage } from '$lib/utils/sliderHelper';
    import {  isCartSliderOpen } from '$lib/stores/cartStore';
    import { goto } from '$app/navigation';

    export let products;

    // Limit to 20 newest products
    let limitedProducts = products
        .slice()
        .sort((a, b) => new Date(b.date_modified) - new Date(a.date_modified))
        .slice(0, 20);

    let slider;
    let scrollState = {
        scrollTarget: 0,
        isAnimating: false
    };

    // Subscribe to the cart slider state
    let isCartOpen = false;
    $: isCartSliderOpen.subscribe((value) => {
        isCartOpen = value;
    });

    function onHandleMouseMove(event) {
        handleMouseMove(event, slider, scrollState);
    }

    function onProductClick(productId) {
        handleProductClick(productId, goto);
    }

    function getImageSrc(src) {
        return preloadImage(src, '/path/to/fallback.jpg');
    }
</script>

<div class="featured-slider-container" bind:this={slider} on:mousemove={onHandleMouseMove}>
    <div class="featured-slider flex gap-md">
        {#each limitedProducts as product}
            <div class="featured-card" on:click={() => onProductClick(product.id)}>
                <!-- Display Product Tags Above the Image -->
                <div class="tag-container">
                    {#each product.tags as tag}
                        <span class="tag">{tag.name}</span>
                    {/each}
                </div>
                <!-- Product Image -->
                <img src={getImageSrc(product.images[0]?.src)} alt={product.name} class="product-image" />
            </div>
        {/each}
    </div>
</div>

<style>
    .featured-slider-container {
        width: 100%;
        overflow: hidden;
        transition: all 0.3s ease;
    }

    @media (max-width: 767px) {
        .featured-slider-container {
            overflow-x: auto;
            scroll-snap-type: x mandatory;
            -webkit-overflow-scrolling: touch;
        }

        .featured-slider {
            display: flex;
            gap: 1rem;
        }

        .featured-card {
            flex: 0 0 50%;
            scroll-snap-align: start;
            position: relative;
        }
    }

    @media (min-width: 768px) {
        .featured-slider {
            display: flex;
            gap: 1rem;
        }

        .featured-card {
            flex: 0 0 300px;
            height: 50vh;
            position: relative;
            overflow: hidden;
            transition: flex 0.9s ease;
            cursor: pointer;
        }

        .featured-card:hover {
            flex: 0 0 600px;
        }
    }

    .product-image {
        width: 100%;
        height: 100%;
        object-fit: cover;
    }

    .tag-container {
        position: absolute;
        top: 8px;
        left: 8px;
        display: flex;
        gap: 0.25rem;
        flex-wrap: wrap;
        z-index: 10;
    }

    .tag {
        background-color: var(--primary-color);
        color: var(--background-color);
        padding: 0.25rem 0.5rem;
        border-radius: 9999px;
        font-size: 0.75rem;
        font-weight: 600;
    }
</style>

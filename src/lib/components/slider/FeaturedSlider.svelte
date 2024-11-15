<script>
    import { handleMouseMove, handleProductClick, preloadImage } from '$lib/utils/sliderHelper';
    import { isCartSliderOpen } from '$lib/stores/cartStore';
    import { goto } from '$app/navigation';

    export let products;

    let limitedProducts = products
        .slice()
        .sort((a, b) => new Date(b.date_modified) - new Date(a.date_modified))
        .slice(0, 20);

    let slider;
    let scrollState = {
        scrollTarget: 0,
        isAnimating: false
    };

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
        return preloadImage(src, '/placeholder.jpg');
    }
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
                <img src={getImageSrc(product.images[0]?.src)} alt={product.name} class="product-image" />
            </div>
        {/each}
    </div>
</div>

<style>
    /* Base Slider Layout */
    .featured-slider-container {
        width: 100%;
        overflow: hidden;
    }

    .featured-slider {
        display: flex;
    }

    /* Card Styling */
    .featured-card {
        position: relative;
        overflow: hidden;
    }

    /* Tag Container */
    .tag-container {
        position: absolute;
        top: var(--spacing-sm);
        left: var(--spacing-sm);
        display: flex;
        flex-wrap: wrap;
        z-index: 10;
    }

    /* Product Image */
    .product-image {
        width: 100%;
        height: 100%;
        object-fit: cover;
    }

    /* Mobile Styles */
    @media (max-width: 767px) {
        .featured-slider-container {
            overflow-x: auto;
            scroll-snap-type: x mandatory;
            -webkit-overflow-scrolling: touch;
        }

        .featured-card {
            flex: 0 0 50%;
            scroll-snap-align: start;
        }
    }

    /* Desktop Styles */
    @media (min-width: 768px) {
        .featured-card {
            flex: 0 0 300px;
            height: 50vh;
            cursor: pointer;
        }

        .featured-card:hover {
            flex: 0 0 600px;
        }
    }
</style>

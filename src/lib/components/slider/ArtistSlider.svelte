<script>
    import { handleMouseMove, handleProductClick, preloadImage } from '$lib/utils/sliderHelper';
    import { goto } from '$app/navigation';

    export let products = [];
    export let artistName = '';

    $: filteredProducts = products.filter(product =>
        product.attributes.some(attr => attr.name.toLowerCase() === 'artist' && attr.options.includes(artistName))
    );
    console.log('Filtered Products:', filteredProducts);
    console.log('Artist Name:', artistName);
    console.log('Products:', products);
    let slider;
    let scrollState = {
        scrollTarget: 0,
        isAnimating: false
    };

    function onHandleMouseMove(event) {
        handleMouseMove(event, slider, scrollState);
    }

    function onProductClick(product) {
        handleProductClick(product.id, goto);
    }

    function getImageSrc(src) {
        return preloadImage(src, 'static/placeholder.jpg');
    }
</script>

<section class='artist-slider-section '>
    <div class="artist-slider-container" bind:this={slider} on:mousemove={onHandleMouseMove}>
        <div class="artist-slider gap-lg flex">
            {#each filteredProducts as product}
                <div class="artist-card" on:click={() => onProductClick(product)}>
                    <div class="product-tag-container">
                        {#each product.tags as tag}
                            <span class="tag">{tag.name}</span>
                        {/each}
                    </div>
                    <img src={getImageSrc(product.images[0]?.src)} alt={product.name} class="product-image" />
                </div>
            {/each}
        </div>
    </div>
</section>

<style>
    .artist-slider-container {
        width: 100%;
        overflow: hidden;
        transition: all 0.3s ease;
    }

    .artist-slider-header {
        display: flex;
        align-items: center;
        gap: var(--spacing-lg);
    }

    .artist-slider-title {
        color: var(--primary-color);
        padding: var(--spacing-sm) 0;
    }

    .artist-slider {
        display: flex;
        gap: var(--spacing-md);
    }

    .artist-card {
        flex: 0 0 300px;
        height: 300px;
        position: relative;
        overflow: hidden;
        transition: flex 0.9s ease;
        cursor: pointer;
    }

    .artist-card:hover {
        flex: 0 0 600px;
    }

    .product-image {
        width: 100%;
        height: 100%;
        object-fit: cover;
    }

    .product-tag-container {
        position: absolute;
        top: var(--spacing-xs);
        left: var(--spacing-xs);
        display: flex;
        gap: var(--spacing-sm);
        flex-wrap: wrap;
        z-index: 10;
    }

    .tag {
        background-color: var(--primary-color);
        color: var(--background-color);
        padding: var(--spacing-xs) var(--spacing-sm);
        border-radius: 9999px;
        font-size: var(--font-size-small);
        font-weight: 600;
    }

    /* Responsive styles */
    @media (max-width: 767px) {
        .artist-slider-container {
            overflow-x: auto;
            scroll-snap-type: x mandatory;
            -webkit-overflow-scrolling: touch;
        }

        .artist-slider {
            gap: var(--spacing-sm);
        }

        .artist-card {
            flex: 0 0 80%;
            scroll-snap-align: start;
        }
    }
</style>

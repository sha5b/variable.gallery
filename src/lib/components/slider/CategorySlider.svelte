<script>
    import { handleMouseMove, handleProductClick, preloadImage } from '$lib/utils/sliderHelper';
    import { goto } from '$app/navigation';

    export let products = [];
    export let category = '';

    $: filteredProducts = products.filter((product) =>
        product.categories.some((cat) => cat.name === category)
    );

    $: displayedProducts = filteredProducts
        .slice()
        .sort((a, b) => new Date(b.date_modified) - new Date(a.date_modified));

    let slider;
    let scrollState = {
        scrollTarget: 0,
        isAnimating: false
    };

    function onHandleMouseMove(event) {
        handleMouseMove(event, slider, scrollState);
    }

    function onProductClick(product) {
        goto(`/shop/${product.id}`, { replaceState: false });
    }

    function getImageSrc(src) {
        return preloadImage(src, '/placeholder.jpg');
    }
</script>

<section class='mt-12 '>
    <div class="category-header pl-page py-page">
        <h1 class="category-title text-6xl font-bold">{category}</h1>
    </div>

    <div class="category-slider-container" bind:this={slider} on:mousemove={onHandleMouseMove}>
        <div class="category-slider gap-lg flex">
            {#each displayedProducts as product}
                <div class="category-card" on:click={() => onProductClick(product)}>
                    <div class="product-tag-container">
                        {#each product.tags as tag}
                            <span class="pill pill-primary pill-sm">{tag.name}</span>
                        {/each}
                    </div>
                    <img src={getImageSrc(product.images[0]?.src)} alt={product.name} class="product-image" />
                </div>
            {/each}
        </div>
    </div>
</section>

<style>
    .category-slider-container {
        width: 100%;
        overflow: hidden;
        padding-left: var(--spacing-md);
        padding-bottom: var(--spacing-lg);
        transition: all 0.3s ease;
    }

    .category-header {
        display: flex;
        align-items: center;
        gap: var(--spacing-lg);
    }

    .category-title {
        color: var(--primary-color);
        padding: var(--spacing-sm) 0;
    }

    .category-slider {
        display: flex;
        gap: var(--spacing-md);
    }

    .category-card {
        flex: 0 0 250px;
        height: 600px;
        position: relative;
        overflow: hidden;
        transition: flex 0.9s ease;
        cursor: pointer;
    }

    .category-card:hover {
        flex: 0 0 500px;
    }

    .product-image {
        width: 100%;
        height: 100%;
        object-fit: cover;
    }

    .product-tag-container {
        position: absolute;
        top: var(--spacing-sm);
        left: var(--spacing-sm);
        display: flex;
        gap: var(--spacing-xs);
        flex-wrap: wrap;
        z-index: 10;
        padding: var(--spacing-xs);
    }

    /* Responsive styles */
    @media (max-width: 767px) {
        .category-slider-container {
            overflow-x: auto;
            scroll-snap-type: x mandatory;
            -webkit-overflow-scrolling: touch;
        }

        .category-slider {
            gap: var(--spacing-sm);
        }

        .category-card {
            flex: 0 0 80%;
            scroll-snap-align: start;
        }
    }
</style>

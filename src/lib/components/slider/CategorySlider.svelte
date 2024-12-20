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
        window.location.href = `/shop/${product.id}`;
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

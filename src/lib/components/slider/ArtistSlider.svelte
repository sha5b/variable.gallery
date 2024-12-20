<script>
    import { handleMouseMove, handleProductClick } from '$lib/utils/sliderHelper';
    import { goto } from '$app/navigation';
    import { navigating } from '$app/stores';

    export let products = [];
    export let artistName = '';

    $: filteredProducts = products.filter(product =>
        product.attributes.some(attr => attr.name.toLowerCase() === 'artist' && attr.options.includes(artistName))
    );

    let slider;
    let scrollState = {
        scrollTarget: 0,
        isAnimating: false
    };

    function onHandleMouseMove(event) {
        handleMouseMove(event, slider, scrollState);
    }

    async function onProductClick(product) {
        window.location.href = `/shop/${product.id}`;
    }

    async function loadImage(src) {
        if (!src) return '/placeholder.jpg';
        
        try {
            await new Promise((resolve, reject) => {
                const img = new Image();
                img.onload = resolve;
                img.onerror = reject;
                img.src = src;
            });
            return src;
        } catch (error) {
            console.error('Error loading image:', error);
            return '/placeholder.jpg';
        }
    }
</script>

<section class='artist-slider-section'>
    <div class="artist-slider-container" bind:this={slider} on:mousemove={onHandleMouseMove}>
        <div class="artist-slider gap-lg flex">
            {#each filteredProducts as product}
                <div class="artist-card" on:click={() => onProductClick(product)}>
                    <div class="product-tag-container">
                        {#each product.tags as tag}
                            <span class="pill pill-primary pill-sm">{tag.name}</span>
                        {/each}
                    </div>
                    {#await loadImage(product.images[0]?.src)}
                        <img src="/placeholder.jpg" alt="Loading..." class="product-image" />
                    {:then src}
                        <img {src} alt={product.name} class="product-image" />
                    {/await}
                </div>
            {/each}
        </div>
    </div>
</section>

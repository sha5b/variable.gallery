<script>
    import { handleMouseMove, handleProductClick, preloadImage } from '$lib/utils/sliderHelper';
    import { isCartSliderOpen } from '$lib/stores/cartStore';
    import { goto } from '$app/navigation';

    export let products;

    let limitedProducts = products
        .slice()
        .sort(() => Math.random() - 0.5)
        

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

    async function getImageSrc(src) {
        if (!src) return '/placeholder.jpg';
        
        try {
            // Create a promise to load the image
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

    // Add this to handle reactive loading of images
    $: imagePromises = limitedProducts.map(product => ({
        ...product,
        loadedSrc: getImageSrc(product.images[0]?.src)
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
                {#await getImageSrc(product.images[0]?.src)}
                    <img src="/placeholder.jpg" alt="Loading..." class="product-image" />
                {:then src}
                    <img {src} alt={product.name} class="product-image" />
                {/await}
            </div>
        {/each}
    </div>
</div>

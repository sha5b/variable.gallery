<script>
  import { onMount, onDestroy, tick } from 'svelte';
  import { goto } from '$app/navigation';
  import { initialize3DParticles } from '$lib/utils/particleSimulation.js';

  export let products = [];
  export let artistName = "";
  export let artistDescription = "";
  export let artistLink = "";

  let container; // Reference to the artist's container
  let resizeObserver;
  let cleanupParticles; // To store the cleanup function
  let containerWidth;
  let containerHeight;

  // Filter products by artist name
  $: filteredProducts = products.filter(product =>
    product.attributes.some(attr => attr.name.toLowerCase() === 'artist' && attr.options.includes(artistName))
  );

  // Initialize the particle simulation once the component mounts
  onMount(async () => {
    await tick(); // Wait for the DOM to update

    if (container) {
      const initializeParticles = () => {
        // Get container dimensions
        containerWidth = container.clientWidth;
        containerHeight = container.clientHeight;

        // Initialize 3D particles with accurate dimensions
        if (cleanupParticles) cleanupParticles(); // Clean up previous instance
        cleanupParticles = initialize3DParticles(
          container.querySelectorAll('.sphere-item'),
          container,
          containerWidth,
          containerHeight,
          200,
          0.003
        );
      };

      initializeParticles();

      // Observe container size changes
      resizeObserver = new ResizeObserver(() => {
        initializeParticles();
      });

      resizeObserver.observe(container);
    }
  });

  onDestroy(() => {
    if (resizeObserver) {
      resizeObserver.disconnect();
    }
    if (cleanupParticles) {
      cleanupParticles();
    }
  });
</script>

<div bind:this={container} class="artist-container">
  {#each filteredProducts as product}
    <div class="sphere-item" on:click={() => goto(`/shop/${product.id}`)}>
      <div class="scale-wrapper">
        <div class="image-wrapper">
          <img 
            src={product.images[0]?.src || '/path/to/fallback.jpg'} 
            alt={product.name} 
            class="product-image" 
            loading="lazy"
          />
          <div class="overlay">
            <h3 class="product-name">{product.name}</h3>
            <p class="product-category">{product.category}</p>
          </div>
        </div>
      </div>
    </div>
  {/each}
</div>

<style>
  .artist-container {
    position: relative;
    width: 100%;
    height: 600px; /* Set a specific height */
    perspective: 3000px;
    transform-style: preserve-3d;
    overflow: hidden;
  }

  .sphere-item {
    position: absolute;
    width: 25%; /* Adjust as needed */
    height: 25%; /* Adjust as needed */
    top: 0;
    left: 0;
    transform-origin: center;
    cursor: pointer;
    transition: opacity 0.3s ease, transform 0.3s ease, left 0.3s ease, top 0.3s ease;
    will-change: transform, opacity, left, top;
  }

  .scale-wrapper {
    width: 100%;
    height: 100%;
    transition: transform 0.3s ease, opacity 0.3s ease;
    transform: scale(0.5);
    opacity: 0.9;
    position: relative;
  }

  .sphere-item:hover .scale-wrapper {
    transform: scale(1.5);
    opacity: 1;
    z-index: 1000; /* Bring to front */
  }

  .image-wrapper {
    position: relative;
    display: inline-block;
    width: 100%;
    height: 100%;
  }

  .product-image {
    display: block;
    width: 100%;
    height: 100%;
    object-fit: cover;
  }

  .overlay {
    position: absolute;
    top: 0;
    left: 0;
    width: 100%;
    height: 100%;
    background-color: rgba(0, 0, 0, 0.6);
    color: #fff;
    display: flex;
    justify-content: center;
    align-items: center;
    opacity: 0;
    transition: opacity 0.3s ease;
  }

  .scale-wrapper:hover .overlay {
    opacity: 1;
  }

  .product-name,
  .product-category {
    margin: 0;
    font-size: 1rem;
  }
</style>

<script>
  import { onMount, onDestroy } from 'svelte';
  import { goto } from '$app/navigation';
  import { initialize3DParticles } from '$lib/utils/particleSimulation.js';

  export let products = [];
  export let artistName = "";
  export let artistDescription = "";
  export let artistLink = "";

  let container; // Reference to the artist's container
  let resizeObserver;

  // Filter products by artist name
  $: filteredProducts = products.filter(product =>
    product.attributes.some(attr => attr.name.toLowerCase() === 'artist' && attr.options.includes(artistName))
  );

  // Initialize the particle simulation once the component mounts
  onMount(() => {
    if (container) {
      const containerRect = container.getBoundingClientRect();
      console.log('Initial Container Width:', containerRect.width);
      console.log('Initial Container Height:', containerRect.height);

      // Initialize 3D particles with accurate dimensions
      initialize3DParticles(
        container.querySelectorAll('.sphere-item'),
        container,
        containerRect.width,
        containerRect.height,
        200,
        0.003
      );

      // Observe container size changes
      resizeObserver = new ResizeObserver(entries => {
        for (let entry of entries) {
          const { width, height } = entry.contentRect;
          console.log('Resized Container Width:', width);
          console.log('Resized Container Height:', height);

          // Re-initialize particles with new dimensions
          initialize3DParticles(
            container.querySelectorAll('.sphere-item'),
            container,
            width,
            height,
            200,
            0.003
          );
        }
      });

      resizeObserver.observe(container);
    }
  });

  onDestroy(() => {
    if (resizeObserver) {
      resizeObserver.disconnect();
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
  height: 100%;
  perspective: 3000px;
  transform-style: preserve-3d;
  overflow: hidden;
}

.sphere-item {
  position: absolute;
  top: 50%;
  left: 50%;
  transform-origin: center;
  cursor: pointer;
  /* Initial transform for positioning */
  transform: translate(-50%, -50%);
  transition: opacity 0.3s ease;
  /* Enable hardware acceleration */
  will-change: transform, opacity;
}

.scale-wrapper {
  transition: transform 0.3s ease, opacity 0.3s ease;
  transform: scale(0.5);
  opacity: 0.9;
  /* Ensure stacking context */
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
}

.product-image {
  display: block;
  height: 50%; /* Define a fixed height for consistency */
  object-fit: cover;
  border-radius: 8px; /* Optional: Adds rounded corners */
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
  border-radius: 8px;
}

.scale-wrapper:hover .overlay {
  opacity: 1;
}

.product-name {
  margin: 0;
  font-size: 1rem;
}

.product-category {
  margin: 0;
  font-size: 1rem;
}
</style>

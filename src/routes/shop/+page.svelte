<script>
    import { goto } from '$app/navigation';
    import FeaturedSlider from '$lib/components/FeaturedSlider.svelte';
  
    export let data;
    const { products, error } = data;
  
    let productsByCategory = {};
  
    // Organize products by category
    if (products) {
      products.forEach(product => {
        product.categories.forEach(category => {
          if (!productsByCategory[category.name]) {
            productsByCategory[category.name] = [];
          }
          productsByCategory[category.name].push(product);
        });
      });
    }
  
    function goToProduct(productId) {
      goto(`/shop/${productId}`);
    }
  </script>
  
  <div class="container">
    {#if error}
      <p class="text-red-500">{error}</p>
    {:else}
      <div class="grid-container">
        {#each Object.keys(productsByCategory) as categoryName}
          <div class="category-container">
            <h2 class="text-2xl font-semibold my-4">{categoryName}</h2>
            
            <!-- Use FeaturedSlider for each category's products -->
            <FeaturedSlider products={productsByCategory[categoryName]} />
            
          </div>
        {/each}
      </div>
    {/if}
  </div>
  
  <style>
    .container {
      max-width: 100%;
      padding: 1rem;
      padding-top:4rem;
    }
  
    .grid-container {
      display: grid;
      grid-template-columns: 1fr 1fr;
      gap: 1rem;
    }
  
    .category-container {
      position: relative;
      overflow: hidden;
      padding: 1rem;
      box-sizing: border-box;
      background-color: #f9f9f9;
    }
  </style>
  
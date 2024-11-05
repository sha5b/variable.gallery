<script>
  import { goto } from '$app/navigation';
  import FeaturedSlider from '$lib/components/slider/FeaturedSlider.svelte';
  import TagDisplay from '$lib/components/Filter.svelte';

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

<div class="shop-container px-page bg-background">
  {#if error}
    <p class="text-error">{error}</p>
  {:else}
    <div class="grid grid-cols-1 gap-md md:grid-cols-2 mb-8">
      {#each Object.keys(productsByCategory) as categoryName}
        <div class="category-container w-full transition-default">
          <h2 class="text-xl font-semibold my-sm text-primary">
            {categoryName}
          </h2>
          
          <!-- Use FeaturedSlider for each category's products -->
          <FeaturedSlider products={productsByCategory[categoryName]} />
          
        </div>
      {/each}
    </div>
  {/if}
  <TagDisplay {products} />
</div>

<style>
  .shop-container {
    background-color: var(--background-color);
  }
  
  .category-container {
    position: relative;
    overflow: hidden;
    box-sizing: border-box;
  }

  .text-error {
    color: var(--error-color);
  }

</style>
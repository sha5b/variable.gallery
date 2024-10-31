<script>
  import { goto } from '$app/navigation';
  import FeaturedSlider from '$lib/components/FeaturedSlider.svelte';
  import TagDisplay from '$lib/components/TagDisplay.svelte';

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

<div class="shop-container w-full px-[var(--page-padding)] pt-[var(--spacing-xl)]">
  {#if error}
    <p class="text-[var(--error-color)]">{error}</p>
  {:else}
    <div class="grid grid-cols-1 gap-[var(--spacing-md)] md:grid-cols-2">
      {#each Object.keys(productsByCategory) as categoryName}
        <div class="category-container w-full bg-[var(--background-color-alt)] rounded-lg">
          <h2 class="text-[var(--font-size-large)] font-semibold my-[var(--spacing-sm)] text-[var(--text-color)]">
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
</style>

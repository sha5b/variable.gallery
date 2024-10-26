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

<div class="w-full p-4 pt-16">
  {#if error}
    <p class="text-red-500">{error}</p>
  {:else}
    <div class="grid grid-cols-1 md:grid-cols-2 gap-4 w-full">
      {#each Object.keys(productsByCategory) as categoryName}
        <div class="category-container w-full">
          <h2 class="text-2xl font-semibold my-4">{categoryName}</h2>
          
          <!-- Use FeaturedSlider for each category's products -->
          <FeaturedSlider products={productsByCategory[categoryName]} />
          
        </div>
      {/each}
    </div>
  {/if}
</div>

<style>
.category-container {
    position: relative;
    overflow: hidden;
    padding: 1rem;
    box-sizing: border-box;
    background-color: #f9f9f9;
}
</style>

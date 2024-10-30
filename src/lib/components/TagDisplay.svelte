<script>
  import { goto } from '$app/navigation';
  import { fade, fly } from 'svelte/transition';

  export let products;
  let selectedTag = null;
  let selectedCategory = null;

  // Filter products based on selected tag or category
  $: filteredProducts = products.filter(product => 
    (!selectedTag || product.tags.some(tag => tag.name === selectedTag)) &&
    (!selectedCategory || product.categories.some(cat => cat.name === selectedCategory))
  );

  function handleTagClick(tag) {
    selectedTag = selectedTag === tag ? null : tag;
  }

  function handleCategoryClick(category) {
    selectedCategory = selectedCategory === category ? null : category;
  }

  // Extract unique tags and categories from products
  let uniqueTags = [...new Set(products.flatMap(product => product.tags.map(tag => tag.name)))];
  let uniqueCategories = [...new Set(products.flatMap(product => product.categories.map(cat => cat.name)))];
</script>

<div class="mx-auto space-y-[var(--spacing-md)] py-[var(--spacing-lg)]">
  <div class="flex flex-col md:flex-row items-stretch gap-[var(--spacing-lg)]">
    <!-- Sidebar Filter Section -->
    <aside class="filter-container p-[var(--spacing-md)] rounded-lg w-full md:w-1/4">
      <h2 class="font-bold mb-[var(--spacing-sm)] text-[var(--font-size-large)]">Filter by Category</h2>
      <div class="flex flex-wrap gap-[var(--spacing-sm)] mb-[var(--spacing-md)]">
        {#each uniqueCategories as category}
          <span
            on:click={() => handleCategoryClick(category)}
            class={`pill-button ${
              selectedCategory === category ? 'pill-selected' : 'pill-default'
            }`}
          >
            {category}
          </span>
        {/each}
      </div>

      <h2 class="font-bold mb-[var(--spacing-sm)] text-[var(--font-size-large)]">Filter by Tag</h2>
      <div class="flex flex-wrap gap-[var(--spacing-sm)]">
        {#each uniqueTags as tag}
          <span
            on:click={() => handleTagClick(tag)}
            class={`pill-button ${
              selectedTag === tag ? 'pill-selected' : 'pill-default'
            }`}
          >
            {tag}
          </span>
        {/each}
      </div>
    </aside>

    <!-- Product Grid -->
    <div class="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-[var(--spacing-md)] w-full">
      {#each filteredProducts as product (product.id)}
        <div in:fly={{ x: 20, duration: 400 }} out:fly={{ x: -20, duration: 300 }}>
          <div
            in:fade={{ duration: 300 }} out:fade={{ duration: 200 }}
            class="featured-card relative group h-80 overflow-hidden rounded-lg bg-[var(--background-color)] transition-transform"
            on:click={() => goto(`/shop/${product.id}`)}
          >
            <img src={product.images[0]?.src} alt={product.name} class="product-image w-full h-full object-cover rounded-lg" />
            <!-- Overlay with Product Title and Tags -->
            <div class="absolute inset-0 bg-black bg-opacity-50 opacity-0 group-hover:opacity-100 transition-opacity flex flex-col justify-center items-center text-center p-[var(--spacing-md)]">
              <h3 class="text-lg font-bold text-[var(--background-color)] mb-[var(--spacing-sm)]">{product.name}</h3>
              <div class="flex gap-[var(--spacing-xs)] flex-wrap justify-center">
                {#each product.tags as tag}
                  <span class="bg-[var(--primary-color)] text-[var(--background-color)] px-[var(--spacing-sm)] py-[var(--spacing-xs)] rounded-full text-sm">
                    {tag.name}
                  </span>
                {/each}
              </div>
            </div>
          </div>
        </div>
      {/each}
    </div>
  </div>
</div>

<style>
  /* Filter Container Styling */
  .filter-container {
    background-color: var(--background-color);
    color: var(--text-color);
  }

  /* Pill Button Styling */
  .pill-button {
    padding: var(--spacing-xs) var(--spacing-md);
    border-radius: 9999px;
    font-size: var(--font-size-small);
    cursor: pointer;
    transition: background-color 0.3s ease, color 0.3s ease;
  }

  .pill-default {
    background-color: var(--background-color);
    color: var(--primary-color);
  }

  .pill-selected {
    background-color: var(--primary-color);
    color: var(--background-color);
  }

  .featured-card {
    flex: 0 0 300px;
    height: 50vh;
    position: relative;
    overflow: hidden;
    border-radius: var(--spacing-xs);
    transition: flex 0.9s ease;
    cursor: pointer;
  }

  .featured-card:hover {
    flex: 0 0 600px;
  }

  .product-image {
    width: 100%;
    height: 100%;
    object-fit: cover;
  }
</style>

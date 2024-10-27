<script>
  import { goto } from '$app/navigation';
  import { fade, fly } from 'svelte/transition';

  export let products;

  let selectedTag = null;
  let selectedCategory = null;

  // Dynamically set initial min and max prices based on product prices
  const prices = products.map(product => product.price || 0);
  let minProductPrice = Math.min(...prices);
  let maxProductPrice = Math.max(...prices);
  let minPrice = minProductPrice;
  let maxPrice = maxProductPrice;

  // Filter products based on selected tag, category, and price range
  $: filteredProducts = products.filter(product => 
    (!selectedTag || product.tags.some(tag => tag.name === selectedTag)) &&
    (!selectedCategory || product.categories.some(cat => cat.name === selectedCategory)) &&
    (product.price >= minPrice && product.price <= maxPrice)
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

<div class="space-y-[var(--spacing-md)] py-[var(--spacing-lg)]">
  <!-- Sidebar Filter Section -->


  <!-- Product Grid -->
  <div class="col-span-1 md:col-span-3 grid grid-cols-2 md:grid-cols-4 gap-[var(--spacing-md)]">
    <aside class="bg-[var(--primary-color)] p-[var(--spacing-md)] rounded-lg text-[var(--background-color)] col-span-1 pb-14">
      <h2 class="font-bold mb-[var(--spacing-sm)] text-[var(--font-size-large)]">Category</h2>
      <div class="flex flex-wrap gap-[var(--spacing-sm)] mb-[var(--spacing-md)]">
        {#each uniqueCategories as category}
          <span
            on:click={() => handleCategoryClick(category)}
            class={`px-[var(--spacing-md)] py-[var(--spacing-xs)] rounded-full cursor-pointer text-[var(--font-size-small)] ${
              selectedCategory === category ? 'bg-[var(--accent-color)] text-[var(--primary-color)]' : 'bg-[var(--background-color)] text-[var(--text-color)]'
            }`}
          >
            {category}
          </span>
        {/each}
      </div>
  
      <h2 class="font-bold mb-[var(--spacing-sm)] text-[var(--font-size-large)]">Tag</h2>
      <div class="flex flex-wrap gap-[var(--spacing-sm)] mb-[var(--spacing-md)]">
        {#each uniqueTags as tag}
          <span
            on:click={() => handleTagClick(tag)}
            class={`px-[var(--spacing-md)] py-[var(--spacing-xs)] rounded-full cursor-pointer text-[var(--font-size-small)] ${
              selectedTag === tag ? 'bg-[var(--accent-color)] text-[var(--primary-color)]' : 'bg-[var(--background-color)] text-[var(--text-color)]'
            }`}
          >
            {tag}
          </span>
        {/each}
      </div>
  
      <!-- Min-Max Price Slider -->
      <h2 class="font-bold mb-[var(--spacing-sm)] text-[var(--font-size-large)]">Filter by Price (€{minPrice} - €{maxPrice})</h2>
      <div class="relative flex items-center w-full">
        <input 
          type="range" 
          min={minProductPrice} 
          max={maxProductPrice} 
          bind:value={minPrice} 
          class="price-slider"
          style="--slider-color: var(--accent-color); --handle-color: var(--secondary-color);"
        />
        <input 
          type="range" 
          min={minProductPrice} 
          max={maxProductPrice} 
          bind:value={maxPrice} 
          class="price-slider"
          style="--slider-color: var(--accent-color); --handle-color: var(--secondary-color);"
        />
      </div>
    </aside>
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

<style>
  .price-slider {
    -webkit-appearance: none;
    width: 100%;
    height: 4px;
    background: var(--slider-color);
    outline: none;
    position: absolute;
    pointer-events: none;
    /* To avoid stacking and allow two sliders to interact */
  }

  .price-slider::-webkit-slider-thumb {
    -webkit-appearance: none;
    appearance: none;
    width: 2px;
    height: 20px;
    background: var(--handle-color);
    cursor: pointer;
    z-index: 10;
    pointer-events: all;
    /* Use line-style handle */
  }

  .price-slider::-moz-range-thumb {
    width: 2px;
    height: 20px;
    background: var(--handle-color);
    cursor: pointer;
    pointer-events: all;
    z-index: 10;
    /* Use line-style handle */
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

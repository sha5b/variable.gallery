<script>
  import { goto } from '$app/navigation';
  import { fade, fly } from 'svelte/transition';

  export let products;
  let selectedTag = null;

  // Filter products based on selected tag
  $: filteredProducts = selectedTag
    ? products.filter(product => product.tags.some(tag => tag.name === selectedTag))
    : products;

  function handleTagClick(tag) {
    selectedTag = selectedTag === tag ? null : tag;
  }

  // Extract unique tags from products
  let uniqueTags = [...new Set(products.flatMap(product => product.tags.map(tag => tag.name)))];
</script>

<div class="w-full h-full space-y-8 pb-8">
  <!-- Tag Pills -->
  <div class="flex w-full gap-6">
    <div class="bg-purple-600 p-4 flex gap-4 flex-wrap rounded-lg" style="width: fit-content;">
      {#each uniqueTags as tag}
        <span
          on:click={() => handleTagClick(tag)}
          class={`px-4 py-2 rounded-full cursor-pointer ${
            selectedTag === tag ? 'bg-purple-700 text-white' : 'bg-gray-50 text-gray-600'
          }`}
        >
          {tag}
        </span>
      {/each}
    </div>
    <!-- Right Box Hidden on Mobile -->
    <div class="hidden md:flex flex-grow bg-gray-100 rounded-lg"></div>
  </div>

  <!-- Product Grid -->
  <div class="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6 w-full">
    {#each filteredProducts as product (product.id)}
      <div in:fly={{ x: 20, duration: 400 }} out:fly={{ x: -20, duration: 300 }}>
        <div
          in:fade={{ duration: 300 }} out:fade={{ duration: 200 }}
          class="featured-card relative group w-full h-80 overflow-hidden rounded-lg bg-gray-100 transition-transform"
          on:click={() => goto(`/shop/${product.id}`)}
          style="cursor: pointer;"
        >
          <img src={product.images[0]?.src} alt={product.name} class="product-image w-full h-full object-cover" />
          <!-- Overlay with Product Title and Tags -->
          <div class="absolute inset-0 bg-black bg-opacity-50 opacity-0 group-hover:opacity-100 transition-opacity flex flex-col justify-center items-center text-center p-4">
            <h3 class="text-lg font-bold text-white mb-2">{product.name}</h3>
            <div class="flex gap-2 flex-wrap justify-center">
              {#each product.tags as tag}
                <span class="bg-purple-600 text-white px-3 py-2 rounded-full text-sm">
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
  .featured-card {
    flex: 0 0 300px;
    height: 50vh;
    position: relative;
    overflow: hidden;
    border-radius: 10px;
    transition: flex 0.9s ease;
  }

  .featured-card:hover {
    flex: 0 0 600px;
  }

  .product-image {
    width: 100%;
    height: 100%;
    object-fit: cover;
    border-radius: 10px;
  }

  .tag-container {
    padding: 0.5rem;
    border-radius: 0.5rem;
  }

  .featured-card {
    cursor: pointer;
  }
</style>

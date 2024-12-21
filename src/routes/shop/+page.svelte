<script>
  import { organizeProductsByCategory } from '$lib/utils/productUtils';
  import { goto } from '$app/navigation';
  import FeaturedSlider from '$lib/components/slider/FeaturedSlider.svelte';
  import ProductFilter from '$lib/components/ProductFilter.svelte';
  import PageSEO from '$lib/components/base/PageSEO.svelte';
  import { PAGE_TYPES } from '$lib/utils/constants.js';

  /** @type {import('$lib/utils/types').PageData} */
  export let data;
  const { products = [] } = data;

  // Organize products by category using utility function
  const productsByCategory = organizeProductsByCategory(products);

  /**
   * @param {number} productId
   */
  function goToProduct(productId) {
    goto(`/shop/${productId}`);
  }
</script>

<PageSEO pageType="SHOP" {data} />

<div class="page-container">
    <div class="content-section space-y-md">
        <section class="space-y-sm">
            <p>
                Explore our curated collection of digital artworks, NFTs, and experimental media. 
                Each piece is carefully selected to represent the forefront of digital art innovation.
            </p>
        </section>

        <section class="space-y-md">
            <div class="grid grid-cols-1 gap-lg md:grid-cols-2">
                {#each Object.keys(productsByCategory) as categoryName}
                    <div class="category-container w-full">
                        <h3 class="h3">
                            {categoryName}
                        </h3>
                        <FeaturedSlider products={productsByCategory[categoryName]} />
                    </div>
                {/each}
            </div>
        </section>

        <section class="space-y-md">
            <h2 class="section-title">Browse All Art</h2>
            <ProductFilter {products} />
        </section>
    </div>
</div>

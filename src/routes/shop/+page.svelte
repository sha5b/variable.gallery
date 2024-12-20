<script>
  /**
   * @typedef {Object} MetaTag
   * @property {string} [name]
   * @property {string} [property]
   * @property {any} content
   */

  /**
   * @typedef {Object} Image
   * @property {string} src
   */

  /**
   * @typedef {Object} Category
   * @property {string} name
   */

  /**
   * @typedef {Object} Tag
   * @property {string} name
   */

  /**
   * @typedef {Object} Attribute
   * @property {string} name
   * @property {string[]} options
   */

  /**
   * @typedef {Object} Product
   * @property {number} id
   * @property {string} name
   * @property {string} price
   * @property {string} date_created
   * @property {Tag[]} tags
   * @property {Category[]} categories
   * @property {string} description
   * @property {Image[]} images
   * @property {Attribute[]} attributes
   */

  import { defaultSEO, generateMetaTags } from '$lib/utils/seo';
  import { goto } from '$app/navigation';
  import FeaturedSlider from '$lib/components/slider/FeaturedSlider.svelte';
  import ProductFilter from '$lib/components/ProductFilter.svelte';

  /** @type {{products: Product[]}} */
  export let data;
  const { products } = data;

  // Create page-specific SEO by extending defaultSEO
  const pageSEO = {
    ...defaultSEO,
    title: 'Shop Digital Art | variable.gallery',
    description: 'Browse and collect unique digital artworks, NFTs, and experimental media. Discover limited editions and original pieces from emerging and established artists.',
    keywords: [
      ...defaultSEO.keywords,
      'buy digital art',
      'collect NFTs',
      'digital art marketplace',
      'limited editions',
      'original artwork',
      'art collection'
    ],
    openGraph: {
      ...defaultSEO.openGraph,
      title: 'Shop Digital Art | variable.gallery',
      description: 'Browse and collect unique digital artworks, NFTs, and experimental media. Discover limited editions and original pieces from emerging and established artists.',
      url: 'https://variable.gallery/shop'
    }
  };

  /** @type {Array<{name?: string, property?: string, content: string}>} */
  $: metaTags = generateMetaTags(pageSEO);

  /** @type {Record<string, Product[]>} */
  let productsByCategory = {};

  // Organize products by category
  if (products) {
    products.forEach((product) => {
      product.categories.forEach((category) => {
        if (!productsByCategory[category.name]) {
          productsByCategory[category.name] = [];
        }
        productsByCategory[category.name].push(product);
      });
    });
  }

  /**
   * @param {number} productId
   */
  function goToProduct(productId) {
    goto(`/shop/${productId}`);
  }
</script>

<svelte:head>
  <title>{pageSEO.title}</title>
  {#each metaTags as tag}
    {#if tag.name}
      <meta name={tag.name} content={tag.content}>
    {:else if tag.property}
      <meta property={tag.property} content={tag.content}>
    {/if}
  {/each}
  <!-- Add structured data for product listing -->
  <script type="application/ld+json">
    {
      "@context": "https://schema.org",
      "@type": "CollectionPage",
      "name": "Digital Art Shop | variable.gallery",
      "description": "{pageSEO.description}",
      "url": "https://variable.gallery/shop",
      "numberOfItems": "{products?.length || 0}",
      "offers": {
        "@type": "AggregateOffer",
        "priceCurrency": "EUR",
        "availability": "https://schema.org/InStock"
      },
      "provider": {
        "@type": "ArtGallery",
        "name": "variable.gallery",
        "url": "https://variable.gallery"
      }
    }
  </script>
</svelte:head>

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

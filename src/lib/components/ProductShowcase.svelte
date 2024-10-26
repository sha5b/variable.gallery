<script>
  // Accept WooCommerce product fields as props
  export let imageSrc = "/path/to/image.jpg"; // Product's main image source
  export let name = "Product Name"; // WooCommerce uses `name` for the title
  export let description = "Product description goes here."; // Use WooCommerce's `description` or `short_description`
  export let buttonText = "Shop Now";
  export let buttonLink = "/shop"; // Use WooCommerce's `permalink` for the product link
</script>

<div class="flex flex-col md:flex-row items-stretch w-full my-8 gap-8">
  <!-- Image Section with larger display on mobile -->
  <div class="w-full md:w-3/4 aspect-w-4 aspect-h-3 md:aspect-w-16 md:aspect-h-6">
    <img src={imageSrc} alt={name} class="w-full h-full object-cover rounded-lg" />
  </div>

  <!-- Text Section aligned to top left -->
  <div class="md:w-1/4 w-full flex flex-col justify-start items-start p-6 bg-[var(--background-color)] rounded-lg">
    <h2 class="text-2xl font-bold mb-4 text-[var(--text-color)]">{name}</h2>
    <p class="text-[var(--text-color)] mb-4">{description}</p>
    <a href={buttonLink} class="bg-[var(--primary-color)] text-[var(--background-color)] py-2 px-4 rounded-md hover:bg-[var(--secondary-color)] transition-colors">
      {buttonText}
    </a>
  </div>
</div>

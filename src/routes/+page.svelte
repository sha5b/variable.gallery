<script>
	import { organizeProductsByCategory } from '$lib/utils/productUtils';
	import FeaturedSlider from '$lib/components/slider/FeaturedSlider.svelte';
	import ContactForm from '$lib/components/ContactForm.svelte';
	import ProductFilter from '$lib/components/ProductFilter.svelte';
	import HeroSection from '$lib/components/HeroSection.svelte';
	import ProductShowcase from '$lib/components/ProductShowcase.svelte';
	import PageSEO from '$lib/components/base/PageSEO.svelte';

	/** @type {import('$lib/utils/types').PageData} */
	export let data;
	const { products = [], artists = [], exhibitions = [], media = [] } = data;

	// Organize products by category using utility function
	const productsByCategory = organizeProductsByCategory(products);
</script>

<PageSEO pageType="HOME" {data} />

<div class="page-container">
	<div class="content-section space-y-md">
		<section class="space-y-md">
			<FeaturedSlider {products} />
		</section>

		<section class="space-y-md">
			<HeroSection />
		</section>

		<section class="space-y-md">
			<h2 class="section-title">Browse Collections</h2>
			<div class="grid grid-cols-1 gap-lg md:grid-cols-2">
				{#each Object.keys(productsByCategory) as categoryName}
					<div class="category-container w-full space-y-sm">
						<h3 class="h3">
							{categoryName}
						</h3>
						<FeaturedSlider products={productsByCategory[categoryName]} />
					</div>
				{/each}
			</div>
		</section>

		<section class="space-y-md">
			<h2 class="section-title">Featured Artists</h2>
			<ProductShowcase {products} {artists} product={data.product} variation={data.variation} />
		</section>

		<section class="space-y-md">
			<h2 class="section-title">Discover Art</h2>
			<ProductFilter {products} />
		</section>
	</div>
</div>

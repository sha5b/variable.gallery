<script>
	// Accept data with products as a prop
	export let data;
	const { products, artists, exhibitions, media } = data;

	// Log data points with clear formatting
	console.log('Products:', {
		count: products.length,
		sample: products[0],
		types: [...new Set(products.map((p) => p.type))]
	});

	console.log('Artists:', {
		count: artists.length,
		names: artists.map((a) => a.name)
	});

	console.log('Exhibitions:', exhibitions);

	console.log('Media:', {
		count: media.length,
		types: [...new Set(media.map((m) => m.media_type))]
	});

	// Import components
	import FeaturedSlider from '$lib/components/slider/FeaturedSlider.svelte';
	import Contact from '$lib/components/Contact.svelte';
	import TagDisplay from '$lib/components/Filter.svelte';
	import Header from '$lib/components/Header.svelte';
	import ProductShowcase from '$lib/components/ProductShowcase.svelte';

	// Function to get a random type and the corresponding latest product thumbnail
	let randomType = '';
	let thumbnail = '';

	function getRandomTypeAndThumbnail() {
		// Collect all types and ensure uniqueness
		const uniqueTypes = [...new Set(products.map((product) => product.type))];
		if (uniqueTypes.length > 0) {
			randomType = uniqueTypes[Math.floor(Math.random() * uniqueTypes.length)];
			const latestProductWithType = products.find((product) => product.type === randomType);
			thumbnail = latestProductWithType ? latestProductWithType.images[0]?.src : '';
		}
	}

	// Call the function to initialize randomType and thumbnail
	getRandomTypeAndThumbnail();

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
</script>

<div class="landing-container px-page">
	<FeaturedSlider {products} />
	<Header />
	<div class="mb-12 grid grid-cols-1 gap-md md:grid-cols-2 mt-12">
		{#each Object.keys(productsByCategory) as categoryName}
			<div class="category-container transition-default w-full">
				<h2 class="my-sm text-6xl font-semibold text-primary">
					{categoryName}
				</h2>

				<!-- Use FeaturedSlider for each category's products -->
				<FeaturedSlider products={productsByCategory[categoryName]} />
			</div>
		{/each}
	</div>
	<ProductShowcase {products} {artists} product={data.product} variation={data.variation} />
	<TagDisplay {products} />
</div>

<style>
	.landing-container {
		width: 100%;
		max-width: 100%;
		overflow-x: hidden;
		box-sizing: border-box;
		position: relative;
	}
</style>

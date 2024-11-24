<script>
	// Accept data with products as a prop
	export let data;
	const { products, artists, exhibitions, media } = data;

	// Log data points with clear formatting
	console.log('Products:', {
		count: products.length,
		sample: products[0],
		types: [...new Set(products.map(p => p.type))]
	});

	console.log('Artists:', {
		count: artists.length,
		names: artists.map(a => a.name)
	});

	console.log('Exhibitions:', exhibitions);

	console.log('Media:', {
		count: media.length,
		types: [...new Set(media.map(m => m.media_type))]
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
</script>

<div class="landing-container px-page">
	<FeaturedSlider {products} />
	<Header />
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

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

	console.log('Exhibitions:', {
		count: exhibitions.length,
		titles: exhibitions.map(e => e.title.rendered),
		virtualCount: exhibitions.filter(e => e.acf.virtual === true).length
	});

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
	import LatestVirtualExhibition from '$lib/components/LatestVirtualExhibition.svelte';
	import VirtualExhibitionGrid from '$lib/components/VirtualExhibitionGrid.svelte';

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

<div class="shop-container px-page bg-background">
	<div class="content w-full max-w-full">
		<!-- Top Featured Slider -->
		<div class="row-start-1 w-full">
			<LatestVirtualExhibition {exhibitions} {media} />
		</div>

		<div class="row-start-1 w-full">
			<FeaturedSlider {products} />
		</div>

		<!-- Bottom Row with Product Banner and Category Grid -->
		<div class="gap-md row-start-2 flex w-full flex-col md:flex-row">
			<!-- Product Banner with Random Tag and Thumbnail -->
			<div class="bg-alt w-full flex-1 md:w-auto">
				<Header />
			</div>

			<!-- Category Display and Contact -->
			<div class="gap-md flex w-full flex-1 flex-col md:w-auto">
				<div class="bg-alt padding-lg"></div>
				<Contact />
			</div>
		</div>
	</div>

	<!-- Product Showcase Component outside the main grid layout -->
	<VirtualExhibitionGrid {exhibitions} {media} />
	<ProductShowcase {products} {artists} />
	<TagDisplay {products} />
</div>

<style>
	.landing-container {
		width: 100vw; /* Ensures it fits the viewport width */
		max-width: 100vw;
		overflow-x: hidden; /* Prevents horizontal overflow */
	}

	.content {
		max-width: 100%; /* Prevents child elements from expanding beyond container */
		width: 100%; /* Full width to prevent overflow */
		box-sizing: border-box;
	}
</style>

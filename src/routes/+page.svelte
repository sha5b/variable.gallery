<script>
	// Accept data with products as a prop
	export let data;
	const { products, artists } = data;

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
	console.log(artists)
	console.log(products)
</script>

<div class="shop-container px-page bg-background">
	<div class="content mx-auto w-full max-w-full">
		<!-- Top Featured Slider -->
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
		padding-inline: var(--page-padding); /* Adds padding on both sides */
		box-sizing: border-box;
	}
</style>

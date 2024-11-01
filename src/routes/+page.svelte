<script>
	// Accept data with products as a prop
	export let data;
	const { products } = data;

	// Import components
	import FeaturedSlider from '$lib/components/FeaturedSlider.svelte';
	import Contact from '$lib/components/Contact.svelte';
	import TagDisplay from '$lib/components/TagDisplay.svelte';
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

<div
	class="landing-container space-y-lg px-page pt-xl md:px-page-md grid min-h-screen grid-rows-[auto_1fr]"
>
	<div>
		<!-- Top Featured Slider -->
			<div class="row-start-1">
				<FeaturedSlider {products} />
			</div>

		<!-- Bottom Row with Product Banner and Category Grid -->
		<div class="gap-md row-start-2 flex flex-col md:flex-row">
			<!-- Product Banner with Random Tag and Thumbnail -->
			<div class="bg-alt flex-1 rounded-lg">
				<Header />
			</div>

			<!-- Category Display and Contact -->
			<div class="gap-md flex flex-1 flex-col">
				<div class="bg-alt padding-lg rounded-lg"></div>
				<Contact />
			</div>
		</div>
	</div>

	<!-- Product Showcase Component outside the main grid layout -->
	<ProductShowcase {products} />

	<TagDisplay {products} />
</div>

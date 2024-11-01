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
	class="landing-container grid min-h-screen grid-rows-[auto_1fr] space-y-[var(--spacing-lg)] px-[var(--page-padding)] pt-[var(--spacing-xl)] md:px-[var(--page-padding-md)]"
>
	<div>
		<!-- Top Featured Slider -->
		<div class="row-start-1 mb-[var(--spacing-lg)]">
			<FeaturedSlider {products} />
		</div>

		<!-- Bottom Row with Product Banner and Category Grid -->
		<div class="row-start-2 flex flex-col gap-[var(--spacing-md)] md:flex-row">
			<!-- Product Banner with Random Tag and Thumbnail -->
			<div class="flex-1 rounded-lg bg-[var(--background-color-alt)]">
				<Header />
			</div>

			<!-- Category Display and Contact -->
			<div class="flex flex-1 flex-col space-y-[var(--spacing-md)]">
				<div class="rounded-lg bg-[var(--background-color-alt)] p-[var(--spacing-lg)]"></div>
				<div class="rounded-lg bg-[var(--background-color)]">
					<Contact />
				</div>
			</div>
		</div>
	</div>

	<!-- Product Showcase Component outside the main grid layout -->
    <ProductShowcase {products} />

	<TagDisplay {products} />
</div>

<style>
	.landing-container {
		padding-top: 4rem;
		background-color: var(--background-color);
		color: var(--text-color);
	}
</style>

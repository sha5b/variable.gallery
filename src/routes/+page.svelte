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

	// Find the latest updated product
	let latestProduct =
		products.length > 0
			? products.sort((a, b) => new Date(b.date_modified) - new Date(a.date_modified))[0]
			: null;

	// Set dynamic buttonLink to the latest product's page
	let buttonLink = latestProduct ? latestProduct.permalink : '/shop';

	// Function to get a random type and the corresponding latest product thumbnail
	let randomType = '';
	let thumbnail = '';

	function getRandomTypeAndThumbnail() {
		// Collect all types and ensure uniqueness
		const uniqueTypes = [...new Set(products.map((product) => product.type))];
		if (uniqueTypes.length > 0) {
			randomType = uniqueTypes[Math.floor(Math.random() * uniqueTypes.length)];
			// Find the latest product of the selected type
			const latestProductWithType = products.find((product) => product.type === randomType);
			thumbnail = latestProductWithType ? latestProductWithType.images[0]?.src : '';
		}
	}

	// Call the function to initialize randomType and thumbnail
	getRandomTypeAndThumbnail();
</script>

<div class="grid h-screen grid-rows-[auto_1fr] space-y-8 px-16 pt-16">
	<div>
		<!-- Top Featured Slider -->
		<div class="row-start-1 mb-8">
			<FeaturedSlider {products} />
		</div>

		<!-- Bottom Row with Product Banner and Category Grid -->
		<div class="row-start-2 flex gap-4">
			<!-- Product Banner with Random Tag and Thumbnail -->
			<div class="flex-1 rounded-lg bg-gray-50 p-8">
				<Header />
			</div>
			<!-- Category Display and Contact -->
			<div class="flex flex-1 flex-col justify-between space-y-4">
				<div class="rounded-lg bg-gray-50 p-8"></div>
				<div class="rounded-lg bg-gray-100 p-8">
					<Contact />
				</div>
			</div>
		</div>
	</div>

	<!-- Product Showcase Component outside the main grid layout -->
	{#if latestProduct}
		<ProductShowcase
			imageSrc={latestProduct.images[0]?.src}
			name={latestProduct.name}
			description={latestProduct.short_description}
			buttonLink={`/shop/${latestProduct.id}`} 
		/>
	{/if}
	<TagDisplay {products} />
</div>

<style>
	/* Additional styling if needed */
</style>

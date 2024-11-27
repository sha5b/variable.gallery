<script>
	import { defaultSEO, generateMetaTags } from '$lib/utils/seo';
	import FeaturedSlider from '$lib/components/slider/FeaturedSlider.svelte';
	import Contact from '$lib/components/Contact.svelte';
	import TagDisplay from '$lib/components/Filter.svelte';
	import Header from '$lib/components/Header.svelte';
	import ProductShowcase from '$lib/components/ProductShowcase.svelte';

	export let data;
	const { products, artists, exhibitions, media } = data;

	// Create landing page-specific SEO
	const pageSEO = {
		...defaultSEO,
		title: 'variable.gallery | Digital Gallery Space',
			description: 'Discover unique digital artworks, NFTs, and experimental media in our virtual gallery. Experience art in a new dimension.',
			keywords: [
				...defaultSEO.keywords,
				'digital artwork',
				'virtual exhibition',
				'contemporary art',
				'crypto art',
				'digital collectibles'
			],
			openGraph: {
				...defaultSEO.openGraph,
				url: 'https://variable.gallery'
			}
	};

	$: metaTags = generateMetaTags(pageSEO);

	// Function to get a random type and the corresponding latest product thumbnail
	let randomType = '';
	let thumbnail = '';

	function getRandomTypeAndThumbnail() {
		const uniqueTypes = [...new Set(products.map((product) => product.type))];
		if (uniqueTypes.length > 0) {
			randomType = uniqueTypes[Math.floor(Math.random() * uniqueTypes.length)];
			const latestProductWithType = products.find((product) => product.type === randomType);
			thumbnail = latestProductWithType ? latestProductWithType.images[0]?.src : '';
		}
	}

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

<svelte:head>
	<title>{pageSEO.title}</title>
	{#each metaTags as tag}
		{#if tag.name}
			<meta name={tag.name} content={tag.content}>
		{:else if tag.property}
			<meta property={tag.property} content={tag.content}>
		{/if}
	{/each}
	<!-- Add structured data for art gallery -->
	<script type="application/ld+json">
		{
			"@context": "https://schema.org",
			"@type": "ArtGallery",
			"name": "variable.gallery",
			"description": "{pageSEO.description}",
			"url": "https://variable.gallery",
			"image": "{pageSEO.openGraph.image}",
			"address": {
				"@type": "PostalAddress",
				"addressLocality": "Berlin",
				"addressCountry": "DE"
			},
			"openingHours": "Mo-Su 00:00-24:00",
			"telephone": "+49000000000",
			"hasOfferCatalog": {
				"@type": "OfferCatalog",
				"name": "Digital Art Collection",
				"itemListElement": [
					{
						"@type": "OfferCatalog",
						"name": "Digital Artworks",
						"itemListElement": []
					},
					{
						"@type": "OfferCatalog",
						"name": "NFT Collections",
						"itemListElement": []
					}
				]
			}
		}
	</script>
</svelte:head>

<div class="landing-container px-page">
	<FeaturedSlider {products} />
	<Header />
	<div class="mb-12 grid grid-cols-1 gap-md md:grid-cols-2 mt-12">
		{#each Object.keys(productsByCategory) as categoryName}
			<div class="category-container transition-default w-full">
				<h2 class="my-sm text-6xl font-semibold text-primary">
					{categoryName}
				</h2>
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

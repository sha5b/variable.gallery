<script>
	import '../app.css';
	import { navigating } from '$app/stores';
	import { page } from '$app/stores';
	import { fade } from 'svelte/transition';

	import Footer from '$lib/components/navigation/Footer.svelte';
	import Navbar from '$lib/components/navigation/Navbar.svelte';
	import CartSlider from '$lib/components/navigation/CartSlider.svelte';
	import LoadingIndicator from '$lib/components/LoadingIndicator.svelte';
	import { isCartSliderOpen, closeCartSlider } from '$lib/stores/cartStore';
	import { defaultSEO, generateMetaTags } from '$lib/utils/seo';

	/**
	 * @typedef {Object} Artist
	 * @property {{rendered: string}} title
	 * @property {string} slug
	 * @property {{location?: string, description?: string}} [acf]
	 */

	/**
	 * @typedef {Object} PageData
	 * @property {Artist[]} artists
	 */

	/**
	 * @typedef {Object} MetaTag
	 * @property {string} [name]
	 * @property {string} [property]
	 * @property {string} content
	 */

	/** @type {PageData} */
	export let data;
	const { artists } = data;
	
	$: isOpen = $isCartSliderOpen;
	$: currentPath = $page.url.pathname;
	
	// Create layout-specific SEO that will serve as fallback
	$: pageSEO = {
		...defaultSEO,
		openGraph: {
			...defaultSEO.openGraph,
			url: `https://variable.gallery${currentPath}`
		}
	};
	
	/** @type {Array<MetaTag>} */
	$: metaTags = generateMetaTags(pageSEO);

	function closeCart() {
		closeCartSlider();
	}
</script>

<svelte:head>
	<!-- Default SEO tags that can be overridden by individual pages -->
	<title>{pageSEO.title}</title>
	{#each metaTags as tag}
		{#if tag.name}
			<meta name={tag.name} content={tag.content}>
		{:else if tag.property}
			<meta property={tag.property} content={tag.content}>
		{/if}
	{/each}
	<link rel="canonical" href={pageSEO.openGraph.url}>
	
	<!-- Global site metadata -->
	<meta charset="utf-8">
	<meta name="viewport" content="width=device-width, initial-scale=1">
	<meta name="theme-color" content="#000000">
	<link rel="icon" href="/favicon.png">
	
	<!-- Structured data for organization -->
	<script type="application/ld+json">
		{
			"@context": "https://schema.org",
			"@type": "Organization",
			"name": "variable.gallery",
			"url": "https://variable.gallery",
			"logo": "https://variable.gallery/logo.png",
			"sameAs": [
				"https://twitter.com/variablegallery",
				"https://instagram.com/variable.gallery"
			]
		}
	</script>
</svelte:head>

<LoadingIndicator isLoading={!!$navigating} />

<div class="site-wrapper">
	<Navbar {artists} />
	<main>
		<slot />
	</main>
	<Footer />
</div>

<CartSlider />

<style>
	.site-wrapper {
		width: 100%;
		max-width: 100vw;
		overflow-x: hidden;
		position: relative;
	}

	main {
		width: 100%;
		max-width: 100%;
		overflow-x: hidden;
	}
</style>

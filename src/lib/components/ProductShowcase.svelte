<script>
	/** @typedef {import('$lib/utils/types').Product} Product */
	/** @typedef {import('$lib/utils/types').Artist} Artist */
	/** @typedef {import('$lib/utils/types').Variation} Variation */
	import ImageGallery from '$lib/components/ImageGallery.svelte';
	import ArtistSlider from '$lib/components/slider/ArtistSlider.svelte';
	import CategorySlider from '$lib/components/slider/CategorySlider.svelte';
	import { addItem, toggleCartSlider } from '$lib/stores/cartStore';
	import { slide } from 'svelte/transition';
	import { goto } from '$app/navigation';
	import { getArtistUrl, getProductUrl, getProductImageUrl } from '$lib/utils/mediaUtils';

	/** @type {Product[]} */
	export let products;
	/** @type {Artist[]} */
	export let artists;
	/** @type {Product|null} */
	export let product = null;
	/** @type {Variation|null} */
	export let variation = null;

	/** @type {string[]} */
	let gallery = [];
	/** @type {Artist|null} */
	let artistInfo = null;
	/** @type {string} */
	let artistName = '';
	/** @type {string} */
	let primaryCategory = '';
	/** @type {boolean} */
	let bioOpen = false;

	$: if (product) {
		gallery = product.images?.map((img) => img.src) || [];
		primaryCategory = product.categories?.[0]?.name || '';
		
		const artistAttr = product.attributes?.find(
			(attr) => attr.name.toLowerCase() === 'artist'
		)?.options[0];
		
		artistInfo = artists.find(
			(artist) => artist.title.rendered.toLowerCase() === artistAttr?.toLowerCase()
		) || null;
		artistName = artistInfo ? artistInfo.title.rendered : '';
	}

	function addToCart() {
		if (product) {
			const cartItem = {
				...product,
				regular_price: variation?.regular_price || product.regular_price,
				variation: variation ? {
					id: variation.id,
					name: variation.name,
					
					price: variation.regular_price,
					stock_quantity: variation.stock_quantity,
					stock_status: variation.stock_status
				} : null
			};
			addItem(cartItem);
			toggleCartSlider();
		}
	}

	// Helper function to get price display
	/**
	 * Helper function to get price display
	 * @param {Product} product
	 * @param {Variation|null} variation
	 * @returns {string}
	 */
	function getPriceDisplay(product, variation) {
		if (product.type === 'variable') {
			return variation?.regular_price 
				? `€${variation.regular_price}` 
				: 'Price not available';
		} else {
			return product.regular_price 
				? `€${product.regular_price}` 
				: 'Price not available';
		}
	}

	// Helper function to get stock status
	/**
	 * Helper function to get stock status
	 * @param {Product} product
	 * @param {Variation|null} variation
	 * @returns {string}
	 */
	function getStockStatus(product, variation) {
		if (product.type === 'variable') {
			return variation?.stock_status === 'instock' ? 'In Stock' : 'Out of Stock';
		} else {
			return product.stock_status === 'instock' ? 'In Stock' : 'Out of Stock';
		}
	}
</script>

<div class="product-layout">
	<!-- Product Details -->
	<div class="product-details">
		<!-- Title and Description -->
		<div class="mb-8">
			{#if product}
				<h2 class="product-title">{product.name}</h2>
				<p class="text-base">
					{@html product.short_description || product.description || ''}
				</p>
			{/if}
		</div>

		<!-- Technical Details -->
		<div class="technical-details space-y-2">
			{#if variation}
				<div class="detail-row">
					<span class="detail-label">details</span>
					<span class="detail-value">{variation.name}</span>
				</div>
			{/if}

			<!-- Stock Info -->
			{#if product}
				<div class="detail-row">
					<span class="detail-label">editions</span>
					<span class="detail-value">{variation?.stock_quantity || product.stock_quantity || 'N/A'}</span>
				</div>
			{/if}

			<!-- Price -->
			<div class="detail-row clean price-row">
				<span class="detail-label">price</span>
				<span class="price-value">
					{#if product}
						{getPriceDisplay(product, variation)}
					{:else}
						Price not available
					{/if}
				</span>
			</div>

			<!-- Stock Status -->
			<div class="detail-row clean">
				<span class="detail-label">stock</span>
				<span class="detail-value">
					{#if product}
						{getStockStatus(product, variation)}
					{:else}
						Out of Stock
					{/if}
				</span>
			</div>
		</div>

		<!-- Additional Info -->
		{#if product && (product.dimensions || product.weight || product.categories?.length > 0 || product.tags?.length > 0)}
			<div class="additional-info space-y-2 mt-8">
				{#if product?.dimensions}
					<div class="detail-row">
						<span class="detail-label">dimensions</span>
						<span class="detail-value">{product.dimensions.length || '0'} x {product.dimensions.width || '0'} x {product.dimensions.height || '0'} cm</span>
					</div>
				{/if}

				{#if product?.categories?.length > 0}
					<div class="tags-row">
						{#each product.categories as category}
							<span class="pill pill-primary pill-sm">{category.name}</span>
						{/each}
					</div>
				{/if}

				{#if product?.tags?.length > 0}
					<div class="tags-row">
						{#each product.tags as tag}
							<span class="pill pill-secondary pill-sm">{tag.name}</span>
						{/each}
					</div>
				{/if}
			</div>
		{/if}

		<!-- View Details Button -->
		{#if product}
			<button 
				on:click={() => goto(getProductUrl(product.id))}
				class="button-primary w-full mt-8"
			>
				View Details
			</button>
		{/if}
	</div>

	<!-- Gallery Component -->
	<div class="gallery-container">
		<ImageGallery images={gallery} />
		<button 
			on:click={addToCart} 
			class="button-primary absolute bottom-4 right-4"
		>
			Add to Cart
		</button>
	</div>
</div>

<!-- Artist Details Section -->
{#if artistInfo}
	<div class="artist-container">
		<div class="artist-info">
			<div class="artist-details space-y-md">
				<h3 class="section-title">About the Artist</h3>
				
				<!-- Artist Info -->
				<div class="technical-details space-y-4 mt-4">
					<div class="detail-row clean">
						<span class="detail-label">Name</span>
						<span class="detail-value">{artistInfo?.title?.rendered || ''}</span>
					</div>

					<div class="detail-row clean">
						<span class="detail-label">Location</span>
						<span class="detail-value">{artistInfo?.acf?.location || 'Unknown'}</span>
					</div>

					<div class="detail-row clean cursor-pointer" on:click={() => bioOpen = !bioOpen}>
						<span class="detail-label">Bio</span>
						<span class="detail-value">View {bioOpen ? '−' : '+'}</span>
					</div>

					{#if bioOpen}
						<div class="bio-drawer" transition:slide={{ duration: 300 }}>
							<p class="text-base">
								{artistInfo?.acf?.description || 'No description available.'}
							</p>
						</div>
					{/if}
				</div>

				{#if artistInfo}
					<button 
						class="button-primary mt-8 w-full"
						on:click={() => artistInfo && goto(getArtistUrl(artistInfo.title.rendered))}
					>
						View Profile
					</button>
				{/if}
			</div>
		</div>

		<div class="placeholder-column flex-1">
			{#if artistInfo}
				<ArtistSlider {products} artistName={artistInfo.title.rendered} />
			{/if}
		</div>
	</div>
{/if}

<!-- <CategorySlider {products} category={primaryCategory} /> -->

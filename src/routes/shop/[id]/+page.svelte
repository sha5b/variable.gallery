<script>
	import PageSEO from '$lib/components/base/PageSEO.svelte';
	import { slide } from 'svelte/transition';
	import { page } from '$app/stores';
	import { goto } from '$app/navigation';
	import { addItem, toggleCartSlider  } from '$lib/stores/cartStore';
	import CategorySlider from '$lib/components/slider/CategorySlider.svelte';
	import ImageGallery from '$lib/components/ImageGallery.svelte';
	import ArtistSlider from '$lib/components/slider/ArtistSlider.svelte';
	import { onMount } from 'svelte';

	/** @typedef {import('$lib/utils/types').Artist} Artist */
	/** @type {import('$lib/utils/types').PageData} */
	export let data;
	const { product, variation, products, artists = [] } = data;

	// Create product-specific SEO customization with simplified structure
	$: customSEO = product ? {
		title: `${product.name} | variable.gallery`,
		description: product.short_description || product.description || 'Explore this unique digital artwork.',
		keywords: [
			product.name,
			...(product.categories?.map(c => c.name) || []),
			...(product.tags?.map(t => t.name) || [])
		],
		openGraph: {
			image: product.images?.[0]?.src
		}
	} : {};

	let bioOpen = false;
	let primaryCategory = '';
	/** @type {string[]} */
	let gallery = [];
	/** @type {Artist|null} */
	let artistInfo = null;
	let artistName = '';

	// Move the reactive statement to watch product changes
	$: if (product) {
		gallery = product.images?.map((img) => img.src) || [];
		primaryCategory = product.categories?.[0]?.name || '';
		
		const artistAttr = product.attributes?.find(
			(attr) => attr.name.toLowerCase() === 'artist'
		)?.options[0];
		
		artistInfo = artists?.find(
			(artist) => artist.title.rendered.toLowerCase() === artistAttr?.toLowerCase()
		) || null;
		artistName = artistInfo ? artistInfo.title.rendered : '';
	}

	function addToCart() {
		if (product) {
			const cartItem = {
				...product,
				price: variation?.regular_price || product.regular_price,
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
</script>

<PageSEO pageType="PRODUCT" {data} {customSEO} />

<div class="page-container">
	<div class="content-section">
		{#if product}
			<div class="product-layout">
				<!-- Product Details -->
				<div class="product-details">
					<!-- Title and Description -->
					<div class="mb-8">
						<h2 class="text-3xl font-normal mb-6">{product.name}</h2>
						<p class="text-sm">
							{@html product.short_description || product.description || ''}
						</p>
					</div>

					<!-- Technical Details -->
					<div class="technical-details space-y-2">
						{#if variation}
							<div class="detail-row clean">
								<span class="detail-label uppercase">DETAILS</span>
								<span class="detail-value uppercase">{variation.name}</span>
							</div>
						{/if}

						<div class="detail-row clean">
							<span class="detail-label uppercase">EDITIONS</span>
							<span class="detail-value uppercase">{variation?.stock_quantity || product.stock_quantity || 'N/A'}</span>
						</div>

						<div class="detail-row clean">
							<span class="detail-label uppercase">STOCK</span>
							<span class="detail-value">
								{variation
									? variation.stock_status === 'instock'
										? 'IN STOCK'
										: 'OUT OF STOCK'
									: product.stock_status === 'instock'
										? 'IN STOCK'
										: 'OUT OF STOCK'}
							</span>
						</div>

						<!-- Price Row -->
						<div class="detail-row clean price-row">
							<span class="detail-label uppercase">PRICE</span>
							<span class="price-value">
								{#if product.sale_price && product.sale_price !== ''}
									<span class="sale-price">€{product.regular_price}</span>
									€{product.sale_price}
								{:else if variation?.regular_price}
									€{variation.regular_price}
								{:else if product.regular_price}
									€{product.regular_price}
								{:else}
									PRICE NOT AVAILABLE
								{/if}
							</span>
						</div>

						{#if product.dimensions}
							<div class="detail-row clean">
								<span class="detail-label uppercase">DIMENSIONS</span>
								<span class="detail-value">
									{product.dimensions.length || '0'} X {product.dimensions.width || '0'} X {product.dimensions.height || '0'} CM
								</span>
							</div>
						{/if}
					</div>

					<!-- Categories and Tags -->
					{#if product.categories.length > 0 || product.tags.length > 0}
						<div class="additional-info space-y-2 mt-8">
							{#if product.categories.length > 0}
								<div class="tags-row">
									{#each product.categories as category}
										<span class="pill pill-primary pill-sm">{category.name}</span>
									{/each}
								</div>
							{/if}

							{#if product.tags.length > 0}
								<div class="tags-row">
									{#each product.tags as tag}
										<span class="pill pill-secondary pill-sm">{tag.name}</span>
									{/each}
								</div>
							{/if}
						</div>
					{/if}

					<button 
						on:click={addToCart} 
						class="w-full mt-8 bg-black text-white py-2 text-sm uppercase"
					>
						ADD TO CART
					</button>
				</div>

				<!-- Gallery Component -->
				<div class="gallery-container">
					<ImageGallery images={gallery} />
				</div>
			</div>

			<!-- Artist Details Section -->
			{#if artistInfo}
				<div class="artist-container">
					<div class="artist-info">
						<div class="artist-details space-y-md">
							<h3 class="text-xl font-normal uppercase mb-6">ABOUT THE ARTIST</h3>
							
							<!-- Artist Info -->
							<div class="technical-details space-y-4 mt-4">
								<div class="detail-row clean">
									<span class="detail-label uppercase">NAME</span>
									<span class="detail-value uppercase">{artistInfo.title.rendered}</span>
								</div>

								<div class="detail-row clean">
									<span class="detail-label uppercase">LOCATION</span>
									<span class="detail-value uppercase">{artistInfo.acf?.location || 'UNKNOWN'}</span>
								</div>

								<div class="detail-row clean cursor-pointer" on:click={() => (bioOpen = !bioOpen)}>
									<span class="detail-label uppercase">BIO</span>
									<span class="detail-value uppercase">VIEW {bioOpen ? '−' : '+'}</span>
								</div>

								{#if bioOpen}
									<div class="bio-drawer" transition:slide={{ duration: 300 }}>
										<p class="text-base">
											{artistInfo.acf?.description || 'No description available.'}
										</p>
									</div>
								{/if}
							</div>

							<button 
								class="w-full mt-8 bg-black text-white py-2 text-sm uppercase"
								on:click={() => goto(`/artist/${artistInfo?.slug || ''}`)}
							>
								VIEW PROFILE
							</button>
						</div>
					</div>

					<div class="placeholder-column flex-1">
						<ArtistSlider {products} artistName={artistInfo.title.rendered} />
					</div>
				</div>
			{/if}

			<CategorySlider {products} category={primaryCategory} />
		{:else}
			<div class="flex items-center justify-center h-[50vh]">
				<p class="text-lg">Product not found</p>
			</div>
		{/if}
	</div>
</div>

<style>
	.product-layout {
		display: flex;
		gap: var(--spacing-xl);
		margin-top: var(--spacing-lg);
	}

	.detail-label {
		font-size: var(--font-size-sm);
		letter-spacing: 0.05em;
	}

	.detail-value {
		font-size: var(--font-size-sm);
	}

	.detail-row.clean {
		padding: var(--spacing-sm) 0;
	}

	.product-details {
		width: 33.333%;
	}

	.gallery-container {
		width: 66.666%;
		position: relative;
	}

	.artist-container {
		display: flex;
		gap: var(--spacing-lg);
		margin-top: var(--spacing-xl);
	}

	.artist-info {
		width: 50%;
	}

	.bio-drawer {
		padding: var(--spacing-sm) 0;
	}

	.price-value {
		font-size: var(--font-size-lg);
		font-weight: var(--font-weight-bold);
	}

	@media (max-width: 768px) {
		.product-layout {
			flex-direction: column;
		}

		.product-details,
		.gallery-container {
			width: 100%;
		}

		.artist-container {
			flex-direction: column;
		}

		.artist-info {
			width: 100%;
		}
	}
</style>

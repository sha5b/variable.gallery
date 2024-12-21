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

<div class='px-page'>
{#if product}
	<div class="product-container gap-md flex w-full flex-col md:flex-row">
		<!-- Product Details Section with 1/3 width -->
		<div class="product-details space-y-md bg-background flex-col md:w-1/3">
			<h1 class="product-title text-xlarge text-primary font-bold mb-4">{product.name}</h1>
			<p class="text-primary text-base">
				{@html product.short_description || product.description || 'No description available'}
			</p>

			<!-- Technical Details -->
			<div class="technical-details space-y-4">
				<div class="detail-row clean">
					<span class="detail-label">details</span>
					<span class="detail-value">{variation ? variation.name : product.name}</span>
				</div>

				<div class="detail-row clean">
					<span class="detail-label">editions</span>
					<span class="detail-value">
						{variation ? variation.stock_quantity || 'N/A' : product.stock_quantity || 'N/A'}
					</span>
				</div>

				<div class="detail-row clean">
					<span class="detail-label">stock</span>
					<span class="detail-value">
						{variation
							? variation.stock_status === 'instock'
								? 'In Stock'
								: 'Out of Stock'
							: product.stock_status === 'instock'
								? 'In Stock'
								: 'Out of Stock'}
					</span>
				</div>

				<!-- Price Row -->
				<div class="detail-row clean price-row">
					<span class="detail-label">price</span>
					<span class="price-value">
						{#if product.sale_price && product.sale_price !== ''}
							<span class="sale-price">€{product.regular_price}</span>
							€{product.sale_price}
						{:else if variation?.regular_price}
							€{variation.regular_price}
						{:else if product.regular_price}
							€{product.regular_price}
						{:else}
							Price not available
						{/if}
					</span>
				</div>

				{#if product.dimensions}
					<div class="detail-row clean">
						<span class="detail-label">dimensions</span>
						<span class="detail-value">
							{product.dimensions.length || '0'} x {product.dimensions.width || '0'} x {product.dimensions.height || '0'} cm
						</span>
					</div>
				{/if}

				{#if product.weight}
					<div class="detail-row clean">
						<span class="detail-label">weight</span>
						<span class="detail-value">{product.weight || 'N/A'} kg</span>
					</div>
				{/if}
			</div>

			<!-- Categories and Tags -->
			{#if product.categories.length > 0 || product.tags.length > 0}
				<div class="tags-row">
					{#each product.categories as category}
						<span class="pill pill-secondary pill-sm">{category.name}</span>
					{/each}
					{#each product.tags as tag}
						<span class="pill pill-accent pill-sm">{tag.name}</span>
					{/each}
				</div>
			{/if}

			<!-- Add to Cart Button -->
			<button 
				on:click={addToCart} 
				class="button-primary w-full mt-8"
			>
				add to cart
			</button>
		</div>

		<!-- Gallery Component with 2/3 width -->
		<div class="gallery-container md:w-2/3 relative">
			<ImageGallery images={gallery} />
		</div>
	</div>

	<!-- Artist Details Section -->
	{#if artistInfo}
		<div class="artist-container gap-md bg-background flex flex-col md:flex-row pt-12">
			<div class="flex flex-col items-start md:w-1/2">
				<div class="artist-details space-y-md">
					<h3 class="text-xlarge text-primary font-bold mb-8">about the artist</h3>
					
					<!-- Artist Info -->
					<div class="technical-details space-y-4">
						{#if artistInfo}
							<div class="detail-row clean">
								<span class="detail-label">Name</span>
								<span class="detail-value">{artistInfo.title.rendered}</span>
							</div>

							<div class="detail-row clean">
								<span class="detail-label">Location</span>
								<span class="detail-value">{artistInfo.acf?.location || 'Unknown'}</span>
							</div>

							<div class="detail-row clean cursor-pointer" on:click={() => (bioOpen = !bioOpen)}>
								<span class="detail-label">Bio</span>
								<span class="detail-value">View {bioOpen ? '−' : '+'}</span>
							</div>

							{#if bioOpen}
								<div class="bio-drawer" transition:slide={{ duration: 300 }}>
									<p class="text-primary text-base">
										{artistInfo.acf?.description || 'No description available.'}
									</p>
								</div>
							{/if}
						{/if}
					</div>

					{#if artistInfo}
						<button 
							class="button-primary mt-8 w-full"
							on:click={() => goto(`/artist/${artistInfo?.slug || ''}`)}
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

	<CategorySlider {products} category={primaryCategory} />
{:else}
	<div class="flex items-center justify-center h-[50vh]">
		<p class="text-lg">Product not found</p>
	</div>
{/if}
</div>

<style>
	.product-container {
		display: flex;
		width: 100%;
		
		overflow: hidden;
		padding-top: var(--spacing-lg);
	}

	.product-details {
		background-color: var(--background-color);
		padding-right: var(--spacing-md);
		word-break: break-word;
	}

	.detail-row.clean {
		display: flex;
		justify-content: space-between;
		align-items: center;
		padding: var(--spacing-xs) 0;
		border-bottom: 1px solid var(--secondary-bg-color);
	}

	.detail-label {
		color: var(--text-color);
		font-size: 0.875rem;
	}

	.detail-value {
		color: var(--text-color);
		text-align: right;
		font-size: 0.875rem;
	}

	.price-row {
		margin-top: var(--spacing-md);
	}

	.price-value {
		font-size: 1.25rem;
		font-weight: 700;
	}

	.tags-row {
		display: flex;
		flex-wrap: wrap;
		gap: var(--spacing-xs);
		margin-top: var(--spacing-xs);
	}

	.gallery-container {
		position: relative;
	}

	.gallery-container .button-primary {
		position: absolute;
		bottom: var(--spacing-sm);
		right: var(--spacing-sm);
		padding: var(--spacing-sm) var(--spacing-md);
	}

	.button-primary {
		background-color: var(--primary-color);
		color: var(--background-color);
		padding: var(--spacing-sm) var(--spacing-md);
		border: none;
		cursor: pointer;
		font-weight: 500;
		transition: all 0.2s ease-in-out;
		width: 100%;
		text-align: center;
	}

	.button-primary:hover {
		background-color: var(--secondary-color);
		transform: translateY(-1px);
	}

	.button-primary:active {
		transform: translateY(0);
	}

	@media (max-width: 767px) {
		.product-container {
			flex-direction: column;
		}

		.product-details {
			width: 100%;
			margin-bottom: var(--spacing-md);
		}
	}

	.artist-details {
		width: 100%;
	}

	.detail-row.clean {
		display: flex;
		justify-content: space-between;
		align-items: center;
		padding: var(--spacing-xs) 0;
		border-bottom: 1px solid var(--secondary-bg-color);
	}

	.detail-label {
		color: var(--text-color);
		font-size: 0.875rem;
	}

	.detail-value {
		color: var(--text-color);
		text-align: right;
		font-size: 0.875rem;
	}

	.bio-drawer {
		padding: var(--spacing-sm) 0;
	}

	.button-primary {
		background-color: var(--primary-color);
		color: var(--background-color);
		padding: var(--spacing-xs) var(--spacing-sm);
		border-radius: 0;
		text-align: center;
		font-size: 0.875rem;
	}

	.button-primary:hover {
		background-color: var(--secondary-color);
	}

	.artist-container {
		background-color: var(--background-color);
		padding: var(--spacing-xl) 0;
	}
</style>

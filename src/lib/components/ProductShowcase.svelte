<script>
	import Gallery from '$lib/components/Gallery.svelte';
	import ArtistSlider from '$lib/components/slider/ArtistSlider.svelte';
	import CategorySlider from '$lib/components/slider/CategorySlider.svelte';
	import { addItem, toggleCartSlider } from '$lib/stores/cartStore';
	import { slide } from 'svelte/transition';

	export let products;
	export let artists;

	let latestProduct = null;
	let gallery = [];
	let artistInfo = null;
	let artistName = '';
	let primaryCategory = '';
	let bioOpen = false;

	$: {
		// Get the latest product
		latestProduct =
			products.length > 0
				? products.reduce(
						(latest, product) =>
							new Date(product.date_modified) > new Date(latest.date_modified) ? product : latest,
						products[0]
					)
				: null;

		if (latestProduct) {
			gallery = latestProduct.images?.map((img) => img.src) || [];
			primaryCategory =
				latestProduct.categories && latestProduct.categories.length > 0
					? latestProduct.categories[0].name
					: '';

			// Retrieve artist information
			const artistAttr = latestProduct.attributes?.find(
				(attr) => attr.name.toLowerCase() === 'artist'
			)?.options[0];

			artistInfo = artists.find(
				(artist) => artist.title.rendered.toLowerCase() === artistAttr?.toLowerCase()
			);
			artistName = artistInfo ? artistInfo.title.rendered : '';
		}
	}

	function addToCart() {
		if (latestProduct) {
			const cartItem = {
				...latestProduct,
				price: latestProduct.variation?.regular_price || latestProduct.regular_price,
				variation: latestProduct.variation ? {
					id: latestProduct.variation.id,
					name: latestProduct.variation.name,
					price: latestProduct.variation.regular_price,
					stock_quantity: latestProduct.variation.stock_quantity,
					stock_status: latestProduct.variation.stock_status
				} : null
			};
			addItem(cartItem);
			toggleCartSlider();
		}
	}
</script>

<div class="product-layout">
	<!-- Product Details -->
	<div class="product-details md:w-1/3">
		<!-- Title and Description -->
		<div class="mb-8">
			<h1 class="product-title text-xlarge text-primary font-bold mb-4">{latestProduct.name}</h1>
			<p class="text-primary text-base">
				{@html latestProduct.short_description || latestProduct.description}
			</p>
		</div>

		<!-- Technical Details -->
		<div class="technical-details space-y-2">
			{#if latestProduct.variation}
				<div class="detail-row">
					<span class="detail-label">Edition</span>
					<span class="detail-value">{latestProduct.variation.name}</span>
				</div>
			{/if}

			<!-- Print Details -->
			<div class="detail-row">
				<span class="detail-label">Print</span>
				<span class="detail-value">{latestProduct.attributes?.find(attr => attr.name.toLowerCase() === 'print')?.options[0] || 'N/A'}</span>
			</div>

			<!-- Stock Info -->
			<div class="detail-row">
				<span class="detail-label">Editions Available</span>
				<span class="detail-value">{latestProduct.variation?.stock_quantity || latestProduct.stock_quantity || 'N/A'}</span>
			</div>

			<!-- Price -->
			<div class="detail-row price-row">
				<span class="detail-label">Price</span>
				<span class="price-value">
					{#if latestProduct.variation}
						{#if latestProduct.variation.sale_price}
							<span class="sale-price">€{latestProduct.variation.regular_price}</span>
							€{latestProduct.variation.sale_price}
						{:else}
							€{latestProduct.variation.regular_price || 'Price not available'}
						{/if}
					{:else if latestProduct.sale_price && latestProduct.sale_price !== ''}
						<span class="sale-price">€{latestProduct.regular_price}</span>
						€{latestProduct.sale_price}
					{:else if latestProduct.regular_price}
						€{latestProduct.regular_price}
					{:else}
						Price not available
					{/if}
				</span>
			</div>
		</div>

		<!-- Additional Info -->
		{#if latestProduct.dimensions || latestProduct.weight || latestProduct.categories?.length > 0 || latestProduct.tags?.length > 0}
			<div class="additional-info space-y-2 mt-8">
				{#if latestProduct.dimensions}
					<div class="detail-row">
						<span class="detail-label">Dimensions</span>
						<span class="detail-value">{latestProduct.dimensions.length || 'N/A'} x {latestProduct.dimensions.width || 'N/A'} x {latestProduct.dimensions.height || 'N/A'} cm</span>
					</div>
				{/if}

				{#if latestProduct.categories?.length > 0}
					<div class="tags-row">
						{#each latestProduct.categories as category}
							<span class="pill pill-primary pill-sm">{category.name}</span>
						{/each}
					</div>
				{/if}

				{#if latestProduct.tags?.length > 0}
					<div class="tags-row">
						{#each latestProduct.tags as tag}
							<span class="pill pill-secondary pill-sm">{tag.name}</span>
						{/each}
					</div>
				{/if}
			</div>
		{/if}

	</div>

	<!-- Gallery Component -->
	<div class="gallery-container md:w-2/3">
		<Gallery images={gallery} />
		
		<button on:click={addToCart} class="button-primary mt-8">Add to Cart</button>
	</div>
</div>

<!-- Artist Details Section -->
{#if artistInfo}
	<div class="artist-container gap-md bg-background flex flex-col md:flex-row">
		<div class="flex flex-col items-start md:w-1/2">
			<div class="artist-details space-y-md">
				<h3 class="text-xlarge text-primary font-bold mb-8">about the artist</h3>
				
				<!-- Artist Info -->
				<div class="technical-details space-y-4">
					<div class="detail-row clean">
						<span class="detail-label">Name</span>
						<span class="detail-value">{artistInfo.title.rendered}</span>
					</div>

					<div class="detail-row clean">
						<span class="detail-label">Location</span>
						<span class="detail-value">{artistInfo.acf?.location || 'Unknown'}</span>
					</div>

					<div class="detail-row clean cursor-pointer" on:click={() => bioOpen = !bioOpen}>
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
				</div>

				<button 
					class="button-primary mt-8 w-full"
					on:click={() => goto(`/artist/${artistInfo.slug}`)}
				>
					View Profile
				</button>
			</div>
		</div>

		<div class="placeholder-column flex-1">
			<ArtistSlider {products} artistName={artistInfo.title.rendered} />
		</div>
	</div>
{/if}

<CategorySlider {products} category={primaryCategory} />

<style>
	.product-layout {
		display: flex;
		flex-direction: column;
		gap: var(--spacing-md);
		width: 100%;
	}

	.gallery-container {
		width: 100%;
	}

	@media (min-width: 768px) {
		.product-layout {
			flex-direction: row;
			align-items: flex-start;
		}
	}

	.product-details {
	}

	.image-gallery {
		width: 100%;
		flex: 1 1 67%;
		position: relative;
	}

	.artist-container {
		background-color: var(--background-color);
		padding: var(--spacing-xl) 0;
	}

	.artist-details {
		width: 100%;
	}

	.detail-row {
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
	}

	.price-row {
		border-bottom: none;
		margin-top: var(--spacing-md);
	}

	.price-value {
		font-size: 1.25rem;
		font-weight: 700;
	}

	.sale-price {
		color: var(--secondary-color);
		text-decoration: line-through;
		margin-right: 0.5em;
		font-size: 1rem;
	}

	.tags-row {
		display: flex;
		flex-wrap: wrap;
		gap: var(--spacing-xs);
		margin-top: var(--spacing-xs);
	}

	.additional-info {
		padding-top: var(--spacing-md);
		border-top: 1px solid var(--secondary-bg-color);
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

	@media (max-width: 767px) {
		.product-layout {
			flex-direction: column;
		}

		.product-details {
			flex: 0 0 100%;
			width: 100%;
			padding: var(--spacing-sm);
			margin-bottom: var(--spacing-md);
		}

		.artist-container {
		}
	}

	.bio-drawer {
		padding: var(--spacing-sm) 0;
	}

	.artist-link {
		display: inline-block;
		margin-top: var(--spacing-md);
		font-weight: 500;
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

	.detail-row.clean {
		display: flex;
		justify-content: space-between;
		align-items: center;
		padding: var(--spacing-xs) 0;
		border-bottom: 1px solid var(--secondary-bg-color);
	}
</style>

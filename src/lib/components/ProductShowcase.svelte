<script>
	import Gallery from '$lib/components/Gallery.svelte';
	import ArtistSlider from '$lib/components/slider/ArtistSlider.svelte';
	import CategorySlider from '$lib/components/slider/CategorySlider.svelte';
	import { addItem, toggleCartSlider } from '$lib/stores/cartStore';

	export let products;
	export let artists;

	let latestProduct = null;
	let gallery = [];
	let artistInfo = null;
	let artistName = '';
	let primaryCategory = '';

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

<div class="product-container gap-md flex w-full flex-col items-stretch md:flex-row">
	<!-- Product Details Section -->
	<div class="product-details space-y-md bg-background flex-col md:w-1/3">
		<h1 class="product-title text-xlarge text-primary font-bold">{latestProduct.name}</h1>
		<p class="text-primary text-base">
			{@html latestProduct.short_description || latestProduct.description}
		</p>

		{#if latestProduct.variation}
			<p class="text-large text-primary">{latestProduct.variation.name}</p>
		{/if}

		<p class="text-small text-primary">
			<strong>Editions:</strong>
			{#if latestProduct.variation}
				{latestProduct.variation.stock_quantity || 'N/A'}
			{:else}
				{latestProduct.stock_quantity || 'N/A'}
			{/if}
		</p>
		<p class="text-small text-primary">
			<strong>Stock Status:</strong>
			{#if latestProduct.variation}
				{latestProduct.variation.stock_status === 'instock' ? 'In Stock' : 'Out of Stock'}
			{:else}
				{latestProduct.stock_status === 'instock' ? 'In Stock' : 'Out of Stock'}
			{/if}
		</p>

		<p class="price text-large text-primary font-semibold">
			{#if latestProduct.variation}
				{#if latestProduct.variation.sale_price}
					<span class="sale-price text-secondary line-through">
						€{latestProduct.variation.regular_price}
					</span>
					€{latestProduct.variation.sale_price}
				{:else}
					€{latestProduct.variation.regular_price || 'Price not available'}
				{/if}
			{:else if latestProduct.sale_price && latestProduct.sale_price !== ''}
				<span class="sale-price text-secondary line-through">€{latestProduct.regular_price}</span>
				€{latestProduct.sale_price}
			{:else if latestProduct.regular_price}
				€{latestProduct.regular_price}
			{:else}
				Price not available
			{/if}
		</p>

		{#if latestProduct.dimensions}
			<p class="product-info text-small">
				<strong>Dimensions:</strong>
				{latestProduct.dimensions.length || 'N/A'} x {latestProduct.dimensions.width || 'N/A'} x {latestProduct
					.dimensions.height || 'N/A'} cm
			</p>
		{/if}
		{#if latestProduct.weight}
			<p class="product-info text-small">
				<strong>Weight:</strong>
				{latestProduct.weight || 'N/A'} kg
			</p>
		{/if}

		{#if latestProduct.categories?.length > 0}
			<p class="product-info text-small">
				<strong>Categories:</strong>
				{#each latestProduct.categories as category}
					<span class="pill pill-primary pill-sm">{category.name}</span>
				{/each}
			</p>
		{/if}
		{#if latestProduct.tags?.length > 0}
			<p class="product-info text-small">
				<strong>Tags:</strong>
				{#each latestProduct.tags as tag}
					<span class="pill pill-secondary pill-sm">{tag.name}</span>
				{/each}
			</p>
		{/if}

		<button on:click={addToCart} class="button-primary mt-4 px-4 py-2">Add to Cart</button>
	</div>

	<!-- Gallery Component -->
	<div class="image-gallery md:w-2/3 relative">
		<Gallery images={gallery} />
		<button on:click={addToCart} class="button-primary absolute bottom-4 right-4">Add to Cart</button>
	</div>
</div>

<!-- Artist Details Section -->
{#if artistInfo}
	<div class="artist-container gap-md bg-background flex flex-col md:flex-row">
		<div class="flex flex-col items-start md:w-1/2">
			<div class="artist-details space-y-md mt-4 md:mt-0">
				<h3 class="text-4xl text-primary font-bold">about the artist</h3>
				<p class="text-primary text-base">
					<strong>name:</strong>
					{artistInfo.title.rendered}
				</p>
				<p class="text-primary text-base">
					<strong>bio:</strong>
					{artistInfo.acf?.description || 'No description available.'}
				</p>
				<p class="text-primary text-base">
					<strong>location:</strong>
					<span class="pill pill-accent pill-sm">{artistInfo.acf?.location || 'Unknown'}</span>
				</p>
				<a href={`/artist/${artistInfo.slug}`} class="artist-link text-accent">view profile</a>
			</div>
		</div>

		<div class="placeholder-column flex-1 rounded-md">
			<ArtistSlider {products} artistName={artistInfo.title.rendered} />
		</div>
	</div>
{/if}

<CategorySlider {products} category={primaryCategory} />

<style>
	.product-container {
		display: flex;
		flex-direction: column;
		gap: var(--spacing-md);
		margin-top: 0;
		width: 100%;
		overflow: hidden;
	}

	@media (min-width: 768px) {
		.product-container {
			flex-direction: row;
		}
	}

	.product-details {
		display: flex;
		flex-direction: column;
		justify-content: flex-start;
		padding-right: var(--spacing-md);
		align-self: flex-start;
		word-break: break-word;
		flex: 1 1 33%;
		background-color: var(--background-color);
	}

	.image-gallery {
		width: 100%;
		flex: 1 1 67%;
		position: relative;
	}

	.artist-container {
		background-color: var(--background-color);
	}

	.artist-details {
		width: 100%;
		flex: 1;
	}

	.product-info {
		display: flex;
		gap: var(--spacing-xs);
		flex-wrap: wrap;
		align-items: center;
	}

	.sale-price {
		color: var(--secondary-color);
		text-decoration: line-through;
		margin-right: 0.5em;
	}

	.button-primary {
		background-color: var(--primary-color);
		color: var(--background-color);
		padding: var(--spacing-sm) var(--spacing-md);
		border-radius: var(--spacing-xs);
		transition: background-color 0.3s ease;
		position: absolute;
		bottom: var(--spacing-sm);
		right: var(--spacing-sm);
	}

	.button-primary:hover {
		background-color: var(--secondary-color);
	}

	@media (max-width: 767px) {
		.product-container {
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
</style>

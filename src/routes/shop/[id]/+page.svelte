<script>
	import { page } from '$app/stores';
	import { addItem, toggleCartSlider  } from '$lib/stores/cartStore';
	import CategorySlider from '$lib/components/slider/CategorySlider.svelte';
	import Gallery from '$lib/components/Gallery.svelte';
	import ArtistSlider from '$lib/components/slider/ArtistSlider.svelte';

	export let data;
	let { product, variation, products, artists } = data;

	let primaryCategory = '';
	let gallery = [];
	let artistInfo = null;
	let artistName = '';

	// Assign the product and prepare the gallery images
	$: product = products ? products.find((p) => p.id === Number($page.params.id)) : null;
	$: if (product) {
		gallery = product.images?.map((img) => img.src) || [];
		primaryCategory = product.categories && product.categories.length > 0 ? product.categories[0].name : '';
		// Retrieve artist information
		const artistAttr = product.attributes.find((attr) => attr.name.toLowerCase() === 'artist')?.options[0];
		artistInfo = artists.find((artist) => artist.title.rendered.toLowerCase() === artistAttr?.toLowerCase());
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

<div
	class="product-container px-page gap-md flex w-full flex-col items-stretch md:flex-row"
>
	<!-- Product Details Section with 1/3 width -->
	<div class="product-details space-y-md bg-background p-lg flex-col md:w-1/3">
		<h1 class="product-title text-xlarge text-primary font-bold">{product.name}</h1>
		<p class="text-primary text-base">{@html product.short_description || product.description}</p>
		<p class="text-large text-primary">{variation ? variation.name : product.name}</p>

		<p class="text-small text-primary">
			<strong>Editions:</strong>
			{variation ? variation.stock_quantity || 'N/A' : product.stock_quantity || 'N/A'}
		</p>
		<p class="text-small text-primary">
			<strong>Stock Status:</strong>
			{variation
				? variation.stock_status === 'instock'
					? 'In Stock'
					: 'Out of Stock'
				: product.stock_status === 'instock'
					? 'In Stock'
					: 'Out of Stock'}
		</p>

		<p class="price text-large text-primary font-semibold">
			{#if product.sale_price && product.sale_price !== ''}
				<span class="sale-price text-secondary line-through">€{product.regular_price}</span>
				€{product.sale_price}
			{:else if variation?.regular_price}
				€{variation.regular_price}
			{:else if product.regular_price}
				€{product.regular_price}
			{:else}
				Price not available
			{/if}
		</p>

		{#if product.dimensions}
			<p class="product-info text-small">
				<strong>Dimensions:</strong>
				{product.dimensions.length || 'N/A'} x {product.dimensions.width || 'N/A'} x {product
					.dimensions.height || 'N/A'} cm
			</p>
		{/if}
		{#if product.weight}
			<p class="product-info text-small"><strong>Weight:</strong> {product.weight || 'N/A'} kg</p>
		{/if}

		{#if product.categories.length > 0}
			<div class="product-info">
				{#each product.categories as category}
					<span class="pill pill-secondary pill-sm">{category.name}</span>
				{/each}
			</div>
		{/if}
		{#if product.tags.length > 0}
			<div class="product-info">
				{#each product.tags as tag}
					<span class="pill pill-accent pill-sm">{tag.name}</span>
				{/each}
			</div>
		{/if}

		<button on:click={addToCart} class="button-primary mt-4 px-4 py-2">Add to Cart</button>
	</div>

	<!-- Gallery Component with 2/3 width -->
	<div class="image-gallery md:w-2/3">
		<Gallery images={gallery} />
	</div>
</div>

<!-- Artist Details Section -->
{#if artistInfo}
	<div class="artist-container gap-md bg-background mt-8 flex flex-col md:flex-row  px-page pt-12">
		<!-- First Column: Artist Image and Details -->
		<div class="flex flex-col items-start md:w-1/2">
			<!-- Artist Details -->
			<div class="artist-details space-y-md mt-4 md:mt-0">
				<h3 class="text-large text-primary font-bold">about the artist</h3>
				<p class="text-primary text-base">
					<strong>name:</strong>
					{artistInfo.title.rendered}
				</p>
				<p class="text-primary text-base">
					<strong>bio:</strong>
					{artistInfo.acf.description || 'No description available.'}
				</p>
				<p class="text-primary text-base">
					<strong>location:</strong>
					{artistInfo.acf.location || 'Unknown'}
				</p>
				<a href={artistInfo.link} target="_blank" class="artist-link text-accent">view profile</a>
			</div>
		</div>

		<!-- Second Column: Placeholder -->
		<div class="placeholder-column flex-1 rounded-md ">
			<ArtistSlider {products} artistName={artistInfo.title.rendered}/>
		</div>
	</div>
{:else}{/if}

<CategorySlider {products} category={primaryCategory} />

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
		align-self: flex-end;
		word-break: break-word;
		flex: 1 1 33%; /* Ensures the product details take up 1/3 */
	}

	.image-gallery {
		width: 100%;
		flex: 1 1 67%; /* Ensures the gallery takes up 2/3 */
	}

	.artist-container {
		display: flex;
		flex-direction: row;
		background-color: var(--background-color);
		margin-top: var(--spacing-md);
		gap: var(--spacing-md);
	}

	.artist-thumbnail {
		width: 100%;
		max-width: 200px;
	}

	.artist-details {
		width: 100%;
		flex: 1;
	}

	.product-title,
	.product-info,
	.price {
		word-break: break-word;
	}

	.button-primary {
		background-color: var(--primary-color);
		color: var(--background-color);
		border-radius: var(--rounded-md);
		transition: background-color 0.3s;
		text-align: center;
		font-weight: 600;
	}

	.button-primary:hover {
		background-color: var(--secondary-color);
	}

	.sale-price {
		color: var(--secondary-color);
		text-decoration: line-through;
		margin-right: 0.5em;
	}

	@media (min-width: 768px) and (max-width: 1024px) {
		.product-container {
			flex-direction: row;
			gap: var(--spacing-md);
		}

		.product-details {
			flex: 0 0 35%;
		}

		.image-gallery {
			flex: 0 0 65%;
		}
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

		.button-primary {
			margin-bottom: var(--spacing-md);
		}

		.artist-container {
			flex-direction: column;
		}

		.artist-thumbnail {
			width: 100%;
			margin-bottom: var(--spacing-md);
		}
	}
</style>

<script>
	import { addItem } from '$lib/stores/cartStore';
	import { toggleCartSlider } from '$lib/stores/cartSliderStore';
	// Accept `products` as a prop
	export let products;

	let latestProduct =
		products.length > 0
			? products.reduce(
					(latest, product) =>
						new Date(product.date_modified) > new Date(latest.date_modified) ? product : latest,
					products[0]
				)
			: null;

	let variation = latestProduct?.variations[0];
	
</script>

{#if latestProduct}
	<div class="product-container gap-md my-8 flex w-full flex-col items-stretch pt-8 md:flex-row">
		<!-- Image Section with larger display on mobile -->
		<div class="image-section aspect-h-3 aspect-w-4 w-full md:aspect-h-6 md:aspect-w-16 md:w-3/4">
			<img
				src={latestProduct.images[0]?.src || '/path/to/default.jpg'}
				alt={latestProduct.name}
				class="h-full w-full rounded-lg object-cover"
			/>
		</div>

		<!-- Text Section aligned to top left -->
		<div class="product-details space-y-md bg-background p-lg flex-col rounded-lg md:w-1/4">
			<h2 class="text-xlarge text-primary font-bold">{latestProduct.name}</h2>
			<p class="text-primary text-base">
				{@html latestProduct.description || latestProduct.short_description}
			</p>
			<p class="text-large text-primary">{variation.name}</p>

			<!-- SKU and Stock Status -->
			<p class="text-small text-primary">
				<strong>SKU:</strong>
				{variation.stock_quantity || 'N/A'}
			</p>
			<p class="text-small text-primary">
				<strong>Stock Status:</strong>
				{variation.stock_status === 'instock' ? 'In Stock' : 'Out of Stock'}
			</p>

			<!-- Price Display Logic -->
			<p class="price text-large text-primary font-semibold">
				{#if latestProduct.sale_price && latestProduct.sale_price !== ''}
					<span class="sale-price text-secondary line-through">€{latestProduct.regular_price}</span>
					€{latestProduct.sale_price}
				{:else if variation.regular_price}
					€{variation.regular_price}
				{:else}
					Price not available
				{/if}
			</p>

			<!-- Dimensions and Weight -->
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

			<!-- Display Categories and Tags -->
			{#if latestProduct.categories.length > 0}
				<p class="product-info text-small">
					<strong>Categories:</strong>
					{#each latestProduct.categories as category}{category.name}{#if category !== latestProduct.categories[latestProduct.categories.length - 1]},{/if}{/each}
				</p>
			{/if}

			{#if latestProduct.tags.length > 0}
				<p class="product-info text-small">
					<strong>Tags:</strong>
					{#each latestProduct.tags as tag}{tag.name}{#if tag !== latestProduct.tags[latestProduct.tags.length - 1]},{/if}{/each}
				</p>
			{/if}

			<!-- Action Button -->
			<a href={'/shop'} class="button-primary mt-4 px-4 py-2">Shop Nows</a>
		</div>
	</div>
{/if}

<style>
	.product-container {
		display: flex;
		gap: var(--spacing-md);
	}

	.image-section {
		width: 100%;
	}

	.product-details {
		background-color: var(--background-color);
		padding: var(--spacing-lg);
		border-radius: var(--rounded-lg);
		display: flex;
		flex-direction: column;
		gap: var(--spacing-md);
	}

	.text-primary {
		color: var(--primary-color);
	}

	.price {
		font-size: var(--text-large);
		font-weight: 600;
		color: var(--primary-color);
	}

	.sale-price {
		color: var(--secondary-color);
		text-decoration: line-through;
		margin-right: 0.5em;
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
</style>

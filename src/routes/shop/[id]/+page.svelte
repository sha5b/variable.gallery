<script>
	import Modal from '$lib/components/Modal.svelte';
	import { page } from '$app/stores';
	import { addItem } from '$lib/stores/cartStore';
	import { toggleCartSlider } from '$lib/stores/cartSliderStore';
	import CategorySlider from '$lib/components/CategorySlider.svelte';
	import Gallery from '$lib/components/Gallery.svelte';

	export let data;
	let { product, variation, products } = data;

	let primaryCategory = '';
	let gallery = [];

	// Assign the product and prepare the gallery images
	$: product = products ? products.find((p) => p.id === Number($page.params.id)) : null;
	$: if (product) {
		gallery = product.images?.map((img) => img.src) || [];
		primaryCategory = product.categories && product.categories.length > 0 ? product.categories[0].name : '';
	}

	function addToCart() {
		if (product || variation) {
			addItem({ ...product, ...variation });
			toggleCartSlider();
		}
	}
</script>

<div class="product-container px-page">
	<div class="product-details space-y-md bg-background flex-col md:w-1/4">
		<h1 class="product-title text-xlarge text-primary font-bold">{product.name}</h1>
		<p class="text-primary text-base">{@html product.short_description || product.description}</p>
		<p class="text-large text-primary">{variation ? variation.name : product.name}</p>

		<p class="text-small text-primary">
			<strong>SKU:</strong>
			{variation ? variation.stock_quantity || 'N/A' : product.sku || 'N/A'}
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
				{product.dimensions.length || 'N/A'} x {product.dimensions.width || 'N/A'} x {product.dimensions.height || 'N/A'} cm
			</p>
		{/if}
		{#if product.weight}
			<p class="product-info text-small"><strong>Weight:</strong> {product.weight || 'N/A'} kg</p>
		{/if}

		{#if product.categories.length > 0}
			<p class="product-info text-small">
				<strong>Categories:</strong>
				{#each product.categories as category}{category.name}{#if category !== product.categories[product.categories.length - 1]},{/if}{/each}
			</p>
		{/if}
		{#if product.tags.length > 0}
			<p class="product-info text-small">
				<strong>Tags:</strong>
				{#each product.tags as tag}{tag.name}{#if tag !== product.tags[product.tags.length - 1]},{/if}{/each}
			</p>
		{/if}

		<button on:click={addToCart} class="button-primary">Add to Cart</button>
	</div>

	<!-- Gallery Component -->
	<div class="image-gallery md:w-3/4">
		<Gallery images={gallery} />
	</div>
</div>

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
	}

	.product-title,
	.product-info,
	.price {
		word-break: break-word;
	}

	.image-gallery {
		width: 100%;
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
	}
</style>

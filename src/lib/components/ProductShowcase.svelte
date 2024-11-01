<script>
	// Accept `product` and `variation` as props
	export let products;

	let latestProduct =
		products.length > 0
			? products.reduce(
					(latest, product) =>
						new Date(product.date_modified) > new Date(latest.date_modified) ? product : latest,
					products[0]
				)
			: null;

	console.log(latestProduct);
	// Default values if properties are undefined
</script>

{#if latestProduct}
	<div class="my-8 flex w-full flex-col items-stretch gap-8 pt-8 md:flex-row">
		<!-- Image Section with larger display on mobile -->
		<div class="aspect-h-3 aspect-w-4 w-full md:aspect-h-6 md:aspect-w-16 md:w-3/4">
			<img
				src={latestProduct.images[0]?.src || '/path/to/default.jpg'}
				alt={latestProduct.name}
				class="h-full w-full rounded-lg object-cover"
			/>
		</div>

		<!-- Text Section aligned to top left -->
		<div
			class="flex w-full flex-col items-start justify-start rounded-lg bg-[var(--background-color)] p-4 md:w-1/4"
		>
			<h2 class="mb-4 text-2xl font-bold text-[var(--text-color)]">{latestProduct.name}</h2>
			<p class="mb-4 text-[var(--text-color)]">
				{@html latestProduct.description || latestProduct.short_description}
			</p>
			<p class="mb-4 text-[var(--text-color)]">{@html latestProduct.variations[0].name}</p>
			<!-- SKU and Stock Status -->
			<p class="mb-2 text-sm text-[var(--text-color)]">
				<strong>SKU:</strong>
				{latestProduct.variations[0].stock_quantity || 'N/A'}
			</p>
			<p class="mb-2 text-sm text-[var(--text-color)]">
				<strong>Stock Status:</strong>
				{latestProduct.variations[0].stock_status === 'instock' ? 'In Stock' : 'Out of Stock'}
			</p>

			<!-- Price Display Logic -->
			<p class="text-2xl font-semibold">
				€{latestProduct.variations[0].price || 'N/A'}
			</p>

			<!-- Dimensions and Weight -->
			{#if latestProduct.weight}
				<p class="mb-2 text-sm text-[var(--text-color)] mt-2">
					<strong>Weight:</strong>
					{latestProduct.weight || 'N/A'} kg
				</p>
			{/if}

			<!-- Action Button -->
			<a
				href={'/shop'}
				class="rounded-md bg-[var(--primary-color)] px-4 py-2 text-[var(--background-color)] transition-colors hover:bg-[var(--secondary-color)] mt-4"
			>
				Shop Now
			</a>
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
		padding: var(--spacing-lg);
		background-color: var(--background-color);
		border-radius: var(--spacing-xs);
	}
</style>

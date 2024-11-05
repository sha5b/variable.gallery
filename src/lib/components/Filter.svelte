<script>
	import { goto } from '$app/navigation';
	import { fade, fly } from 'svelte/transition';

	export let products = [];
	let selectedTag = null;
	let selectedCategory = null;
	let minPrice = 0;
	let maxPrice = 1000;
	let minSize = 30;
	let maxSize = 150;

	// Initialize price range from products
	const productPrices = products.map(product => parseFloat(product.price));
	const initialMinPrice = Math.min(...productPrices);
	const initialMaxPrice = Math.max(...productPrices);

	// Set default price range based on products
	minPrice = initialMinPrice;
	maxPrice = initialMaxPrice;

	// Extract size values in cm and set initial range for size filter
	const sizeValues = products
		.flatMap(product => product.attributes?.filter(attr => attr.name.toLowerCase() === 'size'))
		.flatMap(attr => attr?.options?.map(option => parseFloat(option.match(/\d+/)?.[0])) || [])
		.filter(size => !isNaN(size));
	const initialMinSize = Math.min(...sizeValues);
	const initialMaxSize = Math.max(...sizeValues);

	minSize = initialMinSize;
	maxSize = initialMaxSize;

	// Create lists of unique tags and categories
	let uniqueTags = [...new Set(products.flatMap(product => product.tags?.map(tag => tag.name)))];
	let uniqueCategories = [...new Set(products.flatMap(product => product.categories?.map(cat => cat.name)))];

	// Filter products based on selected criteria
	$: filteredProducts = products.filter(product =>
		(!selectedTag || product.tags.some(tag => tag.name === selectedTag)) &&
		(!selectedCategory || product.categories.some(cat => cat.name === selectedCategory)) &&
		(parseFloat(product.price) >= minPrice && parseFloat(product.price) <= maxPrice)
	);

	function handleTagClick(tag) {
		selectedTag = selectedTag === tag ? null : tag;
	}

	function handleCategoryClick(category) {
		selectedCategory = selectedCategory === category ? null : category;
	}

	function handlePriceChange(event, type) {
		const value = parseFloat(event.target.value);
		if (type === 'min') {
			minPrice = Math.min(value, maxPrice);
		} else if (type === 'max') {
			maxPrice = Math.max(value, minPrice);
		}
	}

</script>

<div class="space-y-lg py-lg mb-[var(--spacing-xl)]">
	<div class="flex flex-col md:flex-row items-stretch gap-lg">
		<aside class="filter-container p-md w-full md:w-1/4 bg-background text-text-color">
			<h2 class="font-heading font-bold mb-sm text-large">Category</h2>
			<div class="flex flex-wrap gap-sm mb-md">
				{#each uniqueCategories as category}
					<span on:click={() => handleCategoryClick(category)} class={`pill-button ${selectedCategory === category ? 'pill-selected' : 'pill-default'}`}>
						{category}
					</span>
				{/each}
			</div>

			<h2 class="font-heading font-bold mb-sm text-large">Tag</h2>
			<div class="flex flex-wrap gap-sm mb-md">
				{#each uniqueTags as tag}
					<span on:click={() => handleTagClick(tag)} class={`pill-button ${selectedTag === tag ? 'pill-selected' : 'pill-default'}`}>
						{tag}
					</span>
				{/each}
			</div>


			<!-- Price Filter -->
			<h2 class="font-heading font-bold mb-sm text-large">Price Range</h2>
			<div class="flex flex-col gap-sm">
				<label for="min-price">Min Price: €{minPrice}</label>
				<input
					id="min-price"
					type="range"
					min={initialMinPrice}
					max={initialMaxPrice}
					bind:value={minPrice}
					on:input={(event) => handlePriceChange(event, 'min')}
				/>
				<label for="max-price">Max Price: €{maxPrice}</label>
				<input
					id="max-price"
					type="range"
					min={initialMinPrice}
					max={initialMaxPrice}
					bind:value={maxPrice}
					on:input={(event) => handlePriceChange(event, 'max')}
				/>
			</div>
		</aside>

		<!-- Product Grid -->
		<div class="product-grid w-full flex flex-wrap gap-md">
			{#each filteredProducts as product (product.id)}
				<div in:fly={{ x: 20, duration: 400 }} out:fly={{ x: -20, duration: 300 }}
					class="featured-card group h-80 overflow-hidden bg-background transition-all cursor-pointer min-w-[200px] relative"
					on:click={() => goto(`/shop/${product.id}`)}
				>
					<img src={product.images[0]?.src} alt={product.name} class="product-image w-full h-full object-cover rounded-lg" />
					<!-- Price Pill in Bottom Left -->
					<span class="price-pill">€{parseFloat(product.price).toFixed(2)}</span>
					<div class="overlay absolute inset-0 bg-primary bg-opacity-50 opacity-0 group-hover:opacity-100 transition-opacity flex-center text-center p-md">
						<h3 class="text-white text-large font-bold mb-sm">{product.name}</h3>
						<div class="flex gap-xs flex-wrap justify-center">
							{#each product.tags as tag}
								<span class="tag">{tag.name}</span>
							{/each}
						</div>
					</div>
				</div>
			{/each}
		</div>
	</div>
</div>

<style>
	/* Styling based on previous design */
	.filter-container {
		background-color: var(--background-color);
		color: var(--text-color);
	}

	.pill-button {
		padding: var(--spacing-xs) var(--spacing-md);
		border-radius: 9999px;
		font-size: var(--font-size-small);
		cursor: pointer;
		transition: background-color 0.3s ease, color 0.3s ease;
	}

	.pill-default {
		background-color: var(--secondary-bg-color);
		color: var(--primary-color);
	}

	.pill-selected {
		background-color: var(--primary-color);
		color: var(--background-color);
	}

	.product-grid {
		display: flex;
		flex-wrap: wrap;
	}

	.featured-card {
		flex: 1 1 300px;
		position: relative;
		transition: flex 0.3s ease;
	}

	.featured-card:hover {
		flex: 1 1 600px;
	}

	.price-pill {
		position: absolute;
		bottom: var(--spacing-sm);
		left: var(--spacing-sm);
		background-color: var(--primary-color);
		color: var(--background-color);
		padding: var(--spacing-xs) var(--spacing-md);
		border-radius: 9999px;
		font-size: var(--font-size-small);
		font-weight: bold;
	}

	.overlay {
		background-color: rgba(0, 0, 0, 0.5);
		display: flex;
		justify-content: center;
		align-items: center;
		flex-direction: column;
	}
</style>

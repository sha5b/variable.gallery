<script>
	import { goto } from '$app/navigation';
	import { fade } from 'svelte/transition';

	export let products;
	let selectedTag = null;
	let selectedCategory = null;

	$: filteredProducts = products.filter(product => 
		(!selectedTag || product.tags.some(tag => tag.name === selectedTag)) &&
		(!selectedCategory || product.categories.some(cat => cat.name === selectedCategory))
	);

	function handleTagClick(tag) {
		selectedTag = selectedTag === tag ? null : tag;
	}

	function handleCategoryClick(category) {
		selectedCategory = selectedCategory === category ? null : category;
	}

	let uniqueTags = [...new Set(products.flatMap(product => product.tags.map(tag => tag.name)))];
	let uniqueCategories = [...new Set(products.flatMap(product => product.categories.map(cat => cat.name)))];
</script>

<div class="space-y-lg py-lg mb-[var(--spacing-xl)]">
	<div class="flex flex-col md:flex-row items-stretch gap-lg">
		<aside class="filter-container p-md rounded-lg w-full md:w-1/4 bg-background text-text-color">
			<h2 class="font-heading font-bold mb-sm text-large">Category</h2>
			<div class="flex flex-wrap gap-sm mb-md">
				{#each uniqueCategories as category}
					<span
						on:click={() => handleCategoryClick(category)}
						class={`pill-button ${selectedCategory === category ? 'pill-selected' : 'pill-default'}`}
					>
						{category}
					</span>
				{/each}
			</div>

			<h2 class="font-heading font-bold mb-sm text-large">Tag</h2>
			<div class="flex flex-wrap gap-sm">
				{#each uniqueTags as tag}
					<span
						on:click={() => handleTagClick(tag)}
						class={`pill-button ${selectedTag === tag ? 'pill-selected' : 'pill-default'}`}
					>
						{tag}
					</span>
				{/each}
			</div>
		</aside>

		<!-- Product Grid -->
		<div class="product-grid w-full flex flex-wrap gap-md">
			{#each filteredProducts as product (product.id)}
				<div
					in:fade={{ duration: 400 }} out:fade={{ duration: 300 }}
					class="featured-card group h-80 overflow-hidden rounded-lg bg-background transition-all cursor-pointer"
					on:click={() => goto(`/shop/${product.id}`)}
				>
					<img src={product.images[0]?.src} alt={product.name} class="product-image w-full h-full object-cover rounded-lg transition-transform duration-300 group-hover:scale-105" />
					<div class="overlay absolute inset-0 bg-primary bg-opacity-50 opacity-0 group-hover:opacity-100 transition-opacity flex-center text-center p-md">
						<h3 class="text-white text-large font-bold mb-sm">{product.name}</h3>
						<div class="flex gap-xs flex-wrap justify-center">
							{#each product.tags as tag}
								<span class="tag">
									{tag.name}
								</span>
							{/each}
						</div>
					</div>
				</div>
			{/each}
		</div>
	</div>
</div>

<style>
	/* Filter Container Styling */
	.filter-container {
		background-color: var(--background-color);
		color: var(--text-color);
	}

	/* Pill Button Styling */
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

	/* Product Grid */
	.product-grid {
		display: flex;
		flex-wrap: wrap;
	}

	/* Featured Card */
	.featured-card {
		flex: 1 1 calc(33.333% - var(--spacing-md)); /* Consistent basis for grid items */
		position: relative;
		border-radius: var(--rounded-lg);
		overflow: hidden;
	}

	.product-image {
		transition: transform 0.3s ease; /* Smooth scale effect */
	}

	.featured-card:hover .product-image {
		transform: scale(1.05); /* Scale slightly without causing layout shifts */
	}

	/* Overlay on Hover */
	.overlay {
		background-color: rgba(0, 0, 0, 0.5);
		display: flex;
		justify-content: center;
		border-radius: var(--rounded-lg);
		align-items: center;
		flex-direction: column;
	}

	/* Responsive adjustments */
	@media (max-width: 767px) {
		.product-grid {
			flex-direction: column;
		}

		.featured-card {
			flex: 1 1 100%; /* Full width on mobile */
		}
	}

	@media (min-width: 768px) and (max-width: 1024px) {
		.featured-card {
			flex: 1 1 calc(50% - var(--spacing-md)); /* Two columns on tablet */
		}
	}

	@media (min-width: 1024px) {
		.featured-card {
			flex: 1 1 calc(25% - var(--spacing-md)); /* Four columns on desktop */
		}
	}
</style>

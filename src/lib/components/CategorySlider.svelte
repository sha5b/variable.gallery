<script>
	import { goto } from '$app/navigation';

	// Props to accept products and a category
	export let products = [];
	export let category = '';

	// Filter products by category
	let filteredProducts = products.filter((product) =>
		product.categories.some((cat) => cat.name === category)
	);

	// Limit to 20 newest products within the same category
	let limitedProducts = filteredProducts
		.slice()
		.sort((a, b) => new Date(b.date_modified) - new Date(a.date_modified))
		.slice(0, 20);

	// Reference to slider element
	let slider;

	function handleProductClick(productId) {
		goto(`/shop/${productId}`);
	}

	function handleMouseMove(event) {
		// Only apply mouse move scroll for desktop screens
		if (window.innerWidth >= 768) {
			const rect = slider.getBoundingClientRect();
			const mouseX = event.clientX - rect.left;
			const sliderWidth = rect.width;
			const middleX = sliderWidth / 2;
			const offsetX = mouseX - middleX;
			const maxScroll = slider.scrollWidth - sliderWidth;
			const scrollPosition = (maxScroll * offsetX) / middleX / 2;
			slider.scrollBy({
				left: scrollPosition,
				behavior: 'smooth',
			});
		}
	}
</script>

<div class="category-slider-container" bind:this={slider} on:mousemove={handleMouseMove}>
	<h1>{category}</h1>
	<div class="category-slider">
		{#each limitedProducts as product}
			<div class="category-card" on:click={() => handleProductClick(product.id)}>
				<!-- Display Product Tags Above the Image -->
				<div class="tag-container">
					{#each product.tags as tag}
						<span class="tag">{tag.name}</span>
					{/each}
				</div>
				
				<!-- Product Image -->
				<img src={product.images[0]?.src} alt={product.name} class="product-image" />
			</div>
		{/each}
	</div>
</div>

<style>
	.category-slider-container {
		width: 100%;
		overflow: hidden;

		padding-left: 2rem;
		padding-bottom: 2rem;
		transition: all 0.3s ease;
	}


	/* Horizontal scrolling for mobile */
	@media (max-width: 767px) {
		.category-slider-container {
			overflow-x: auto;
			scroll-snap-type: x mandatory;
			-webkit-overflow-scrolling: touch;
			
		}
		.category-slider {
			display: flex;
			gap: 1rem;
			
		}
		.category-card {
			flex: 0 0 80%; /* Take up 80% of the container width */
			scroll-snap-align: start;
			position: relative;
			
		}
	}

	/* Normal desktop layout */
	@media (min-width: 768px) {
		.category-slider {
			display: flex;
			gap: 1rem;
			
		}

		.category-card {
			flex: 0 0 300px;
			height: 300px;
			position: relative;
			overflow: hidden;
			border-radius: 10px;
			transition: flex 0.9s ease;
			cursor: pointer;
			
		}

		.category-card:hover {
			flex: 0 0 600px;
		}
	}

	.product-image {
		width: 100%;
		height: 300px;
		object-fit: cover;
		border-radius: 10px;
	}

	.tag-container {
		position: absolute;
		top: 8px;
		left: 8px;
		display: flex;
		gap: 0.25rem;
		flex-wrap: wrap;
		z-index: 10;
	}

	.tag {
		background-color: var(--primary-color); /* Update to primary color */
		color: var(--background-color);
		padding: 0.25rem 0.5rem;
		border-radius: 9999px;
		font-size: 0.75rem;
		font-weight: 600;
	}
	h1{
		font-size: 4rem;
	}
</style>

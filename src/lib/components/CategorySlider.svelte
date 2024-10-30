<script>
	import { goto } from '$app/navigation';

	export let products = [];
	export let category = '';

	let filteredProducts = products.filter((product) =>
		product.categories.some((cat) => cat.name === category)
	);

	let limitedProducts = filteredProducts
		.slice()
		.sort((a, b) => new Date(b.date_modified) - new Date(a.date_modified))
		.slice(0, 20);

	// Initially set the first product as the current product
	let currentProduct = limitedProducts[0];
	$: currentProductTags = currentProduct ? currentProduct.tags.map(tag => tag.name) : [];

	let slider;
	let scrollTarget = 0;
	let currentScroll = 0;
	let isAnimating = false;

	function handleProductClick(product) {
		currentProduct = product; // Set the clicked product as the current product
		goto(`/shop/${product.id}`);
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
			scrollTarget = (maxScroll * offsetX) / middleX / 10; // Adjust for smooth movement

			if (!isAnimating) {
				isAnimating = true;
				animateScroll();
			}
		}
	}

	function animateScroll() {
		const easing = 0.1; // Adjust this for smoother movement
		const distance = scrollTarget - currentScroll;
		currentScroll += distance * easing;

		slider.scrollLeft = currentScroll;

		// Continue the animation if not reached the target
		if (Math.abs(distance) > 0.5) {
			requestAnimationFrame(animateScroll);
		} else {
			isAnimating = false; // Stop animating when close to the target
		}
	}
</script>

<div class="category-header pl-4 py-4">
	<h1 class="category-title">{category}</h1>
	<div class="tag-container">
		{#each currentProductTags as tag}
			<span class="tag-pill">{tag}</span>
		{/each}
	</div>
</div>

<div class="category-slider-container" bind:this={slider} on:mousemove={handleMouseMove}>
	<div class="category-slider">
		{#each limitedProducts as product}
			<div class="category-card" on:click={() => handleProductClick(product)}>
				<div class="product-tag-container">
					{#each product.tags as tag}
						<span class="tag">{tag.name}</span>
					{/each}
				</div>
				<img src={product.images[0]?.src} alt={product.name} class="product-image" />
			</div>
		{/each}
	</div>
</div>

<style>
	/* Slider Container */
	.category-slider-container {
		width: 100%;
		overflow: hidden;
		padding-left: 1rem;
		padding-bottom: 2rem;
		transition: all 0.3s ease;
	}

	/* Category Header */
	.category-header {
		display: flex;
		align-items: center;
		gap: 4rem;
	}

	.category-title {
		font-size: 4rem;
		font-weight: bold;
		color: var(--primary-color);
		padding: 0.5rem 0;
	}

	.tag-container {
		display: flex;
		flex-wrap: wrap;
		gap: 2rem;
	}

	.tag-pill {
		background-color: var(--primary-color);
		color: var(--background-color);
		padding: 0.6rem 1.2rem;
		border-radius: 9999px;
		font-size: 1rem;
		font-weight: 600;
	}

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
			flex: 0 0 80%;
			scroll-snap-align: start;
			position: relative;
		}
	}

	@media (min-width: 768px) {
		.category-slider {
			display: flex;
			gap: 1.5rem;
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
		height: 100%;
		object-fit: cover;
		border-radius: 10px;
	}

	.product-tag-container {
		position: absolute;
		top: 8px;
		left: 8px;
		display: flex;
		gap: 0.5rem;
		flex-wrap: wrap;
		z-index: 10;
	}

	.tag {
		background-color: var(--primary-color);
		color: var(--background-color);
		padding: 0.25rem 0.5rem;
		border-radius: 9999px;
		font-size: 0.75rem;
		font-weight: 600;
	}
</style>

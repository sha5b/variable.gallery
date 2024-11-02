<script>
	import { goto } from '$app/navigation';

	export let products = [];
	export let category = '';

	$: filteredProducts = products.filter((product) =>
		product.categories.some((cat) => cat.name === category)
	);

	$: displayedProducts = filteredProducts
		.slice()
		.sort((a, b) => new Date(b.date_modified) - new Date(a.date_modified));

	let slider;
	let scrollTarget = 0;
	let currentScroll = 0;
	let isAnimating = false;

	function handleProductClick(product) {
		goto(`/shop/${product.id}`);
	}

	function handleMouseMove(event) {
		if (window.innerWidth >= 768) {
			const rect = slider.getBoundingClientRect();
			const mouseX = event.clientX - rect.left;
			const sliderWidth = rect.width;
			const middleX = sliderWidth / 2;
			const offsetX = mouseX - middleX;
			const maxScroll = slider.scrollWidth - sliderWidth;

			// Adjust `scrollTarget` and ensure it stays within bounds
			scrollTarget = Math.min(
				maxScroll,
				Math.max(0, currentScroll + ((offsetX / middleX) * maxScroll) / 2)
			);

			if (!isAnimating) {
				isAnimating = true;
				animateScroll();
			}
		}
	}

	function animateScroll() {
		const easing = 0.1;
		const distance = scrollTarget - currentScroll;
		currentScroll += distance * easing;
		slider.scrollLeft = currentScroll;

		// Stop animating if the scroll has reached the start or end
		if (
			Math.abs(distance) > 0.5 &&
			currentScroll !== 0 &&
			currentScroll !== slider.scrollWidth - slider.clientWidth
		) {
			requestAnimationFrame(animateScroll);
		} else {
			isAnimating = false;
		}
	}
</script>

<section class='px-page mt-4'>
	<div class="category-header pl-page py-page ">
		<h1 class="category-title text-4xl font-bold">{category}</h1>
	</div>

	<div class="category-slider-container" bind:this={slider} on:mousemove={handleMouseMove}>
		<div class="category-slider gap-lg flex">
			{#each displayedProducts as product}
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
</section>

<style>
	.category-slider-container {
		width: 100%;
		overflow: hidden;
		padding-left: var(--spacing-md);
		padding-bottom: var(--spacing-lg);
		transition: all 0.3s ease;
	}

	.category-header {
		display: flex;
		align-items: center;
		gap: var(--spacing-lg);
	}

	.category-title {
		color: var(--primary-color);
		padding: var(--spacing-sm) 0;
	}

	.category-slider {
		display: flex;
		gap: var(--spacing-md);
	}

	.category-card {
		flex: 0 0 300px;
		height: 300px;
		position: relative;
		overflow: hidden;
		transition: flex 0.9s ease;
		cursor: pointer;
	}

	.category-card:hover {
		flex: 0 0 600px;
	}

	.product-image {
		width: 100%;
		height: 100%;
		object-fit: cover;
	}

	.product-tag-container {
		position: absolute;
		top: var(--spacing-xs);
		left: var(--spacing-xs);
		display: flex;
		gap: var(--spacing-sm);
		flex-wrap: wrap;
		z-index: 10;
	}

	.tag {
		background-color: var(--primary-color);
		color: var(--background-color);
		padding: var(--spacing-xs) var(--spacing-sm);
		border-radius: 9999px;
		font-size: var(--font-size-small);
		font-weight: 600;
	}

	/* Responsive styles */
	@media (max-width: 767px) {
		.category-slider-container {
			overflow-x: auto;
			scroll-snap-type: x mandatory;
			-webkit-overflow-scrolling: touch;
		}

		.category-slider {
			gap: var(--spacing-sm);
		}

		.category-card {
			flex: 0 0 80%;
			scroll-snap-align: start;
		}
	}
</style>

<script>
	import { goto } from '$app/navigation';

	export let products = [];
	export let artistName = '';

	// Filter products based on artist attribute
	$: filteredProducts = products.filter(product =>
		product.attributes.some(attr => attr.name.toLowerCase() === 'artist' && attr.options.includes(artistName))
	);

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

			scrollTarget = Math.min(maxScroll, Math.max(0, currentScroll + ((offsetX / middleX) * maxScroll) / 2));

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

		if (Math.abs(distance) > 0.5 && currentScroll !== 0 && currentScroll !== slider.scrollWidth - slider.clientWidth) {
			requestAnimationFrame(animateScroll);
		} else {
			isAnimating = false;
		}
	}
</script>

<section class='artist-slider-section'>
	<div class="artist-slider-header pl-page py-page ">
		<h1 class="artist-slider-title text-large font-bold">more from {artistName}</h1>
	</div>

	<div class="artist-slider-container" bind:this={slider} on:mousemove={handleMouseMove}>
		<div class="artist-slider gap-lg flex">
			{#each filteredProducts as product}
				<div class="artist-card" on:click={() => handleProductClick(product)}>
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
	.artist-slider-section {
		width: 100%;
		overflow: hidden;
	}

	.artist-slider-container {
		width: 100%;
		overflow: hidden;
		transition: all 0.3s ease;
	}

	.artist-slider-header {
		display: flex;
		align-items: center;
		gap: var(--spacing-lg);
	}

	.artist-slider-title {
		color: var(--primary-color);
	}

	.artist-slider {
		display: flex;
		gap: var(--spacing-md);
		overflow: hidden;
	}

	.artist-card {
		flex: 0 0 150px;
		height: 150px;
		position: relative;
		overflow: hidden;
		transition: flex 0.6s ease;
		cursor: pointer;
	}

	.artist-card:hover {
		flex: 0 0 300px;
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
		.artist-slider-container {
			overflow-x: hidden;
			scroll-snap-type: x mandatory;
			-webkit-overflow-scrolling: touch;
		}

		.artist-slider {
			gap: var(--spacing-sm);
			overflow-x: auto;
			padding-left: var(--spacing-xs);
			padding-right: var(--spacing-xs);
			scroll-snap-type: x mandatory;
			-webkit-overflow-scrolling: touch;
		}

		.artist-card {
			flex: 0 0 80%;
			scroll-snap-align: start;
			height: 500px;
			min-height: 150px;
		}
	}
</style>

<script>
	import { addItem } from '$lib/stores/cartStore';
	import { toggleCartSlider, isCartSliderOpen } from '$lib/stores/cartSliderStore';
	import { goto } from '$app/navigation';

	export let products;

	// Limit to 20 newest products
	let limitedProducts = products
		.slice()
		.sort((a, b) => new Date(b.date_modified) - new Date(a.date_modified))
		.slice(0, 20);

	let slider;
	let isCartOpen = false;

	// Subscribe to the cart slider state
	$: isCartSliderOpen.subscribe((value) => {
		isCartOpen = value;
	});

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

<div class="featured-slider-container" bind:this={slider} on:mousemove={handleMouseMove}>
	<div class="featured-slider">
		{#each limitedProducts as product}
			<div class="featured-card" on:click={() => handleProductClick(product.id)}>
				<!-- Display Product Tags Above the Image -->
				<div class="tag-container absolute top-2 left-2 z-10 flex gap-1 flex-wrap">
					{#each product.tags as tag}
						<span class="bg-purple-500 text-gray-200 px-2 py-1 rounded-full text-xs font-semibold">
							{tag.name}
						</span>
					{/each}
				</div>
				
				<!-- Product Image -->
				<img src={product.images[0]?.src} alt={product.name} class="product-image" />
			</div>
		{/each}
	</div>
</div>

<style>
	.featured-slider-container {
		width: 100%;
		overflow: hidden;
		transition: all 0.3s ease;
	}

	/* Horizontal scrolling for mobile */
	@media (max-width: 767px) {
		.featured-slider-container {
			overflow-x: auto;
			scroll-snap-type: x mandatory;
			-webkit-overflow-scrolling: touch;
		}
		.featured-slider {
			display: flex;
			gap: 1rem;
		}
		.featured-card {
			flex: 0 0 80%; /* Take up 80% of the container width */
			scroll-snap-align: start;
			transition: none; /* Disable hover scaling on mobile */
		}
	}

	/* Normal desktop layout */
	@media (min-width: 768px) {
		.featured-slider {
			display: flex;
			gap: 1rem;
		}

		.featured-card {
			flex: 0 0 300px;
			height: 50vh;
			position: relative;
			overflow: hidden;
			border-radius: 10px;
			transition: flex 0.9s ease;
			cursor: pointer;
		}

		.featured-card:hover {
			flex: 0 0 600px;
		}
	}

	.product-image {
		width: 100%;
		height: 100%;
		object-fit: cover;
		border-radius: 10px;
	}

	.tag-container {
		padding: 0.5rem;
		border-radius: 0.5rem;
		display: flex;
		gap: 0.25rem;
		flex-wrap: wrap;
	}
</style>

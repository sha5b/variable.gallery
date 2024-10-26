<script>
	import { addItem } from '$lib/stores/cartStore';
	import { toggleCartSlider, isCartSliderOpen } from '$lib/stores/cartSliderStore';
	import { goto } from '$app/navigation';

	export let products;

	// Limit to 20 newest products based on WooCommerce's `date_modified` field
	let limitedProducts = products
		.slice() // make a copy
		.sort((a, b) => new Date(b.date_modified) - new Date(a.date_modified)) // sort by date_modified
		.slice(0, 20); // take only the first 20 items

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
</script>

<div class="featured-slider-container" bind:this={slider} on:mousemove={handleMouseMove}>
	<div class="featured-slider">
		{#each limitedProducts as product}
			<div class="featured-card">
				<!-- Display Product Tags Above the Image -->
				<div class="tag-container absolute top-2 left-2 z-10 flex gap-1 flex-wrap">
					{#each product.tags as tag}
						<span class="bg-gray-200 text-gray-800 px-2 py-1 rounded-full text-xs font-semibold">
							{tag.name}
						</span>
					{/each}
				</div>
				
				<!-- Product Image and Click Event to Navigate to Product Page -->
				<img src={product.images[0]?.src} alt={product.name} class="product-image" on:click={() => handleProductClick(product.id)} />
			</div>
		{/each}
	</div>
</div>

<style>
	.featured-slider-container {
		width: 100%;
		overflow: hidden;
		margin: 2rem 0;
		transition: all 0.3s ease;
	}

	/* Adjust width when cart slider is open */
	.featured-slider-container.cart-open {
		width: calc(100% - 400px);
	}

	.featured-slider {
		display: flex;
		gap: 1rem;
		transition: transform 0.3s ease;
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

	.product-image {
		width: 100%;
		height: 100%;
		object-fit: cover;
		border-radius: 10px;
	}

	.tag-container {
		/* Position tags above the image */
		padding: 0.5rem;
		border-radius: 0.5rem;
		display: flex;
		gap: 0.25rem;
		flex-wrap: wrap;
	}
</style>

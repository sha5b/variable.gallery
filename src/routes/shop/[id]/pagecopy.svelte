<script>
	import Modal from '$lib/components/Modal.svelte';
	import { page } from '$app/stores';
	import { addItem } from '$lib/stores/cartStore';
	import { toggleCartSlider } from '$lib/stores/cartSliderStore';
	import CategorySlider from '$lib/components/CategorySlider.svelte';

	export let data;
	let { product, variation, products } = data;

	let modalOpen = false;
	let currentImageIndex = 0;
	let gallery = [];
	let primaryCategory = '';

	// Get the current product based on the page params
	$: product = products ? products.find((p) => p.id === Number($page.params.id)) : null;
	console.log('Current Product:', product); // Debugging: Check the current product

	// If the product exists, set up gallery images and primary category
	$: if (product) {
		gallery = product.images?.map((img) => img.src) || [];
		console.log('Product Categories:', product.categories); // Debugging: Check product categories

		// Choose the primary category (e.g., the first one in the categories array)
		primaryCategory =
			product.categories && product.categories.length > 0 ? product.categories[0].name : '';
		console.log('Primary Category:', primaryCategory); // Debugging: Check primary category value
	}

	function addToCart() {
		if (product && variation) {
			addItem({ ...product, ...variation });
			toggleCartSlider();
		}
	}

	function openModal(index) {
		currentImageIndex = index;
		modalOpen = true;
	}

	function closeModal() {
		modalOpen = false;
	}

	let slider;

	let scrollTarget = 0;
	let currentScroll = 0;
	let isAnimating = false;

    function handleImageMouseMove(event, imageContainer) {
        const rect = imageContainer.getBoundingClientRect();
        const mouseX = event.clientX - rect.left;
        const mouseY = event.clientY - rect.top;
        const offsetX = ((mouseX / rect.width) * 100) - 50;
        const offsetY = ((mouseY / rect.height) * 100) - 50;
        
        imageContainer.style.setProperty('--x', `${offsetX}%`);
        imageContainer.style.setProperty('--y', `${offsetY}%`);
		
    }
	function animateScroll() {
		// Apply easing effect
		const easing = 0.1; // Change to control speed and smoothness
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

<Modal images={gallery} bind:open={modalOpen} bind:currentIndex={currentImageIndex} />

{#if product}
{console.log(variation)}
	<div class="product-container flex h-screen w-full">
		<!-- Details Section (Reordered on Mobile) -->
		<div
			class="product-details flex h-full w-full flex-col justify-end space-y-4 bg-[var(--background-color)] p-4 md:w-1/4"
		>
			<h1 class="text-4xl font-bold text-[var(--text-color)]">{product.name}</h1>
			<p class="text-lg text-[var(--text-color)]">
				{@html product.short_description || product.description}
			</p>

			<p class="text-lg text-[var(--text-color)]">
				{variation.name}
			</p>

			<!-- Relevant product information -->
			<p class="text-sm text-[var(--text-color)]"><strong>SKU:</strong> {variation.stock_quantity || 'N/A'}</p>
			<p class="text-sm text-[var(--text-color)]">
				<strong>Stock Status:</strong>
				{variation.stock_status || 'N/A'}
			</p>

			<!-- Price Display Logic -->
			<p class="text-2xl font-semibold">
				{#if product.sale_price && product.sale_price !== ''}
					<span class="text-[var(--secondary-color)] line-through">€{product.regular_price}</span>
					€{product.sale_price}
				{:else if variation.regular_price}
					€{variation.regular_price}
				{:else}
					Price not available
				{/if}
			</p>

			<!-- Additional Product Details -->
			{#if product.dimensions}
				<p class="mb-2 text-sm text-[var(--text-color)]">
					<strong>Dimensions:</strong>
					{product.dimensions.length || 'N/A'} x {product.dimensions.width || 'N/A'} x {product
						.dimensions.height || 'N/A'} cm
				</p>
			{/if}
			{#if product.weight}
				<p class="mb-2 text-sm text-[var(--text-color)]">
					<strong>Weight:</strong>
					{product.weight || 'N/A'} kg
				</p>
			{/if}

			<!-- Display Categories and Tags -->
			{#if product.categories.length > 0}
				<p class="mb-2 text-sm text-[var(--text-color)]">
					<strong>Categories:</strong>
					{#each product.categories as category}{category.name}{#if category !== product.categories[product.categories.length - 1]},
						{/if}{/each}
				</p>
			{/if}

			{#if product.tags.length > 0}
				<p class="mb-2 text-sm text-[var(--text-color)]">
					<strong>Tags:</strong>
					{#each product.tags as tag}{tag.name}{#if tag !== product.tags[product.tags.length - 1]},
						{/if}{/each}
				</p>
			{/if}

			<!-- Add to Cart Button -->
			<button
				on:click={addToCart}
				class="rounded-md bg-[var(--primary-color)] px-4 py-2 font-semibold text-[var(--background-color)] transition duration-300 hover:bg-[var(--secondary-color)]"
			>
				Add to Cart
			</button>
		</div>

		<!-- Image Gallery Section -->
		<div class="image-gallery flex h-full w-full flex-col md:w-full">
			<div class="thumbnail-slider-container" bind:this={slider} on:mousemove={handleImageMouseMove}>
				<div class="thumbnail-slider">
					{#each gallery as image, index}
						<div class="featured-card" on:click={() => openModal(index)}>
							<img src={image} alt="Gallery image" class="product-image" />
						</div>
					{/each}
				</div>
			</div>
		</div>
	</div>
{/if}

<!-- CategorySlider component with category passed as prop -->
<CategorySlider {products} category={primaryCategory} />

<style>
	.product-container {
		display: flex;
		padding-top: 4rem;
	}

	.thumbnail-slider-container {
		width: 100%;
		overflow: hidden;
		margin: 1rem 0;
		display: flex;
		align-items: center;
		cursor: pointer;
		scroll-behavior: smooth;
	}

	.thumbnail-slider {
		display: flex;
		gap: 1rem;
		transition: transform 0.3s ease;
	}

	.featured-card {
		flex: 0 0 33%;
		height: 100vh;
		position: relative;
		overflow: hidden;
		border-radius: 10px;
		transition: flex 0.9s ease;
		cursor: pointer;
	}

	.featured-card:hover {
		flex: 0 0 90%;
	}

	.product-image {
		width: 100%;
		height: 100%;
		object-fit: cover;
		border-radius: 10px;
	}

	/* Mobile-specific adjustments */
	@media (max-width: 768px) {
		.product-container {
			flex-direction: column;
		}

		.product-details {
			order: -1;
			width: 100%;
		}

		.image-gallery {
			width: 100%;
			overflow: hidden;
		}

		.thumbnail-slider-container {
			overflow-x: auto;
			overflow-y: hidden;
			max-height: 60vh;
			display: flex;
			align-items: center;
		}

		.thumbnail-slider {
			flex-direction: row;
			gap: 1rem;
		}

		.featured-card {
			flex: 0 0 80%;
			height: auto;
			width: 100%;
			max-height: 300px;
			cursor: pointer;
		}

		.product-image {
			width: 100%;
			height: 100%;
			object-fit: cover;
			max-height: 300px;
		}
	}
</style>

<script>
	import Modal from '$lib/components/Modal.svelte';
	import { page } from '$app/stores';
	import { addItem } from '$lib/stores/cartStore';
	import { toggleCartSlider } from '$lib/stores/cartSliderStore';
	import CategorySlider from '$lib/components/CategorySlider.svelte';
	import { fetchWooCommerceData } from '$lib/api';

	export let data;
	const { products } = data;

	let modalOpen = false;
	let currentImageIndex = 0;
	let gallery = [];
	let primaryCategory = '';
	let hoveredIndex = null;
	let activeData = null;
	let product = null;

	// Get the current product based on the page params
	$: product = products ? products.find((p) => p.id === Number($page.params.id)) : null;

	// Fetch variations if the product exists
	$: if (product) {
		(async () => {
			// Initialize the gallery with main product images
			gallery = product.images?.map((img) => img.src) || [];
			primaryCategory = product.categories?.[0]?.name || '';

			if (product.variations && product.variations.length > 0) {
				// Fetch each variation's data
				const variations = await Promise.all(
					product.variations.map(variationId => fetchWooCommerceData(`products/${product.id}/variations/${variationId}`))
				);

				// Set the first variation as active data by default
				activeData = variations[0];

				// Collect all images from variations and add to the gallery
				gallery = [
					...(product.images || []).map(img => img.src), // Main product images
					...variations.flatMap(variant => variant.image ? [variant.image.src] : []) // Variation images
				];
			} else {
				// No variations; use main product data as activeData
				activeData = product;
			}
		})();
	}

	function addToCart() {
		if (activeData) {
			addItem(activeData);
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

	// Image zooming variables
	let zoomImageStyle = "";

	function handleImageHover(event, index) {
		hoveredIndex = index;
		const img = event.currentTarget;
		const rect = img.getBoundingClientRect();
		const offsetX = ((event.clientX - rect.left) / rect.width) * 100;
		const offsetY = ((event.clientY - rect.top) / rect.height) * 100;
		zoomImageStyle = `transform: scale(1.5); transform-origin: ${offsetX}% ${offsetY}%;`;
	}

	function resetImageZoom() {
		hoveredIndex = null;
		zoomImageStyle = "";
	}
</script>

<Modal images={gallery} bind:open={modalOpen} bind:currentIndex={currentImageIndex} />

{#if activeData}
	<div class="product-container flex h-screen w-full">
		<!-- Details Section -->
		<div class="product-details flex h-full w-full flex-col justify-end space-y-4 bg-[var(--background-color)] p-4 md:w-1/4">
			<h1 class="text-4xl font-bold text-[var(--text-color)]">{product.name}</h1>
			<p class="text-sm font-bold text-[var(--text-color)]">{activeData.name || product.name}</p>
			
			
			<p class="text-sm font-bold text-[var(--text-color)]">{@html product.short_description}</p>
			<p class="text-sm text-[var(--text-color)]"><strong>Edition:</strong> {parseInt(activeData.stock_quantity) || 'N/A'}</p>
			<p class="text-sm text-[var(--text-color)]"><strong>Stock Status:</strong> {activeData.stock_status || product.stock_status || 'N/A'}</p>
			<p class="text-2xl font-semibold">
				{#if activeData.sale_price && activeData.sale_price !== ''}
					<span class="text-[var(--secondary-color)] line-through">€{activeData.regular_price}</span>
					€{activeData.sale_price}
				{:else if activeData.regular_price}
					€{activeData.regular_price}
				{:else}
					Price not available
				{/if}
			</p>
			<!-- Add to Cart Button -->
			<button on:click={addToCart} class="rounded-md bg-[var(--primary-color)] px-4 py-2 font-semibold text-[var(--background-color)] transition duration-300 hover:bg-[var(--secondary-color)]">
				Add to Cart
			</button>
		</div>

		<!-- Image Gallery Section -->
		<div class="image-gallery flex h-full w-full flex-col md:w-full">
			<div class="thumbnail-slider-container" bind:this={slider}>
				<div class="thumbnail-slider">
					{#each gallery as image, index}
						<div class="featured-card {hoveredIndex === index ? 'active' : ''} {hoveredIndex !== null && hoveredIndex !== index ? 'inactive' : ''}" 
						     on:click={() => openModal(index)}
						     on:mousemove={(event) => handleImageHover(event, index)}
						     on:mouseleave={resetImageZoom}>
							<img src={image} alt="Gallery image" class="product-image" style={hoveredIndex === index ? zoomImageStyle : ''} />
						</div>
					{/each}
				</div>
			</div>
		</div>
	</div>
{/if}

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
	}

	.thumbnail-slider {
		display: flex;
		gap: 1rem;
	}

	.featured-card {
		flex: 1;
		height: 100vh;
		overflow: hidden;
		transition: flex 0.6s ease, background-position 0.6s ease;
		cursor: pointer;
	}

	.featured-card.active {
		flex: 3;
		background-position: top;
	}

	.featured-card.inactive {
		flex: 0.5;
		opacity: 0.8;
	}

	.product-image {
		width: 100%;
		height: 100%;
		object-fit: cover;
		transition: transform 0.3s ease;
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
		}

		.product-image {
			width: 100%;
			height: 100%;
			object-fit: cover;
			max-height: 300px;
		}
	}
</style>

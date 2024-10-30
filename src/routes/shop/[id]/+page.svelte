<script>
	import Modal from '$lib/components/Modal.svelte';
	import { page } from '$app/stores';
	import { addItem } from '$lib/stores/cartStore';
	import { toggleCartSlider } from '$lib/stores/cartSliderStore';
	import CategorySlider from '$lib/components/CategorySlider.svelte';

	export let data;
	const { products } = data;

	let modalOpen = false;
	let currentImageIndex = 0;
	let gallery = [];
	let primaryCategory = '';

	// Get the current product based on the page params
	$: product = products ? products.find((p) => p.id === Number($page.params.id)) : null;
	console.log("Current Product:", product); // Debugging: Check the current product

	// If the product exists, set up gallery images and primary category
	$: if (product) {
		gallery = product.images?.map((img) => img.src) || [];
		console.log("Product Categories:", product.categories); // Debugging: Check product categories
		
		// Choose the primary category (e.g., the first one in the categories array)
		primaryCategory = product.categories && product.categories.length > 0 ? product.categories[0].name : '';
		console.log("Primary Category:", primaryCategory); // Debugging: Check primary category value
	}

	function addToCart() {
		if (product) {
			addItem(product);
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

	function handleMouseMove(event) {
		const rect = slider.getBoundingClientRect();
		const mouseX = event.clientX - rect.left;
		const sliderWidth = rect.width;
		const middleX = sliderWidth / 2;
		const offsetX = mouseX - middleX;
		const maxScroll = slider.scrollWidth - sliderWidth;
		const scrollPosition = (maxScroll * offsetX) / middleX / 4;
		slider.scrollBy({
			left: scrollPosition,
			behavior: 'smooth'
		});
	}
</script>

<Modal images={gallery} bind:open={modalOpen} bind:currentIndex={currentImageIndex} />

{#if product}
	<div class="product-container flex h-screen w-full">
		<!-- Details Section (Reordered on Mobile) -->
		<div class="product-details flex h-full w-full md:w-1/4 flex-col justify-end space-y-4 bg-[var(--background-color)] p-4">
			<h1 class="text-4xl font-bold text-[var(--text-color)]">{product.name}</h1>
			<p class="text-lg text-[var(--text-color)]">{product.short_description || product.description}</p>
			
			<!-- Relevant product information -->
			<p class="text-sm text-[var(--text-color)]"><strong>SKU:</strong> {product.sku || 'N/A'}</p>
			<p class="text-sm text-[var(--text-color)]"><strong>Stock Status:</strong> {product.stock_status || 'N/A'}</p>
			
			<!-- Price Display Logic -->
			<p class="text-2xl font-semibold">
				{#if product.sale_price && product.sale_price !== ''}
					<span class="text-[var(--secondary-color)] line-through">€{product.regular_price}</span>
					€{product.sale_price}
				{:else if product.regular_price}
					€{product.regular_price}
				{:else}
					Price not available
				{/if}
			</p>
			
			<!-- Additional Product Details -->
			{#if product.dimensions}
			<p class="text-sm text-[var(--text-color)] mb-2">
			  <strong>Dimensions:</strong> {product.dimensions.length || 'N/A'} x {product.dimensions.width || 'N/A'} x {product.dimensions.height || 'N/A'} cm
			</p>
		  {/if}
		  {#if product.weight}
			<p class="text-sm text-[var(--text-color)] mb-2"><strong>Weight:</strong> {product.weight || 'N/A'} kg</p>
		  {/if}
	
		  <!-- Display Categories and Tags -->
		  {#if product.categories.length > 0}
			<p class="text-sm text-[var(--text-color)] mb-2">
			  <strong>Categories:</strong> {#each product.categories as category}{category.name}{#if category !== product.categories[product.categories.length - 1]}, {/if}{/each}
			</p>
		  {/if}
	
		  {#if product.tags.length > 0}
			<p class="text-sm text-[var(--text-color)] mb-2">
			  <strong>Tags:</strong> {#each product.tags as tag}{tag.name}{#if tag !== product.tags[product.tags.length - 1]}, {/if}{/each}
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
		<div class="image-gallery flex h-full w-full md:w-full flex-col">
			<div class="thumbnail-slider-container" bind:this={slider} on:mousemove={handleMouseMove}>
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

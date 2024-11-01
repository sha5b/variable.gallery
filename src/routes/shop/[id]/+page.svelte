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
	let hoveredImageIndex = null;
	let gallerySlider;

	$: product = products ? products.find((p) => p.id === Number($page.params.id)) : null;

	$: if (product) {
		gallery = product.images?.map((img) => img.src) || [];
		primaryCategory =
			product.categories && product.categories.length > 0 ? product.categories[0].name : '';
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

	function handleMouseEnter(index) {
		hoveredImageIndex = index;
	}

	function handleMouseLeave() {
		hoveredImageIndex = null;
		resetImageTransforms();
	}

	function handleMouseMove(event, imageIndex) {
		if (hoveredImageIndex === imageIndex) {
			const image = event.target;
			const rect = image.getBoundingClientRect();
			const x = (event.clientX - rect.left) / rect.width;
			const y = (event.clientY - rect.top) / rect.height;

			image.style.transformOrigin = `${x * 100}% ${y * 100}%`;
			image.style.transform = 'scale(1.5)';
		}
	}

	function resetImageTransforms() {
		const images = document.querySelectorAll('.product-image');
		images.forEach((img) => {
			img.style.transform = 'scale(1)';
			img.style.transformOrigin = 'center';
		});
	}

	// Function to handle scrolling or dragging similar to FeaturedSlider
	function handleScroll(event) {
		const sliderWidth = gallerySlider.scrollWidth - gallerySlider.clientWidth;
		let scrollPosition = gallerySlider.scrollLeft;

		// Calculate new scroll position based on dragging or other slider controls
		// Implement similar logic to the FeaturedSlider (if it has drag-to-scroll or auto-scroll behavior)
	}
	console.log(variation)
</script>


<Modal images={gallery} bind:open={modalOpen} bind:currentIndex={currentImageIndex}>
	<button class="close-modal" on:click={closeModal}>Close</button>
</Modal>

<div class="product-container px-page">
	<div class="product-details space-y-md bg-background flex-col md:w-1/4">
		<h1 class="product-title text-xlarge text-primary font-bold">{product.name}</h1>
		<p class="text-primary text-base">{@html product.short_description || product.description}</p>
		<p class="text-large text-primary">{variation.name}</p>

		<p class="text-small text-primary"><strong>SKU:</strong> {variation.stock_quantity || 'N/A'}</p>
		<p class="text-small text-primary"><strong>Stock Status:</strong> {variation.stock_status || 'N/A'}</p>

		<p class="price text-large text-primary font-semibold">
			{#if product.sale_price && product.sale_price !== ''}
				<span class="sale-price text-secondary line-through">€{product.regular_price}</span>
				€{product.sale_price}
			{:else if variation.regular_price}
				€{variation.regular_price}
			{:else}
				Price not available
			{/if}
		</p>

		{#if product.dimensions}
			<p class="product-info text-small">
				<strong>Dimensions:</strong>
				{product.dimensions.length || 'N/A'} x {product.dimensions.width || 'N/A'} x {product
					.dimensions.height || 'N/A'} cm
			</p>
		{/if}
		{#if product.weight}
			<p class="product-info text-small"><strong>Weight:</strong> {product.weight || 'N/A'} kg</p>
		{/if}

		{#if product.categories.length > 0}
			<p class="product-info text-small">
				<strong>Categories:</strong>
				{#each product.categories as category}{category.name}{#if category !== product.categories[product.categories.length - 1]},{/if}{/each}
			</p>
		{/if}
		{#if product.tags.length > 0}
			<p class="product-info text-small">
				<strong>Tags:</strong>
				{#each product.tags as tag}{tag.name}{#if tag !== product.tags[product.tags.length - 1]},{/if}{/each}
			</p>
		{/if}

		<button on:click={addToCart} class="button-primary">Add to Cart</button>
	</div>

	<div bind:this={gallerySlider} class="image-gallery gap-md flex w-full overflow-hidden md:w-3/4" on:scroll={handleScroll}>
		{#each gallery as image, index}
			<div
				class="featured-card rounded-lg"
				on:mouseenter={() => handleMouseEnter(index)}
				on:mouseleave={handleMouseLeave}
				on:mousemove={(event) => handleMouseMove(event, index)}
				on:click={() => openModal(index)}
				class:featured-hover={hoveredImageIndex === index}
			>
				<img src={image} alt="Gallery image" class="product-image" />
			</div>
		{/each}
	</div>
</div>

<CategorySlider {products} category={primaryCategory} />



<style>
.product-container {
	display: flex;
	width: 100%;
	overflow: hidden;
	padding-top: var(--spacing-lg);
}

.product-details {
	background-color: var(--background-color);
	padding-right: var(--spacing-md);
	align-self: flex-end; /* Aligns the details container to the bottom */
	word-break: break-word; /* Ensures long words break to fit the container */
}

.product-title,
.product-info,
.price {
	word-break: break-word;
}

.image-gallery {
	display: flex;
	width: 100%;
	height: 80vh; /* Fixed height for the container */
	overflow-x: hidden; /* Ensures images are clipped within this container */
	scroll-behavior: smooth;
	gap: var(--spacing-md);
}

.featured-card {
	flex: 0 0 20%; /* Adjusted to take a reasonable space on desktop */
	height: 100%;
	transition: flex 0.6s ease, transform 0.3s ease;
	overflow: hidden;
	position: relative;
	cursor: pointer;
	border-radius: var(--rounded-lg);
}

.featured-hover {
	flex: 0 0 60%; /* Expand when hovered */
}

.product-image {
	width: 100%;
	height: 100%;
	object-fit: cover;
	transition: transform 0.3s ease;
}

/* Tablet-specific styles */
@media (min-width: 768px) and (max-width: 1024px) {
	.product-container {
		flex-direction: row;
		gap: var(--spacing-md);
	}

	.product-details {
		flex: 0 0 35%; /* Makes product details take up more space on tablets */
	}

	.image-gallery {
		flex: 0 0 65%; /* Adjusts the gallery width for tablet */
		height: 60vh; /* Reduce height slightly for tablet view */
	}
}

/* Mobile-specific styles */
@media (max-width: 767px) {
	.product-container {
		flex-direction: column; /* Stacks items vertically on mobile */
	}

	.image-gallery {
		flex-direction: row;
		height: auto;
		max-height: 60vh;
		overflow-x: auto;
		scroll-snap-type: x mandatory;
		-webkit-overflow-scrolling: touch;
		gap: var(--spacing-xs);
		padding-left: var(--spacing-xs);
		padding-right: var(--spacing-xs);
	}

	.featured-card {
		flex: 0 0 calc(80% - var(--spacing-xs));
		max-width: calc(80% - var(--spacing-xs));
		scroll-snap-align: start;
		margin-right: var(--spacing-xs);
		height: auto;
	}
}

</style>

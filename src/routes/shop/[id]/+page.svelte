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
		const images = document.querySelectorAll('.product-image');
		images.forEach((img) => {
			img.style.transform = 'scale(1)';
			img.style.transformOrigin = 'center';
		});
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
	console.log("Main Component - All Products Passed to CategorySlider:", products);
</script>

<Modal images={gallery} bind:open={modalOpen} bind:currentIndex={currentImageIndex}>
	<button class="close-modal" on:click={closeModal}>Close</button>
</Modal>

<div class="product-container flex h-screen w-full">
	<div class="product-details flex h-full w-full flex-col justify-end space-y-4 bg-[var(--background-color)] p-4 md:w-1/4">
		<h1 class="text-4xl font-bold text-[var(--text-color)]">{product.name}</h1>
		<p class="text-lg text-[var(--text-color)]">{@html product.short_description || product.description}</p>
		<p class="text-lg text-[var(--text-color)]">{variation.name}</p>

		<p class="text-sm text-[var(--text-color)]"><strong>SKU:</strong> {variation.stock_quantity || 'N/A'}</p>
		<p class="text-sm text-[var(--text-color)]"><strong>Stock Status:</strong> {variation.stock_status || 'N/A'}</p>

		<p class="text-2xl font-semibold">
			{#if product.sale_price && product.sale_price !== ''}
				<span class="text-[var(--secondary-color)] line-through">€{product.regular_price}</span> €{product.sale_price}
			{:else if variation.regular_price}
				€{variation.regular_price}
			{:else}
				Price not available
			{/if}
		</p>

		{#if product.dimensions}
			<p class="mb-2 text-sm text-[var(--text-color)]"><strong>Dimensions:</strong> {product.dimensions.length || 'N/A'} x {product.dimensions.width || 'N/A'} x {product.dimensions.height || 'N/A'} cm</p>
		{/if}
		{#if product.weight}
			<p class="mb-2 text-sm text-[var(--text-color)]"><strong>Weight:</strong> {product.weight || 'N/A'} kg</p>
		{/if}

		{#if product.categories.length > 0}
			<p class="mb-2 text-sm text-[var(--text-color)]"><strong>Categories:</strong> {#each product.categories as category}{category.name}{#if category !== product.categories[product.categories.length - 1]}, {/if}{/each}</p>
		{/if}
		{#if product.tags.length > 0}
			<p class="mb-2 text-sm text-[var(--text-color)]"><strong>Tags:</strong> {#each product.tags as tag}{tag.name}{#if tag !== product.tags[product.tags.length - 1]}, {/if}{/each}</p>
		{/if}

		<button on:click={addToCart} class="rounded-md bg-[var(--primary-color)] px-4 py-2 font-semibold text-[var(--background-color)] transition duration-300 hover:bg-[var(--secondary-color)]">
			Add to Cart
		</button>
	</div>

	<div class="image-gallery flex h-screen w-screen flex-row overflow-hidden md:w-full">
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
		padding-top: 4rem;
	}

	.image-gallery {
		display: flex;
		width: 100vw;
		height: 100vh;
		overflow-x: auto;
		overflow-y: hidden;
		scroll-behavior: smooth;
		gap: 2rem;
	}

	.featured-card {
		flex: 1 1 20%; /* Set default size to a smaller portion */
		height: 100%;
		transition: flex 0.6s ease, transform 0.3s ease;
		overflow: hidden;
		position: relative;
		cursor: pointer;
	}

	/* Expand the hovered card */
	.featured-hover {
		flex: 3 1 75%; /* Expands the hovered card to a larger portion */
	}

	.product-image {
		width: 100%;
		height: 100%;
		object-fit: cover;
		transition: transform 0.3s ease, transform-origin 0.3s ease;
	}

	.featured-card:not(.featured-hover) .product-image {
		transform: scale(1);
		transform-origin: center;
	}

	/* Responsive styling */
	@media (max-width: 768px) {
		.product-container {
			flex-direction: column;
		}

		.product-details {
			order: -1;
			width: 100%;
		}

		.image-gallery {
			flex-direction: row;
			overflow-x: auto;
			overflow-y: hidden;
			max-height: 60vh;
			gap: .25rem;
			scroll-behavior: smooth;
		}

		.featured-card {
			flex: 0 0 auto;
			width: 80vw;
			max-width: 80vw;
			height: auto;
			max-height: 300px;
		}

		.featured-hover .product-image {
			transform: scale(1.2); /* Adjusted scale for smaller screens */
		}

		.product-image {
			min-width: 100vw;
		}
	}

	/* Close button styling for modal */
	.close-modal {
		position: absolute;
		top: 10px;
		right: 10px;
		background-color: rgba(0, 0, 0, 0.7);
		color: white;
		border: none;
		border-radius: 50%;
		width: 30px;
		height: 30px;
		font-size: 1.2rem;
		cursor: pointer;
		display: flex;
		align-items: center;
		justify-content: center;
	}
</style>

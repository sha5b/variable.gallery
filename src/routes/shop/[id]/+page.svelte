<script>
	import Modal from '$lib/components/Modal.svelte';
	import { page } from '$app/stores';
	import { addItem } from '$lib/stores/cartStore';
	import { toggleCartSlider } from '$lib/stores/cartSliderStore';

	export let data;
	const { products } = data;

	let modalOpen = false;
	let currentImageIndex = 0;
	let gallery = [];

	$: product = products ? products.find((p) => p.id === Number($page.params.id)) : null;

	$: if (product) {
		gallery = product.images?.map((img) => img.src) || [];
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
		<div class="product-details flex h-full w-full md:w-1/4 flex-col justify-end space-y-4 bg-white p-8">
			<h1 class="text-4xl font-bold">{product.name}</h1>
			<p class="text-lg text-gray-700">{product.short_description || product.description}</p>

			<!-- Price Display Logic -->
			<p class="text-2xl font-semibold">
				{#if product.sale_price && product.sale_price !== ''}
					<span class="text-gray-500 line-through">€{product.regular_price}</span>
					€{product.sale_price}
				{:else if product.regular_price}
					€{product.regular_price}
				{:else}
					Price not available
				{/if}
			</p>

			<button
				on:click={addToCart}
				class="rounded-md bg-purple-500 px-4 py-2 font-semibold text-white transition duration-300 hover:bg-purple-700"
			>
				Add to Cart
			</button>
		</div>

		<!-- Image Gallery Section -->
		<div class="image-gallery flex h-full w-full md:w-3/4 flex-col">
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

<style>
	/* Original layout for larger screens */
	.product-container {
		display: flex;
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

	/* Mobile-only styles */
	@media (max-width: 768px) {
		.product-container {
			flex-direction: column;
		}

		.product-details {
			order: -1; /* Show title and button first on mobile */
			width: 100%;
		}

		.image-gallery {
			width: 100%;
		}

		.thumbnail-slider {
			flex-direction: column; /* Stack images vertically on mobile */
		}

		.featured-card {
			flex: 1 0 auto;
			height: auto;
			width: 100%;
		}
	}
</style>

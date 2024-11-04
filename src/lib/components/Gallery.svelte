<script>
	import Modal from '$lib/components/Modal.svelte';

	// Props to accept an array of image URLs
	export let images = [];

	let modalOpen = false;
	let currentImageIndex = 0;
	let hoveredImageIndex = null;

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
		const images = document.querySelectorAll('.gallery-image');
		images.forEach((img) => {
			img.style.transform = 'scale(1)';
			img.style.transformOrigin = 'center';
		});
	}
</script>

<!-- Modal for larger view of the images -->
<Modal images={images} bind:open={modalOpen} bind:currentIndex={currentImageIndex}>
	<button class="close-modal" on:click={closeModal}>Close</button>
</Modal>

<div class="image-gallery">
	{#each images as image, index}
		<div
			class="gallery-card group"
			on:mouseenter={() => handleMouseEnter(index)}
			on:mouseleave={handleMouseLeave}
			on:mousemove={(event) => handleMouseMove(event, index)}
			on:click={() => openModal(index)}
			class:gallery-hover={hoveredImageIndex === index}
		>
			<img src={image} alt="Gallery image" class="gallery-image" />
		</div>
	{/each}
</div>

<style>
	.image-gallery {
		display: flex;
		width: 100%;
		height: 80vh; /* Adjust container height as needed */
		overflow: hidden;
		gap: var(--spacing-md);
	}

	.gallery-card {
		flex: 1;
		height: 100%;
		transition: flex 0.6s ease, transform 0.3s ease;
		overflow: hidden;
		position: relative;
		cursor: pointer;
	}

	.gallery-card:hover .gallery-image {
		transform: scale(1.1); /* Slight zoom on hover */
	}

	.gallery-hover {
		flex: 75%; /* Expand when hovered */
	}

	.gallery-image {
		width: 100%;
		height: 100%;
		object-fit: cover;
		transition: transform 0.3s ease;
	}

	/* Responsive styles for mobile */
	@media (max-width: 767px) {
		.image-gallery {
			flex-direction: row;
			height: auto;
			overflow-x: auto;
			scroll-snap-type: x mandatory;
			-webkit-overflow-scrolling: touch;
			gap: var(--spacing-xs);
		}

		.gallery-card {
			flex: 0 0 80%;
			scroll-snap-align: start;
			margin-right: var(--spacing-xs);
		}
	}
</style>

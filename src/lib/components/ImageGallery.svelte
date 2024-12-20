<script>
	import Modal from '$lib/components/modal/Modal.svelte';
	import '$lib/styles/components/gallery.css';

	/** @type {string[]} */
	export let images = [];

	/** @type {boolean} */
	let modalOpen = false;
	/** @type {number} */
	let currentImageIndex = 0;
	/** @type {number|null} */
	let hoveredImageIndex = null;

	/**
	 * @param {number} index
	 */
	function openModal(index) {
		currentImageIndex = index;
		modalOpen = true;
	}

	function closeModal() {
		modalOpen = false;
	}

	/**
	 * @param {number} index
	 */
	function handleMouseEnter(index) {
		hoveredImageIndex = index;
	}

	function handleMouseLeave() {
		hoveredImageIndex = null;
		resetImageTransforms();
	}

	/**
	 * @param {MouseEvent} event
	 * @param {number} imageIndex
	 */
	function handleMouseMove(event, imageIndex) {
		if (hoveredImageIndex === imageIndex) {
			const image = /** @type {HTMLImageElement} */ (event.target);
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
			const imgElement = /** @type {HTMLElement} */ (img);
			imgElement.style.transform = 'scale(1)';
			imgElement.style.transformOrigin = 'center';
		});
	}
</script>

<!-- Modal for larger view of the images -->
<Modal images={images} bind:open={modalOpen} bind:currentIndex={currentImageIndex} />

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

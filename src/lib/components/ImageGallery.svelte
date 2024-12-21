<script>
	import Modal from '$lib/components/modal/Modal.svelte';
	import { handleImageLoad } from '$lib/utils/mediaUtils';
	import '$lib/styles/components/gallery.css';

	/** @type {string[]} */
	export let images = [];
	/** @type {string} */
	export let fallbackImage = '/placeholder.jpg';

	/** @type {boolean} */
	let modalOpen = false;
	/** @type {number} */
	let currentImageIndex = 0;
	/** @type {number|null} */
	let hoveredImageIndex = null;
	/** @type {string[]} */
	let loadedImages = [];

	// Load and validate all images
	$: {
		Promise.all(images.map(src => handleImageLoad(src, fallbackImage)))
			.then(validatedImages => {
				loadedImages = validatedImages;
			});
	}

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
	{#each loadedImages as image, index}
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

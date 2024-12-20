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
			
			// Calculate distance from center (0 at center, 1 at edges)
			const centerX = rect.left + rect.width / 2;
			const centerY = rect.top + rect.height / 2;
			const distanceX = (event.clientX - centerX) / (rect.width / 2);
			const distanceY = (event.clientY - centerY) / (rect.height / 2);
			
			// Calculate scale based on distance from center (1.2 at center, 1.1 at edges)
			const distance = Math.sqrt(distanceX * distanceX + distanceY * distanceY);
			const scale = 1.2 - (distance * 0.1);
			
			// Calculate transform origin (50% at center, 0% or 100% at edges)
			const x = (event.clientX - rect.left) / rect.width;
			const y = (event.clientY - rect.top) / rect.height;
			
			// Apply transforms
			image.style.transformOrigin = `${x * 100}% ${y * 100}%`;
			image.style.transform = `
				scale(${scale})
				perspective(1000px)
				rotateX(${distanceY * -3}deg)
				rotateY(${distanceX * 3}deg)
			`;
		}
	}

	function resetImageTransforms() {
		const images = document.querySelectorAll('.gallery-image');
		images.forEach((img) => {
			const imgElement = /** @type {HTMLElement} */ (img);
			imgElement.style.transform = 'scale(1) perspective(1000px) rotateX(0deg) rotateY(0deg)';
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

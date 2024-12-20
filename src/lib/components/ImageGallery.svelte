<script lang="ts">
	import Modal from '$lib/components/modal/Modal.svelte';
	import '$lib/styles/components/gallery.css';

	export let images: string[] = [];

	let modalOpen = false;
	let currentImageIndex = 0;
	let hoveredImageIndex: number | null = null;

	function openModal(index: number): void {
		currentImageIndex = index;
		modalOpen = true;
	}

	function closeModal(): void {
		modalOpen = false;
	}

	function handleMouseEnter(index: number): void {
		hoveredImageIndex = index;
	}

	function handleMouseLeave(): void {
		hoveredImageIndex = null;
		resetImageTransforms();
	}

	function handleMouseMove(event: MouseEvent, imageIndex: number): void {
		if (hoveredImageIndex === imageIndex) {
			const image = event.target as HTMLImageElement;
			const rect = image.getBoundingClientRect();
			const x = (event.clientX - rect.left) / rect.width;
			const y = (event.clientY - rect.top) / rect.height;

			image.style.transformOrigin = `${x * 100}% ${y * 100}%`;
			image.style.transform = 'scale(1.5)';
		}
	}

	function resetImageTransforms(): void {
		const images = document.querySelectorAll('.gallery-image');
		images.forEach((img) => {
			(img as HTMLElement).style.transform = 'scale(1)';
			(img as HTMLElement).style.transformOrigin = 'center';
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

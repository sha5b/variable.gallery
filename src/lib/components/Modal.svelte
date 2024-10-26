<script>
    import { onMount } from 'svelte';
    export let open = false;
    export let images = [];
    export let currentIndex = 0;
  
    function closeModal() {
      open = false;
    }
  
    function nextImage() {
      currentIndex = (currentIndex + 1) % images.length;
    }
  
    function prevImage() {
      currentIndex = (currentIndex - 1 + images.length) % images.length;
    }
  
    // Watch for open changes to reset the currentIndex properly
    $: if (open && currentIndex !== undefined) {
      // Ensures the modal opens at the correct image index
    }
  </script>
  
  {#if open}
    <div class="fixed inset-0 flex items-center justify-center bg-black bg-opacity-80 z-50" on:click={closeModal}>
      <div class="relative max-w-4xl w-full h-full flex items-center justify-center" on:click|stopPropagation>
        <!-- Navigation Arrows -->
        <button on:click={prevImage} class="absolute left-4 text-white text-4xl p-2 hover:bg-gray-700 rounded-full transition">
          ❮
        </button>
        <button on:click={nextImage} class="absolute right-4 text-white text-4xl p-2 hover:bg-gray-700 rounded-full transition">
          ❯
        </button>
  
        <!-- Image Display -->
        <img src={images[currentIndex]} alt="Gallery Image" class="object-contain h-[80vh] w-full max-w-6xl" />
      </div>
    </div>
  {/if}
  
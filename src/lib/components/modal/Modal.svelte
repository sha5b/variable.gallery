<script>
  import { onMount } from 'svelte';
  export let open = false;
  export let images = [];
  export let currentIndex = 0;

  let mounted = false;

  function closeModal() {
    open = false;
  }

  function handleBackgroundClick(e) {
    if (e.target === e.currentTarget) {
      closeModal();
    }
  }

  function nextImage(e) {
    e.stopPropagation();
    currentIndex = (currentIndex + 1) % images.length;
  }

  function prevImage(e) {
    e.stopPropagation();
    currentIndex = (currentIndex - 1 + images.length) % images.length;
  }

  function handleKeydown(e) {
    if (!open) return;
    if (e.key === 'Escape') closeModal();
    if (e.key === 'ArrowRight') nextImage(e);
    if (e.key === 'ArrowLeft') prevImage(e);
  }

  onMount(() => {
    mounted = true;
  });

  $: if (mounted) {
    if (open) {
      document.body.style.overflow = 'hidden';
    } else {
      document.body.style.overflow = '';
    }
  }
</script>

{#if open}
  <!-- Background overlay -->
  <div 
    class="fixed inset-0 z-50 bg-black/75 flex items-center justify-center"
    on:click={handleBackgroundClick}
  >
    <!-- Close button -->
    <button 
      class="absolute top-4 right-4 text-white text-4xl hover:text-gray-300 z-50 p-2"
      on:click={closeModal}
    >
      ×
    </button>

    <!-- Modal content -->
    <div 
      class="w-full h-full flex flex-col justify-center items-center p-4"
      on:click|stopPropagation
    >
      <!-- Main image container -->
      <div class="relative w-full h-[calc(100%-100px)] flex items-center justify-center">
        <button 
          class="absolute left-4 text-white text-4xl hover:text-gray-300 z-40 p-4"
          on:click={prevImage}
        >
          ❮
        </button>
        
        <img 
          src={images[currentIndex]} 
          alt="Gallery Image" 
          class="max-h-full max-w-full object-contain"
          on:click|stopPropagation
        />
        
        <button 
          class="absolute right-4 text-white text-4xl hover:text-gray-300 z-40 p-4"
          on:click={nextImage}
        >
          ❯
        </button>
      </div>

      <!-- Thumbnails -->
      <div class="w-full h-20 mt-4 flex justify-center items-center gap-2 overflow-x-auto">
        {#each images as image, i}
          <button
            class="h-16 w-16 flex-shrink-0 border-2 transition-all duration-200 {i === currentIndex ? 'border-white opacity-100' : 'border-transparent opacity-50'}"
            on:click={() => currentIndex = i}
          >
            <img
              src={image}
              alt="Thumbnail"
              class="h-full w-full object-cover"
            />
          </button>
        {/each}
      </div>
    </div>
  </div>
{/if}

<style>
  /* Hide scrollbar for thumbnail navigation */
  div::-webkit-scrollbar {
    display: none;
  }
  
  div {
    -ms-overflow-style: none;
    scrollbar-width: none;
  }
</style>
  
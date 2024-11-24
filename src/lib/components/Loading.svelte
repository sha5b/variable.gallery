<script>
  import { fade } from 'svelte/transition';
  export let isLoading = false;
</script>

{#if isLoading}
  <div 
    class="loading-overlay" 
    transition:fade={{ duration: 200 }}
  >
    <div class="loading-spinner" />
  </div>
{/if}

<style>
  .loading-overlay {
    position: fixed;
    top: 0;
    left: 0;
    right: 0;
    bottom: 0;
    background-color: rgba(0, 0, 0, 0.5);
    backdrop-filter: blur(4px);
    display: flex;
    justify-content: center;
    align-items: center;
    z-index: 9999;
  }

  .loading-spinner {
    width: 48px;
    height: 48px;
    border: 4px solid var(--background-color);
    border-top: 4px solid var(--primary-color);
    border-radius: 50%;
    animation: spin 1s linear infinite;
  }

  @keyframes spin {
    0% { transform: rotate(0deg); }
    100% { transform: rotate(360deg); }
  }
</style> 
<script>
  export let title = '';
  export let content = '';
  let isOpen = false;

  function toggleOpen() {
    isOpen = !isOpen;
  }
</script>

<div class="border-b border-[var(--border-color)] mb-[var(--spacing-lg)]">
  <button 
    on:click={toggleOpen} 
    class="w-full p-[var(--spacing-md)] flex justify-between items-center text-left font-[var(--font-weight-semibold)]"
    style="transition: all var(--transition-base) var(--transition-timing);"
  >
    <span class="text-[var(--font-size-base)]">{title}</span>
    <span class="text-[var(--font-size-lg)]">{isOpen ? '−' : '+'}</span>
  </button>
  {#if isOpen}
    <div class="p-[var(--spacing-md)] space-y-[var(--spacing-md)]" style="transition: all var(--transition-base) var(--transition-timing);">
      {@html content}
    </div>
  {/if}
</div>

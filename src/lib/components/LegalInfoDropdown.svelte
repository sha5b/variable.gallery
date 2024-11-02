<script>
  export let title = '';
  export let content = '';
  let isOpen = false;

  function toggleOpen() {
    isOpen = !isOpen;
  }
</script>

<div class="border mb-4">
  <button on:click={toggleOpen} class="w-full p-4 flex justify-between items-center text-left text-[var(--primary-color)] font-semibold hover:bg-[var(--background-color)] transition">
    {title}
    <span>{isOpen ? '−' : '+'}</span>
  </button>
  {#if isOpen}
    <div class="p-4 text-[var(--text-color)]">
      {@html content}
    </div>
  {/if}
</div>

<style>
  button {
      background: none;
      border: none;
      cursor: pointer;
      outline: none;
  }
</style>

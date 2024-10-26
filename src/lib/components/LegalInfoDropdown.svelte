<script>
    export let title = '';
    export let content = '';
    let isOpen = false;
  
    function toggleOpen() {
      isOpen = !isOpen;
    }
  </script>
  
  <div class="border rounded-lg shadow-md mb-4 ">
    <button on:click={toggleOpen} class="w-full p-4 flex justify-between items-center text-left text-purple-500 font-semibold hover:bg-purple-100 transition">
      {title}
      <span>{isOpen ? '−' : '+'}</span>
    </button>
    {#if isOpen}
      <div class="p-4 text-gray-700">
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
  
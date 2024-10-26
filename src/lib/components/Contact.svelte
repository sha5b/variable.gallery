<script>
  import ContactModal from '$lib/components/ContactModal.svelte';

  let isModalOpen = false;

  function handleButtonClick() {
    isModalOpen = true; // Open the modal when the button is clicked
  }

  function closeModal() {
    isModalOpen = false; // Close the modal
  }
</script>
  
<div class="w-full my-8 p-6 rounded-lg text-left flex flex-col h-full justify-end items-start">
  <button class="bg-[var(--primary-color)] text-[var(--background-color)] px-6 py-2 rounded-md text-xl transition-colors hover:bg-[var(--secondary-color)]" on:click={handleButtonClick}>
    Contact Us
  </button>
  <p class="text-[var(--text-color)] text-lg mt-4 text-left">
    If you have any questions or inquiries, feel free to reach out to us!
  </p>
</div>

<!-- Bind open state and pass close callback -->
<ContactModal bind:open={isModalOpen} on:close={closeModal} />

<style></style>

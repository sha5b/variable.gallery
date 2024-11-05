<script>
	import ContactModal from '$lib/components/modal/ContactModal.svelte';

	let isModalOpen = false;

	function handleButtonClick() {
		isModalOpen = true; // Open the modal when the button is clicked
	}

	function closeModal() {
		isModalOpen = false; // Close the modal
	}
</script>

<div class="w-full my-8 text-left flex flex-col h-full justify-end items-start">
	<button class="button-primary text-xl px-6 py-2" on:click={handleButtonClick}>
		Contact Us
	</button>
	<p class="text-lg mt-4 text-left text-primary">
		If you have any questions or inquiries, feel free to reach out to us!
	</p>
</div>

<!-- Bind open state and pass close callback -->
<ContactModal bind:open={isModalOpen} on:close={closeModal} />

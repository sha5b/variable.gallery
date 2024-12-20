<script>
	import ContactModal from '$lib/components/modal/ContactModal.svelte';
	import '$lib/styles/components/contact.css';

	let isModalOpen = false;

	function handleButtonClick() {
		isModalOpen = true; // Open the modal when the button is clicked
	}

	function closeModal() {
		isModalOpen = false; // Close the modal
	}
</script>

<div class="contact-container">
	<button class="button-primary contact-button" on:click={handleButtonClick}>
		Contact Us
	</button>
	<p class="contact-text">
		If you have any questions or inquiries, feel free to reach out to us!
	</p>
</div>

<!-- Bind open state and pass close callback -->
<ContactModal bind:open={isModalOpen} on:close={closeModal} />

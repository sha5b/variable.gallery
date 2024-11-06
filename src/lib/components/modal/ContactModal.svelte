<script>
	export let open = false; // Controls the visibility of the modal
	export let onClose = () => {}; // Callback function to close the modal

	// Function to close the modal and trigger the callback
	function closeModal() {
		open = false; // Close the modal internally
		onClose(); // Trigger the close callback
	}

	// Function to handle form submission
	function submitForm(event) {
		event.preventDefault();
		alert('Form submitted!');
		closeModal(); // Close modal after submission
	}
</script>

{#if open}
	<!-- Modal Background Overlay -->
	<div
		class="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-80"
		on:click={closeModal}
	>
		<!-- Modal Content (prevents clicks within from closing the modal) -->
		<div
			class="modal-content p-lg relative flex flex-col shadow-lg lg:max-w-4xl lg:flex-row"
			on:click|stopPropagation
		>
			<!-- Close Button -->
			<button
				class="text-primary hover:text-secondary absolute right-4 top-4 text-2xl"
				on:click={closeModal}>✕</button
			>

			<!-- Information Section -->
			<div class="text-primary mb-6 flex-1 lg:mb-0">
				<h2 class="mb-4 text-3xl font-bold">Connect with variable.gallerie</h2>
				<p class="mb-4">
					We appreciate your interest in our digital gallery. Whether you're an artist looking to
					collaborate, an enthusiast curious about our exhibitions, or have any inquiries about our
					original artworks, editions, or digital goods, we'd love to hear from you.
				</p>
				<p class="mb-4">
					Our mission is to explore and distribute new concepts of exhibiting in the digital world,
					connecting artists and audiences globally. Feel free to reach out with your questions,
					ideas, or feedback.
				</p>
			</div>
			<!-- Contact Form Section -->
			<div class="flex-1">
				<form on:submit={submitForm} class="space-y-4">
					<div>
						<label class="text-primary mb-1 block text-sm font-semibold">Name</label>
						<input type="text" placeholder="Your Name" class="input-field" required />
					</div>

					<div>
						<label class="text-primary mb-1 block text-sm font-semibold">Email</label>
						<input type="email" placeholder="Your Email" class="input-field" required />
					</div>

					<div>
						<label class="text-primary mb-1 block text-sm font-semibold">Message</label>
						<textarea placeholder="Your Message" class="input-field" rows="4" required></textarea>
					</div>

					<button type="submit" class="button-primary w-full">Send Message</button>
				</form>
			</div>
		</div>
	</div>
{/if}

<style>
	.modal-content {
		background-color: var(--background-color);
		max-width: 80%;
		color: var(--text-color);
		padding: var(--spacing-lg);
	}

	.input-field {
		width: 100%;
		padding: var(--spacing-xs) var(--spacing-sm);
		border: 1px solid var(--border-color);
		background-color: var(--input-background);
		color: var(--text-color);
		border-radius: var(--rounded-md);
		outline: none;
	}

	.input-field:focus {
		border-color: var(--primary-color);
		box-shadow: 0 0 0 2px var(--primary-color);
	}
</style>

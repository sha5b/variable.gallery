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
		alert("Form submitted!");
		closeModal(); // Close modal after submission
	}
</script>
  
{#if open}
	<!-- Modal Background Overlay -->
	<div class="fixed inset-0 bg-black bg-opacity-80 flex items-center justify-center z-50" on:click={closeModal}>
		
		<!-- Modal Content (prevents clicks within from closing the modal) -->
		<div class="modal-content lg:max-w-4xl p-lg shadow-lg relative flex flex-col lg:flex-row" on:click|stopPropagation>
			<!-- Close Button -->
			<button class="absolute top-4 right-4 text-primary text-2xl hover:text-secondary" on:click={closeModal}>✕</button>

			<!-- Information Section -->
			<div class="flex-1 mb-6 lg:mb-0 text-primary">
				<h2 class="text-3xl font-bold mb-4">Buying Original Artworks</h2>
				<p class="mb-4">
					Discover a curated selection of original artworks by talented artists, crafted with care to bring a unique vision to life.
				</p>
				<p class="mb-4">
					We offer secure worldwide shipping, authentic certification, and a flexible return policy to ensure your satisfaction. Feel free to reach out with any questions!
				</p>
			</div>

			<!-- Contact Form Section -->
			<div class="flex-1">
				<form on:submit={submitForm} class="space-y-4">
					<div>
						<label class="block text-primary text-sm font-semibold mb-1">Name</label>
						<input type="text" placeholder="Your Name" class="input-field" required />
					</div>
					
					<div>
						<label class="block text-primary text-sm font-semibold mb-1">Email</label>
						<input type="email" placeholder="Your Email" class="input-field" required />
					</div>
					
					<div>
						<label class="block text-primary text-sm font-semibold mb-1">Message</label>
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

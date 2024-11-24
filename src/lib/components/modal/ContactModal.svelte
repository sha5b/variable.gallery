<script>
	export let open = false;
	export let onClose = () => {};

	function closeModal() {
		open = false;
		onClose();
	}

	function submitForm(event) {
		event.preventDefault();
		alert('Message transmitted through quantum channels. We\'ll respond within one lunar cycle.');
		closeModal();
	}
</script>

{#if open}
	<div
		class="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-80"
		on:click={closeModal}
	>
		<div
			class="modal-content p-lg relative flex flex-col shadow-lg lg:max-w-4xl lg:flex-row"
			on:click|stopPropagation
		>
			<button
				class="text-primary hover:text-secondary absolute right-4 top-4 text-2xl"
				on:click={closeModal}>✕</button
			>

			<!-- Information Section -->
			<div class="text-primary mb-6 flex-1 lg:mb-0">
				<h2 class="mb-4 text-3xl font-bold">Connect from Earth to Lunar Orbit</h2>
				<p class="mb-4">
					Transmit your message through our quantum-encrypted channels. Whether you're an artist exploring
					space-time exhibitions, a collector interested in our orbital collections, or curious about our
					lunar-based digital initiatives, we're here to bridge the Earth-Moon gap.
				</p>
				<p class="mb-4">
					Operating from Lunar Orbit Station V.G-23, we're pioneering new forms of art distribution and
					exhibition. Your message will be received by our quantum arrays and processed within one lunar
					cycle (27.3 Earth days).
				</p>
			</div>

			<!-- Contact Form Section -->
			<div class="flex-1">
				<form on:submit={submitForm} class="space-y-4">
					<div>
						<label class="text-primary mb-1 block text-sm font-semibold">Earth Identity</label>
						<input type="text" placeholder="Your Name" class="input-field" required />
					</div>

					<div>
						<label class="text-primary mb-1 block text-sm font-semibold">Quantum Communication Channel</label>
						<input type="email" placeholder="Your Email" class="input-field" required />
					</div>

					<div>
						<label class="text-primary mb-1 block text-sm font-semibold">Transmission Content</label>
						<textarea
							placeholder="Your message will be quantum-encrypted and transmitted to our lunar facility"
							class="input-field"
							rows="4"
							required
						></textarea>
					</div>

					<button type="submit" class="button-primary w-full">Initiate Quantum Transmission</button>
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

<script>
	import { addItem } from '$lib/stores/cartStore';
	import { toggleCartSlider } from '$lib/stores/cartSliderStore';
	export let products;
	export let artists;

	let latestProduct =
		products.length > 0
			? products.reduce(
					(latest, product) =>
						new Date(product.date_modified) > new Date(latest.date_modified) ? product : latest,
					products[0]
				)
			: null;

	let variation = latestProduct?.variations[0];
	let currentImageIndex = 0;

	function nextImage() {
		currentImageIndex = (currentImageIndex + 1) % latestProduct.images.length;
	}

	function prevImage() {
		currentImageIndex = (currentImageIndex - 1 + latestProduct.images.length) % latestProduct.images.length;
	}

	// Find the corresponding artist for the current product
	let artistInfo = null;
	if (latestProduct) {
		const artistName = latestProduct.attributes.find(attr => attr.name.toLowerCase() === 'artist')?.options[0];
		artistInfo = artists.find(artist => artist.title.rendered.toLowerCase() === artistName?.toLowerCase());
	}
</script>

{#if latestProduct}
	<div class="product-container gap-md my-8 flex w-full flex-col items-stretch pt-8 md:flex-row">
		<!-- Image Slider Section -->
		<div class="image-section aspect-h-3 aspect-w-4 w-full md:aspect-h-6 md:aspect-w-16 md:w-7/10 relative">
			<img
				src={latestProduct.images[currentImageIndex]?.src || '/path/to/default.jpg'}
				alt={latestProduct.name}
				class="h-full w-full object-cover"
			/>
			<!-- Navigation buttons -->
			<button on:click={prevImage} class="slider-button slider-button-left">‹</button>
			<button on:click={nextImage} class="slider-button slider-button-right">›</button>
		</div>

		<!-- Details Container -->
		<div class="details-container flex md:w-3/10">
			<!-- Product Details Section -->
			<div class="product-details space-y-md bg-background flex-1 p-lg">
				<h2 class="text-xlarge text-primary font-bold">{variation ? variation.name : latestProduct.name}</h2>
				<p class="text-primary text-base">
					{@html latestProduct.description || latestProduct.short_description}
				</p>
				<p class="text-small text-primary">
					<strong>Editions:</strong> {variation ? variation.stock_quantity || 'N/A' : latestProduct.stock_quantity || 'N/A'}
				</p>
				<p class="text-small text-primary">
					<strong>Stock Status:</strong> {variation ? (variation.stock_status === 'instock' ? 'In Stock' : 'Out of Stock') : (latestProduct.stock_status === 'instock' ? 'In Stock' : 'Out of Stock')}
				</p>
				<p class="price text-large text-primary font-semibold">
					{#if latestProduct.sale_price && latestProduct.sale_price !== ''}
						<span class="sale-price text-secondary line-through">€{latestProduct.regular_price}</span> €{latestProduct.sale_price}
					{:else if variation?.regular_price}
						€{variation.regular_price}
					{:else if latestProduct.regular_price}
						€{latestProduct.regular_price}
					{:else}
						Price not available
					{/if}
				</p>
				<a href={'/shop'} class="button-primary mt-4 px-4 py-2">Shop Now</a>
			</div>

			<!-- Artist Details Section -->
			{#if artistInfo}
				<div class="artist-details space-y-md bg-background flex-1 p-lg">
					<h3 class="text-large text-primary font-bold">About the Artist</h3>
					<p class="text-primary text-base"><strong>Artist Name:</strong> {artistInfo.title.rendered}</p>
					<p class="text-primary text-base"><strong>Bio:</strong> {artistInfo.acf.description || 'No description available.'}</p>
					<p class="text-primary text-base"><strong>Location:</strong> {artistInfo.acf.location || 'Unknown'}</p>
					<a href={artistInfo.link} target="_blank" class="artist-link text-accent">View Profile</a>
				</div>
			{:else}
				<p class="text-primary text-base">Artist details are not available.</p>
			{/if}
		</div>
	</div>
{/if}

<style>
	.product-container {
		display: flex;
		flex-direction: column;
		gap: var(--spacing-md);
		width: 100%;
	}

	.image-section {
		width: 100%;
		position: relative;
	}

	.slider-button {
		position: absolute;
		top: 50%;
		transform: translateY(-50%);
		background: rgba(0, 0, 0, 0.5);
		color: white;
		border: none;
		font-size: 2rem;
		padding: 0.5rem;
		cursor: pointer;
		border-radius: 50%;
		width: 2.5rem;
		height: 2.5rem;
		display: flex;
		align-items: center;
		justify-content: center;
		transition: background 0.3s ease;
	}

	.slider-button-left {
		left: 1rem;
	}

	.slider-button-right {
		right: 1rem;
	}

	.details-container {
		display: flex;
		flex-direction: column;
		width: 100%;
		gap: var(--spacing-md);
	}

	.product-details,
	.artist-details {
		display: flex;
		flex-direction: column;
		gap: var(--spacing-md);
		width: 100%;
	}

	.text-primary {
		color: var(--primary-color);
	}

	.price {
		font-size: var(--text-large);
		font-weight: 600;
		color: var(--primary-color);
	}

	.sale-price {
		color: var(--secondary-color);
		text-decoration: line-through;
		margin-right: 0.5em;
	}

	.button-primary {
		background-color: var(--primary-color);
		color: var(--background-color);
		border-radius: var(--rounded-md);
		transition: background-color 0.3s;
		text-align: center;
		font-weight: 600;
	}

	.artist-link {
		text-decoration: underline;
	}

	.button-primary:hover {
		background-color: var(--secondary-color);
	}

	/* Responsive adjustments */
	@media (min-width: 768px) {
		.product-container {
			flex-direction: row;
		}

		.image-section {
			width: 65%;
		}

		.details-container {
			width: 35%;
			flex-direction: row;
		}

		.product-details,
		.artist-details {
			width: 50%;
		}
	}
</style>

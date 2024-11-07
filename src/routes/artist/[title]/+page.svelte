<script>
	import { page } from '$app/stores';
	import ArtistSlider from '$lib/components/slider/ArtistSlider.svelte';

	export let data;
	let { products, artists } = data;

	let filteredArtist = null;
	let artistProducts = [];
	let artistLink = ''; // Initialize artistLink

	function normalizeTitle(title) {
		return title.toLowerCase().replace(/-/g, ' ').trim();
	}

	$: {
		const artistTitle = normalizeTitle($page.params.title || '');
		filteredArtist = artists.find(
			(artist) => normalizeTitle(artist.title.rendered) === artistTitle
		);

		if (filteredArtist) {
			artistProducts = products.filter((product) =>
				product.attributes.some(
					(attr) =>
						attr.name.toLowerCase() === 'artist' &&
						attr.options.includes(filteredArtist.title.rendered)
				)
			);
			// Assign artistLink from acf.url or link
			artistLink = filteredArtist.acf?.url || filteredArtist.link || '';
			console.log('Artist Link Assigned:', artistLink);
		} else {
			artistProducts = [];
			artistLink = ''; // Ensure artistLink is set even if no artist
			console.log('No artist found. artistLink set to empty string.');
		}
	}
</script>

<div class="artist-container px-page">
	{#if filteredArtist}
		<div class="artist-info flex flex-col items-start gap-8 bg-white md:flex-row">
			{#if filteredArtist.acf?.image}
				<div class="artist-thumbnail w-full md:w-1/3">
					<img
						src={`/wp-content/uploads/${filteredArtist.acf.image}`}
						alt={filteredArtist.title.rendered}
						class="h-auto w-full object-cover"
					/>
				</div>
			{/if}

			<div class="artist-details space-y-4 md:w-2/3">
				<h1 class="text-primary text-2xl font-bold md:text-3xl">{filteredArtist.title.rendered}</h1>
				<p class="text-secondary text-base md:text-lg">
					<strong>Bio:</strong>
					{filteredArtist.acf?.description || 'No description available.'}
				</p>
				<p class="text-secondary text-base md:text-lg">
					<strong>Location:</strong>
					{filteredArtist.acf?.location || 'Unknown location'}
				</p>
			</div>
		</div>
	{:else}
		<p class="text-secondary text-center">Artist information not found.</p>
	{/if}

	{#if artistProducts && artistProducts.length > 0}
		<section class="artist-products pb-10">
			<!-- Integrate ArtistProducts here -->
			<ArtistSlider products={artistProducts} artistName={filteredArtist.title.rendered} />
		</section>
	{:else if filteredArtist}
		<p class="text-secondary mt-8 text-center">
			No products available from {filteredArtist.title.rendered} at this time.
		</p>
	{/if}
</div>

<style>
	.artist-container {
		position: relative; /* Ensures absolute children are positioned relative to this container */
		width: 100%;
		height: 100%; /* Adjust as needed */
		perspective: 1000px; /* Creates a 3D space for children */
		transform-style: preserve-3d; /* Allows children to maintain their 3D position */
		overflow: hidden; /* Hides overflow to contain particles within the container */
	}

	.artist-info {
		background-color: var(--background-color);
		border-radius: var(--rounded-md);
		display: flex;
		gap: var(--spacing-lg);
	}

	.artist-thumbnail img {
		border-radius: var(--rounded-md);
	}

	.artist-details {
		display: flex;
		flex-direction: column;
		gap: var(--spacing-md);
	}

	.artist-products {
		margin-top: var(--spacing-lg);
		height: 50%;
		width: 100%;
	}
</style>

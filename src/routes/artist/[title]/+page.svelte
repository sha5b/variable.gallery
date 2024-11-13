<script>
	import { page } from '$app/stores';
	import ArtistSlider from '$lib/components/slider/ArtistSlider.svelte';

	export let data;
	let { products, artists, exhibitions } = data;

	let filteredArtist = null;
	let artistProducts = [];
	let artistExhibitions = [];

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

			artistExhibitions = exhibitions.filter((exhibition) =>
				exhibition.acf?.artist?.includes(filteredArtist.id)
			);
		}
	}
</script>

<div class="artist-container px-page py-lg">
	{#if filteredArtist}
		<!-- Main Grid Layout -->
		<div class="grid grid-cols-1 lg:grid-cols-3 gap-8">
			<!-- Left Column: Artist Info -->
			<div class="lg:col-span-1">
				<div class="artist-info space-y-8 sticky top-20">
					{#if filteredArtist.acf?.image}
						<div class="artist-thumbnail w-full">
							<img
								src={`/wp-content/uploads/${filteredArtist.acf.image}`}
								alt={filteredArtist.title.rendered}
								class="w-full h-auto object-cover rounded-lg shadow-md"
							/>
						</div>
					{/if}

					<div class="artist-details space-y-6">
						<div class="text-secondary">
							<h2 class="text-xl font-semibold mb-2">Bio</h2>
							<p class="text-base leading-relaxed">
								{filteredArtist.acf?.description || 'No description available.'}
							</p>
						</div>
						
						<div class="text-secondary">
							<h2 class="text-xl font-semibold mb-2">Location</h2>
							<p class="text-base">
								{filteredArtist.acf?.location || 'Unknown location'}
							</p>
						</div>

						<!-- Quick Stats -->
						<div class="quick-stats">
							<h2 class="text-xl font-semibold mb-2">Artist Stats</h2>
							<ul class="list-disc list-inside">
								<li>Exhibitions: {artistExhibitions.length}</li>
								<li>Years Active: {filteredArtist.acf?.yearsActive || 'Unknown'}</li>
								<li>Specialties: {filteredArtist.acf?.specialties || 'Various'}</li>
							</ul>
						</div>

						<!-- Social Media Links -->
						{#if filteredArtist.acf?.socialMedia}
							<div class="social-media">
								<h2 class="text-xl font-semibold mb-2">Connect</h2>
								<div class="flex space-x-4">
									{#each filteredArtist.acf.socialMedia as social}
										<a href={social.url} target="_blank" rel="noopener noreferrer" class="text-primary hover:text-secondary">
											<!-- Add appropriate icon based on social media type -->
											{social.platform}
										</a>
									{/each}
								</div>
							</div>
						{/if}

						<!-- Featured Artwork -->
						{#if filteredArtist.acf?.featuredArtwork}
							<div class="featured-artwork">
								<h2 class="text-xl font-semibold mb-2">Featured Work</h2>
								<img 
									src={filteredArtist.acf.featuredArtwork.url} 
									alt={filteredArtist.acf.featuredArtwork.title}
									class="w-full h-auto object-cover rounded-lg shadow-md"
								/>
								<p class="text-sm mt-2 text-secondary">{filteredArtist.acf.featuredArtwork.title}</p>
							</div>
						{/if}
					</div>
				</div>
			</div>

			<!-- Right Column: Exhibitions -->
			<div class="lg:col-span-2">
				<div class="space-y-6">
					<h2 class="text-xl font-bold text-primary">Exhibitions</h2>
					
					{#if artistExhibitions?.length > 0}
						<div class="grid grid-cols-1 md:grid-cols-2 gap-4">
							{#each artistExhibitions as exhibition}
								<div class="exhibition-card">
									<h3 class="text-lg font-semibold mb-2">
										{exhibition.title.rendered}
									</h3>
									<div class="text-sm space-y-1 text-secondary">
										<p>
											<span class="font-medium">Date:</span> 
											{new Date(exhibition.date).toLocaleDateString()}
										</p>
										<p>
											<span class="font-medium">Location:</span> 
											{exhibition.acf?.location || 'Unknown location'}
										</p>
									</div>
									{#if exhibition.acf?.virtual}
										<span class="virtual-badge">
											Virtual Exhibition
										</span>
									{/if}
								</div>
							{/each}
						</div>
					{:else}
						<p class="text-secondary">No exhibitions found for this artist.</p>
					{/if}
				</div>
			</div>
		</div>

		<!-- Artist Products Section -->
		{#if artistProducts?.length > 0}
			<section class="artist-products mt-12">
				<h2 class="text-xl font-bold text-primary mb-6">Artist's Works</h2>
				<ArtistSlider products={artistProducts} artistName={filteredArtist.title.rendered} />
			</section>
		{/if}
	{:else}
		<p class="text-secondary text-center">Artist information not found.</p>
	{/if}
</div>

<style>
	.exhibition-card {
		@apply bg-white p-4 rounded-lg border border-gray-200;
		transition: transform 0.2s ease;
	}

	.exhibition-card:hover {
		transform: translateY(-2px);
	}

	.virtual-badge {
		@apply inline-block mt-3 px-2 py-1 text-xs font-medium rounded-full;
		background-color: var(--primary-color);
		color: var(--background-color);
	}

	/* Make the artist info sticky on desktop */
	@media (min-width: 1024px) {
		.artist-info {
			position: sticky;
			top: 2rem;
		}
	}
</style>

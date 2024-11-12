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

	function decodeHtmlEntities(text) {
		const textarea = document.createElement('textarea');
		textarea.innerHTML = text;
		return textarea.value;
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
							<ul class="space-y-2">
								<li>
									<span class="font-medium">Total Exhibitions:</span> {artistExhibitions.length}
									<ul class="ml-4 mt-1 text-sm">
										<li>Virtual: {artistExhibitions.filter(e => e.acf?.virtual).length}</li>
										<li>Physical: {artistExhibitions.filter(e => !e.acf?.virtual).length}</li>
									</ul>
								</li>
								<li>
									<span class="font-medium">Exhibition Locations:</span>
									<ul class="ml-4 mt-1 text-sm">
										{#each [...new Set(artistExhibitions.map(e => e.acf?.location))] as location}
											<li>{location}</li>
										{/each}
									</ul>
								</li>
							</ul>
						</div>

						<!-- Categories -->
						{#if artistProducts.length > 0}
							<div class="categories">
								<h2 class="text-xl font-semibold mb-2">Art Categories</h2>
								<div class="flex flex-wrap gap-2">
									{#each [...new Set(artistProducts.flatMap(p => p.categories.map(c => c.name)))] as category}
										<span class="px-3 py-1 bg-background rounded-full text-sm">
											{category}
										</span>
									{/each}
								</div>
							</div>
						{/if}

						<!-- Tags/Themes -->
						{#if artistProducts.length > 0}
							<div class="tags">
								<h2 class="text-xl font-semibold mb-2">Themes & Tags</h2>
								<div class="flex flex-wrap gap-2">
									{#each [...new Set(artistProducts.flatMap(p => p.tags.map(t => t.name)))] as tag}
										<span class="px-3 py-1 bg-background rounded-full text-sm">
											#{tag}
										</span>
									{/each}
								</div>
							</div>
						{/if}

						<!-- Latest Work (single) -->
						{#if artistProducts.length > 0}
							<div class="latest-work">
								<h2 class="text-xl font-semibold mb-2">Latest Work</h2>
								<a href={`/shop/${artistProducts[0].id}`} class="block group">
									<div class="relative">
										<img 
											src={artistProducts[0].images[0]?.src} 
											alt={artistProducts[0].name}
											class="w-full h-auto object-cover rounded-lg shadow-md transition-transform group-hover:scale-[1.02]"
										/>
										<div class="absolute bottom-3 left-3 flex flex-wrap gap-2">
											{#each artistProducts[0].tags as tag}
												<span class="px-3 py-1 bg-white/90 backdrop-blur-sm rounded-full text-xs font-medium shadow-sm">
													#{tag.name}
												</span>
											{/each}
										</div>
									</div>
									<div class="mt-3 flex justify-between items-center">
										<p class="text-sm text-secondary">{artistProducts[0].name}</p>
										<p class="text-sm font-medium">
											{new Intl.NumberFormat('de-DE', { 
												style: 'currency', 
												currency: 'EUR' 
											}).format(artistProducts[0].price)}
										</p>
									</div>
								</a>
							</div>
						{/if}

						<!-- Collaborations -->
						{#if filteredArtist.acf?.collaborations}
							<div class="collaborations">
								<h2 class="text-xl font-semibold mb-2">Collaborations</h2>
								<ul class="space-y-1">
									{#each filteredArtist.acf.collaborations as collab}
										<li class="text-sm">{collab}</li>
									{/each}
								</ul>
							</div>
						{/if}

						<!-- Contact/Links -->
						{#if filteredArtist.acf?.contact}
							<div class="contact">
								<h2 class="text-xl font-semibold mb-2">Contact & Links</h2>
								<div class="space-y-2">
									{#if filteredArtist.acf.contact.website}
										<a href={filteredArtist.acf.contact.website} target="_blank" rel="noopener noreferrer" 
										   class="block text-sm text-primary hover:underline">
											Personal Website
										</a>
									{/if}
									{#if filteredArtist.acf.contact.email}
										<a href={`mailto:${filteredArtist.acf.contact.email}`} 
										   class="block text-sm text-primary hover:underline">
											Contact Artist
										</a>
									{/if}
								</div>
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
										{decodeHtmlEntities(exhibition.title.rendered)}
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

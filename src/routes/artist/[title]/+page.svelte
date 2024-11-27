<script>
	import { page } from '$app/stores';
	import { slide } from 'svelte/transition';
	import ArtistSlider from '$lib/components/slider/ArtistSlider.svelte';
	import { goto } from '$app/navigation';
	import { defaultSEO, generateMetaTags } from '$lib/utils/seo';

	export let data;
	let { products, artists, exhibitions } = data;
	let bioOpen = false;
	console.log(exhibitions);

	let filteredArtist = null;
	let artistProducts = [];
	let artistExhibitions = [];

	let currentPage = 1;
	const exhibitionsPerPage = 6;

	$: {
		const artistTitle = $page.params.title.toLowerCase().replace(/-/g, ' ').trim();
		filteredArtist = artists.find(
			(artist) => artist.title.rendered.toLowerCase() === artistTitle
		);

		if (filteredArtist) {
			artistProducts = products.filter((product) =>
				product.attributes.some(
					(attr) =>
						attr.name.toLowerCase() === 'artist' &&
						attr.options.includes(filteredArtist.title.rendered)
				)
			);

			artistExhibitions = exhibitions
				.filter((exhibition) => exhibition.acf?.artist?.includes(filteredArtist.id))
				.sort((a, b) => {
					const dateA = new Date(a.acf?.date?.replace(/(\d{4})(\d{2})(\d{2})/, '$1-$2-$3'));
					const dateB = new Date(b.acf?.date?.replace(/(\d{4})(\d{2})(\d{2})/, '$1-$2-$3'));
					return dateB - dateA;
				});
		}
	}

	function formatDate(dateString) {
		if (!dateString) return 'No date';
		const date = new Date(dateString.replace(/(\d{4})(\d{2})(\d{2})/, '$1-$2-$3'));
		return date.toLocaleDateString('en-US', {
			year: 'numeric',
			month: 'long',
			day: 'numeric'
		});
	}

	$: totalPages = Math.ceil(artistExhibitions.length / exhibitionsPerPage);
	$: paginatedExhibitions = artistExhibitions.slice(
		(currentPage - 1) * exhibitionsPerPage,
		currentPage * exhibitionsPerPage
	);

	function changePage(page) {
		if (page >= 1 && page <= totalPages) {
			currentPage = page;
		}
	}

	function handleExhibitionClick(exhibition) {
		if (exhibition.acf?.link?.url) {
			window.open(exhibition.acf.link.url, '_blank');
		}
	}

	// Create artist-specific SEO
	$: pageSEO = filteredArtist ? {
		...defaultSEO,
		title: `${filteredArtist.title.rendered} | variable.gallery`,
		description: filteredArtist.acf?.description || `Explore the digital artworks and exhibitions of ${filteredArtist.title.rendered} at variable.gallery.`,
		keywords: [
			...defaultSEO.keywords,
			filteredArtist.title.rendered,
			'digital artist',
			'NFT artist',
			'virtual exhibitions',
			filteredArtist.acf?.specialties || '',
			filteredArtist.acf?.location || ''
		].filter(Boolean),
		openGraph: {
			...defaultSEO.openGraph,
			title: `${filteredArtist.title.rendered} | variable.gallery`,
			description: filteredArtist.acf?.description || `Explore the digital artworks and exhibitions of ${filteredArtist.title.rendered} at variable.gallery.`,
			url: `https://variable.gallery/artist/${$page.params.title}`,
			image: filteredArtist.acf?.profileImage || defaultSEO.openGraph.image
		}
	} : defaultSEO;

	$: metaTags = generateMetaTags(pageSEO);
</script>

<svelte:head>
	<title>{pageSEO.title}</title>
	{#each metaTags as tag}
		{#if tag.name}
			<meta name={tag.name} content={tag.content}>
		{:else if tag.property}
			<meta property={tag.property} content={tag.content}>
		{/if}
	{/each}
</svelte:head>

<div class="artist-page-container">
	{#if filteredArtist}
		<div class="product-layout">
			<!-- Left Column: Artist Details Section -->
			<div class="product-details md:w-1/3">
				<h1 class="text-xlarge text-primary font-bold mb-8">{filteredArtist.title.rendered}</h1>

				<!-- Artist Info -->
				<div class="technical-details space-y-4">
					<div class="detail-row clean">
						<span class="detail-label">Location</span>
						<span class="detail-value">{filteredArtist.acf?.location || 'Unknown location'}</span>
					</div>

					<div class="detail-row clean">
						<span class="detail-label">Years Active</span>
						<span class="detail-value">{filteredArtist.acf?.yearsActive || 'Unknown'}</span>
					</div>

					<div class="detail-row clean">
						<span class="detail-label">Specialties</span>
						<span class="detail-value">{filteredArtist.acf?.specialties || 'Various'}</span>
					</div>

					<div class="detail-row clean">
						<span class="detail-label">Exhibitions</span>
						<span class="detail-value">{artistExhibitions.length}</span>
					</div>

					<div class="detail-row clean cursor-pointer" on:click={() => (bioOpen = !bioOpen)}>
						<span class="detail-label">Bio</span>
						<span class="detail-value">View {bioOpen ? '−' : '+'}</span>
					</div>

					{#if bioOpen}
						<div class="bio-drawer" transition:slide={{ duration: 300 }}>
							<p class="text-primary text-base">
								{filteredArtist.acf?.description || 'No description available.'}
							</p>
						</div>
					{/if}
				</div>

				<!-- Social Media Links -->
				{#if filteredArtist.acf?.socialMedia}
					<div class="social-media mt-8">
						<h3 class="text-lg font-semibold mb-4">Connect</h3>
						<div class="tags-row">
							{#each filteredArtist.acf.socialMedia as social}
								<a href={social.url} target="_blank" rel="noopener noreferrer" class="pill pill-secondary pill-sm">
									{social.platform}
								</a>
							{/each}
						</div>
					</div>
				{/if}
			</div>

			<!-- Right Column: Exhibitions Section -->
			<div class="md:w-2/3">
				{#if artistExhibitions?.length > 0}
					<div class="exhibitions-section">
						<h2 class="text-xlarge text-primary font-bold mb-8">Exhibitions</h2>
						<div class="grid grid-cols-1 sm:grid-cols-2 gap-4">
							{#each paginatedExhibitions as exhibition}
								<div 
									class="exhibition-card {exhibition.acf?.link?.url ? 'cursor-pointer' : ''}" 
									on:click={() => handleExhibitionClick(exhibition)}
								>
									<div class="detail-row clean">
										<span class="detail-label">Exhibition</span>
										<span class="detail-value font-bold">{exhibition.title.rendered}</span>
									</div>
									<div class="detail-row clean">
										<span class="detail-label">Date</span>
										<span class="detail-value text-sm">{formatDate(exhibition.acf?.date)}</span>
									</div>
									<div class="detail-row clean">
										<span class="detail-label">Location</span>
										<span class="detail-value text-sm">{exhibition.acf?.location || 'Unknown location'}</span>
									</div>
									{#if exhibition.acf?.virtual}
										<div class="mt-6">
											<span class="pill pill-primary pill-sm">Virtual Exhibition</span>
										</div>
									{/if}
								</div>
							{/each}
						</div>

						{#if totalPages > 1}
							<div class="pagination">
								<button 
									class="pagination-button" 
									disabled={currentPage === 1}
									on:click={() => changePage(currentPage - 1)}
								>
									Previous
								</button>
								
								{#each Array(totalPages) as _, i}
									<button 
										class="pagination-button {currentPage === i + 1 ? 'active' : ''}"
										on:click={() => changePage(i + 1)}
									>
										{i + 1}
									</button>
								{/each}
								
								<button 
									class="pagination-button"
									disabled={currentPage === totalPages}
									on:click={() => changePage(currentPage + 1)}
								>
									Next
								</button>
							</div>
						{/if}
					</div>
				{/if}
			</div>
		</div>

		<!-- Artist's Works Section -->
		{#if artistProducts?.length > 0}
			<div class="mt-12">
				<h2 class="text-xlarge text-primary font-bold mb-8">Artist's Works</h2>
				<ArtistSlider products={artistProducts} artistName={filteredArtist.title.rendered} />
			</div>
		{/if}
	{:else}
		<p class="text-secondary text-center">Artist information not found.</p>
	{/if}
</div>

<style>
	.artist-page-container {
		width: 100%;
		max-width: 100%;
		overflow-x: hidden;
		padding: var(--spacing-md);
		box-sizing: border-box;
	}

	@media (min-width: 768px) {
		.artist-page-container {
			padding: var(--page-padding);
		}
	}

	.product-layout {
		display: flex;
		gap: var(--spacing-md);
		width: 100%;
		margin-bottom: var(--spacing-xl);
	}

	.exhibition-card {
		background-color: var(--background-color);
		padding: var(--spacing-md);
		transition: transform 0.2s ease;
	}

	.exhibition-card.cursor-pointer:hover {
		transform: translateY(-2px);
	}

	.detail-row.clean {
		display: flex;
		justify-content: space-between;
		align-items: center;
		padding: var(--spacing-xs) 0;
		border-bottom: 1px solid var(--secondary-bg-color);
	}

	.detail-label {
		color: var(--text-color);
		font-size: 0.875rem;
	}

	.detail-value {
		color: var(--text-color);
		text-align: right;
	}

	.bio-drawer {
		padding: var(--spacing-sm) 0;
	}

	@media (max-width: 767px) {
		.product-layout {
			flex-direction: column;
		}
	}

	.pagination {
		display: flex;
		justify-content: center;
		gap: var(--spacing-xs);
		margin-top: var(--spacing-lg);
		padding: var(--spacing-md);
	}

	.pagination-button {
		padding: var(--spacing-xs) var(--spacing-sm);
		background-color: var(--background-color);
		color: var(--primary-color);
		cursor: pointer;
		transition: all 0.3s ease;
	}

	.pagination-button:hover:not(:disabled) {
		background-color: var(--primary-color);
		color: var(--background-color);
	}

	.pagination-button.active {
		background-color: var(--primary-color);
		color: var(--background-color);
	}

	.pagination-button:disabled {
		opacity: 0.5;
		cursor: not-allowed;
	}
</style>

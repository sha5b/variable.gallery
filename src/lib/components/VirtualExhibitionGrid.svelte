<script>
	export let exhibitions = [];
	export let media = [];
	export let limit = null; // Limit the number of items displayed (null means no limit)

	// Filter exhibitions to include only virtual exhibitions
	const virtualExhibitions = exhibitions.filter((exhibition) => exhibition.acf.virtual === true);

	// Apply limit if specified
	const displayedExhibitions = limit ? virtualExhibitions.slice(0, limit) : virtualExhibitions;

	// Function to get media URL by fingerprint ID
	function getMediaUrlByFingerprint(fingerprintId) {
		const mediaItem = media.find((item) => item.id === fingerprintId);
		return mediaItem ? mediaItem.source_url : '';
	}

	// Function to generate URL-friendly title for routing
	function getExhibitionUrl(title) {
		return `/exhibitions/${title
			.toLowerCase()
			.replace(/[^a-z0-9]+/g, '-')
			.replace(/^-|-$/g, '')}`;
	}
</script>

<div class="exhibition-grid flex flex-wrap gap-md">
	{#each displayedExhibitions as exhibition}
		<a href={getExhibitionUrl(exhibition.title.rendered)} class="exhibition-item overflow-hidden transition-default transform ">
			<!-- Image container with overlay text -->
			<div class="exhibition-image-container relative">
				<img
					src={getMediaUrlByFingerprint(exhibition.acf.fingerprint)}
					alt={exhibition.title.rendered}
					class="w-full h-full object-cover"
				/>
				<div class="exhibition-overlay absolute bottom-0 left-0 w-full flex flex-row gap-8">
					
					<div class="exhibition-info text-small space-y-1 align-bottom">
						{#if exhibition.acf.artist}
							<p><strong>artist(s):</strong> {exhibition.acf.artist.join(', ')}</p>
						{/if}
						<p><strong>date:</strong> {exhibition.date}</p>
						<p><strong>Location:</strong> {exhibition.acf.location || 'Unknown'}</p>
					</div>
					<h2 class="text-4xl font-bold">{exhibition.title.rendered}</h2>
				</div>
			</div>
		</a>
	{/each}
</div>

<style>
	.exhibition-grid {
		gap: var(--spacing-md);
		padding-top: 5rem;
		padding-bottom: 5rem;
	}

	.exhibition-item {
		flex: 1 1 calc(50% - var(--spacing-md));
		max-width: calc(50% - var(--spacing-md));
		cursor: pointer;
		color: inherit;
		text-decoration: none;
		position: relative;
	}
	@media (max-width: 768px) {
		.exhibition-item {
			flex: 1 1 100%;
			max-width: 100%;
		}
	}
</style>

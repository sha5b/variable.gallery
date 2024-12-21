<script>
	import '$lib/styles/components/exhibition.css';
	import { getMediaUrlByFingerprint, getExhibitionUrl } from '$lib/utils/mediaUtils';

	/** @type {import('$lib/utils/types').Exhibition[]} */
	export let exhibitions = [];
	/** @type {import('$lib/utils/types').Media[]} */
	export let media = [];
	/** @type {number|null} */
	export let limit = null; // Limit the number of items displayed (null means no limit)

	// Filter exhibitions to include only virtual exhibitions
	const virtualExhibitions = exhibitions.filter((exhibition) => exhibition.acf.virtual === true);

	// Apply limit if specified
	const displayedExhibitions = limit ? virtualExhibitions.slice(0, limit) : virtualExhibitions;
</script>

<div class="exhibition-grid flex flex-wrap gap-md">
	{#each displayedExhibitions as exhibition}
		<a href={getExhibitionUrl(exhibition.title.rendered)} class="exhibition-item overflow-hidden transition-default transform">
			<!-- Image container with overlay text -->
			<div class="exhibition-image-container relative">
				<img
					src={getMediaUrlByFingerprint(media, exhibition.acf.fingerprint)}
					alt={exhibition.title.rendered}
					class="w-full h-full object-cover"
				/>
				<div class="exhibition-overlay">
					<div class="exhibition-info text-small space-y-1 align-bottom">
						{#if exhibition.acf.artist}
							<p><strong>artist(s):</strong> {exhibition.acf.artist.join(', ')}</p>
						{/if}
						<p><strong>date:</strong> {exhibition.date}</p>
						<p><strong>location:</strong> {exhibition.acf.location || 'Unknown'}</p>
					</div>
					<h2 class="text-4xl font-bold">{exhibition.title.rendered}</h2>
				</div>
			</div>
		</a>
	{/each}
</div>

<script>
	import '$lib/styles/components/exhibition.css';

	/**
	 * @typedef {Object} Media
	 * @property {number} id
	 * @property {string} source_url
	 */

	/**
	 * @typedef {Object} Exhibition
	 * @property {{virtual: boolean, fingerprint: number, artist?: string[], location?: string}} acf
	 * @property {{rendered: string}} title
	 * @property {string} date
	 */

	/** @type {Exhibition[]} */
	export let exhibitions = [];
	/** @type {Media[]} */
	export let media = [];
	/** @type {number|null} */
	export let limit = null; // Limit the number of items displayed (null means no limit)

	// Filter exhibitions to include only virtual exhibitions
	const virtualExhibitions = exhibitions.filter((exhibition) => exhibition.acf.virtual === true);

	// Apply limit if specified
	const displayedExhibitions = limit ? virtualExhibitions.slice(0, limit) : virtualExhibitions;

	/**
	 * Function to get media URL by fingerprint ID
	 * @param {number} fingerprintId
	 * @returns {string}
	 */
	function getMediaUrlByFingerprint(fingerprintId) {
		const mediaItem = media.find((item) => item.id === fingerprintId);
		return mediaItem ? mediaItem.source_url : '';
	}

	/**
	 * Function to generate URL-friendly title for routing
	 * @param {string} title
	 * @returns {string}
	 */
	function getExhibitionUrl(title) {
		return `/exhibitions/${title
			.toLowerCase()
			.replace(/[^a-z0-9]+/g, '-')
			.replace(/^-|-$/g, '')}`;
	}
</script>

<div class="exhibition-grid flex flex-wrap gap-md">
	{#each displayedExhibitions as exhibition}
		<a href={getExhibitionUrl(exhibition.title.rendered)} class="exhibition-item overflow-hidden transition-default transform">
			<!-- Image container with overlay text -->
			<div class="exhibition-image-container relative">
				<img
					src={getMediaUrlByFingerprint(exhibition.acf.fingerprint)}
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

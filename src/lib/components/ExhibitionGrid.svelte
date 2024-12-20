<script lang="ts">
	import '$lib/styles/components/exhibition.css';

	interface Media {
		id: number;
		source_url: string;
	}

	interface Exhibition {
		acf: {
			virtual: boolean;
			fingerprint: number;
			artist?: string[];
			location?: string;
		};
		title: {
			rendered: string;
		};
		date: string;
	}

	export let exhibitions: Exhibition[] = [];
	export let media: Media[] = [];
	export let limit: number | null = null; // Limit the number of items displayed (null means no limit)

	// Filter exhibitions to include only virtual exhibitions
	const virtualExhibitions = exhibitions.filter((exhibition) => exhibition.acf.virtual === true);

	// Apply limit if specified
	const displayedExhibitions = limit ? virtualExhibitions.slice(0, limit) : virtualExhibitions;

	// Function to get media URL by fingerprint ID
	function getMediaUrlByFingerprint(fingerprintId: number): string {
		const mediaItem = media.find((item) => item.id === fingerprintId);
		return mediaItem ? mediaItem.source_url : '';
	}

	// Function to generate URL-friendly title for routing
	function getExhibitionUrl(title: string): string {
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

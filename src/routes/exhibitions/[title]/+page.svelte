<script>
	import { page } from '$app/stores';
	import { onMount } from 'svelte';
	export let data;
	const { exhibitions, media } = data;

	// Import the component to display the exhibition
	import LatestVirtualExhibition from '$lib/components/LatestVirtualExhibition.svelte';

	// Access the current title from the URL parameters
	let currentTitle;

	// Use onMount to check if $page store has the title
	onMount(() => {
		currentTitle = $page.params.title;
		console.log('Current Title (from URL params):', currentTitle);
	});

	// Clean up title by removing trailing special characters and whitespace
	function cleanTitle(title) {
		return title
			?.toLowerCase()
			.replace(/[^a-z0-9]+$/g, '')
			.trim();
	}

	// Print currentTitle after cleaning
	$: console.log('Current Title (cleaned):', cleanTitle(currentTitle));

	// Print all exhibitions to inspect their data
	console.log('All Exhibitions:', exhibitions);

	// Find the current exhibition based on the cleaned title parameter
	$: currentExhibition = exhibitions.find(
		(exhibition) => cleanTitle(exhibition.title.rendered) === cleanTitle(currentTitle)
	);

	// Log the matched exhibition (or null if not found)
	$: console.log('Matched Exhibition:', currentExhibition);

	// Function to get media URL by fingerprint ID
	function getMediaUrlByFingerprint(fingerprintId) {
		const mediaItem = media.find((item) => item.id === fingerprintId);
		return mediaItem ? mediaItem.source_url : '';
	}

	// Log all media items to verify their structure and IDs
	console.log('All Media:', media);
</script>

<div class="exhibition-landing-page">
	{#if currentExhibition}
		<div class="exhibition-header">
			<h1 class="exhibition-title">{currentExhibition.title.rendered}</h1>
			<p class="exhibition-curator">
				<strong>Curator:</strong>
				{currentExhibition.acf.curator || 'Unknown'}
			</p>
		</div>

		<div class="exhibition-content">
			<!-- Display the main image of the exhibition -->
			<div class="exhibition-image">
				<img
					src={getMediaUrlByFingerprint(currentExhibition.acf.fingerprint)}
					alt={currentExhibition.title.rendered}
				/>
			</div>

			<!-- Display details about the exhibition -->
			<div class="exhibition-details">
				<p class="exhibition-description">
					{currentExhibition.acf.description || 'No description available.'}
				</p>
				<p class="exhibition-date">
					<strong>Date:</strong>
					{new Date(currentExhibition.date).toLocaleDateString()}
				</p>
				<p class="exhibition-location">
					<strong>Location:</strong>
					{currentExhibition.acf.location || 'Unknown'}
				</p>
				<p class="exhibition-artists">
					<strong>Artist(s):</strong>
					{currentExhibition.acf.artist.join(', ') || 'Not specified'}
				</p>
			</div>
		</div>
	{:else}
		<p class="not-found-message">Exhibition not found.</p>
	{/if}
</div>

<style>
	.exhibition-landing-page {
		padding: 2rem;
		max-width: 1200px;
		margin: 0 auto;
		font-family: var(--font-family);
	}

	.exhibition-header {
		text-align: center;
		margin-bottom: 2rem;
	}

	.exhibition-title {
		font-size: 2.5rem;
		font-weight: bold;
		color: var(--primary-color);
		margin-bottom: 0.5rem;
	}

	.exhibition-curator {
		font-size: 1rem;
		color: var(--secondary-color);
	}

	.exhibition-content {
		display: flex;
		flex-direction: column;
		gap: 2rem;
		align-items: center;
	}

	.exhibition-image {
		width: 100%;
		max-width: 600px;
		border-radius: var(--rounded-md);
		overflow: hidden;
		box-shadow: var(--shadow-lg);
	}

	.exhibition-image img {
		width: 100%;
		height: auto;
		display: block;
		object-fit: cover;
	}

	.exhibition-details {
		text-align: left;
		max-width: 600px;
	}

	.exhibition-description {
		font-size: 1.125rem;
		color: var(--text-color);
		margin-bottom: 1rem;
		line-height: 1.6;
	}

	.exhibition-date,
	.exhibition-location,
	.exhibition-artists {
		font-size: 1rem;
		color: var(--text-secondary);
		margin-bottom: 0.5rem;
	}

	.not-found-message {
		text-align: center;
		font-size: 1.5rem;
		color: var(--error-color);
	}

	@media (min-width: 768px) {
		.exhibition-content {
			flex-direction: row;
			gap: 4rem;
			align-items: flex-start;
		}

		.exhibition-image,
		.exhibition-details {
			flex: 1;
		}
	}
</style>

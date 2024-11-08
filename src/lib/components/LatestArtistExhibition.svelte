<script>
    export let exhibition = null;
    export let media = [];

    // Function to get media URL by fingerprint ID
    function getMediaUrlByFingerprint(fingerprintId) {
        const mediaItem = media.find(item => item.id === fingerprintId);
        return mediaItem ? mediaItem.source_url : '';
    }
</script>

{#if exhibition}
    <a href="/exhibitions" class="exhibition">
        <div class="exhibition-image-container">
            <img src="{getMediaUrlByFingerprint(exhibition.acf.fingerprint)}" alt="Exhibition Media">
            <h2 class="exhibition-title">{exhibition.title.rendered}</h2>
        </div>
        <p class="exhibition-description">{exhibition.description}</p>
    </a>
{:else}
    <p>No virtual exhibitions available for this artist.</p>
{/if}

<style>
	.exhibition {
		margin-bottom: 2rem;
		position: relative;
		max-width: 100%;
		cursor: pointer;
		text-decoration: none;
		color: inherit;
	}

	.exhibition-image-container {
		position: relative;
		width: 100%;
		overflow: hidden;
	}

	.exhibition img {
		width: 100%;
		height: auto;
		display: block;
	}

	.exhibition-title {
		position: absolute;
		bottom: 0;
		left: 0;
		margin: 0;
		color: var(--text-color);
		font-size: 8rem;
		font-weight: bold;
	}

	.exhibition-description {
		font-size: 1rem;
		color: var(--text-color);
		margin-top: 1rem;
	}
</style>

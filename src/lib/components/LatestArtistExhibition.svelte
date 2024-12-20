<script lang="ts">
    import '$lib/styles/components/exhibition.css';

    interface Media {
        id: number;
        source_url: string;
    }

    interface Exhibition {
        acf: {
            fingerprint: number;
        };
        title: {
            rendered: string;
        };
        description: string;
    }

    export let exhibition: Exhibition | null = null;
    export let media: Media[] = [];

    // Function to get media URL by fingerprint ID
    function getMediaUrlByFingerprint(fingerprintId: number): string {
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

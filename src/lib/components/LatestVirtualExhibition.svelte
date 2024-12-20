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
        };
        title: {
            rendered: string;
        };
        description: string;
        date: string;
    }

    export let exhibitions: Exhibition[] = [];
    export let media: Media[] = [];
  
    // Filter exhibitions to only include virtual ones and sort by date to get the latest
    const latestVirtualExhibition = exhibitions
        .filter(exhibition => exhibition.acf.virtual === true)
        .sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime())[0];
  
    // Function to get media URL by fingerprint ID
    function getMediaUrlByFingerprint(fingerprintId: number): string {
        const mediaItem = media.find(item => item.id === fingerprintId);
        return mediaItem ? mediaItem.source_url : '';
    }
</script>

<!-- Display the latest virtual exhibition if it exists -->
{#if latestVirtualExhibition}
    <a href="/exhibitions" class="exhibition">
        <div class="exhibition-image-container">
            <img src="{getMediaUrlByFingerprint(latestVirtualExhibition.acf.fingerprint)}" alt="Exhibition Media">
            <h2 class="exhibition-title">{latestVirtualExhibition.title.rendered}</h2>
        </div>
        <p class="exhibition-description">{latestVirtualExhibition.description}</p>
    </a>
{:else}
    <p>No virtual exhibitions available.</p>
{/if}

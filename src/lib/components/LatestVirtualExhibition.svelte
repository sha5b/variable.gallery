<script>
    import '$lib/styles/components/exhibition.css';

    /**
     * @typedef {Object} Media
     * @property {number} id
     * @property {string} source_url
     */

    /**
     * @typedef {Object} Exhibition
     * @property {{virtual: boolean, fingerprint: number}} acf
     * @property {{rendered: string}} title
     * @property {string} description
     * @property {string} date
     */

    /** @type {Exhibition[]} */
    export let exhibitions = [];
    /** @type {Media[]} */
    export let media = [];
  
    // Filter exhibitions to only include virtual ones and sort by date to get the latest
    /** @type {Exhibition|undefined} */
    const latestVirtualExhibition = exhibitions
        .filter(exhibition => exhibition.acf.virtual === true)
        .sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime())[0];
  
    /**
     * Function to get media URL by fingerprint ID
     * @param {number} fingerprintId
     * @returns {string}
     */
    function getMediaUrlByFingerprint(fingerprintId) {
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

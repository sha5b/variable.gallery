<script>
    import '$lib/styles/components/exhibition.css';

    /**
     * @typedef {Object} Media
     * @property {number} id
     * @property {string} source_url
     */

    /**
     * @typedef {Object} Exhibition
     * @property {{fingerprint: number}} acf
     * @property {{rendered: string}} title
     * @property {string} description
     */

    /** @type {Exhibition | null} */
    export let exhibition = null;
    /** @type {Media[]} */
    export let media = [];

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

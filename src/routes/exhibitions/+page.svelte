<script>
    import LatestVirtualExhibition from '$lib/components/LatestVirtualExhibition.svelte';
    import ExhibitionGrid from '$lib/components/ExhibitionGrid.svelte';
    
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
     * @property {string} description
     */

    /**
     * @typedef {Object} PageData
     * @property {Exhibition[]} exhibitions
     * @property {Media[]} media
     */

    /** @type {PageData} */
    export let data;
    const { exhibitions, media } = data;
</script>

<div class="page-container">
    <div class="content-section">
        <LatestVirtualExhibition {exhibitions} {media} />
    </div>
    <div class="content-section">
        <ExhibitionGrid {exhibitions} {media} />
    </div>
</div>

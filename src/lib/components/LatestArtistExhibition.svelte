<script>
    import '$lib/styles/components/exhibition.css';
    import { getMediaUrlByFingerprint } from '$lib/utils/mediaUtils';

    /** @type {import('$lib/utils/types').Exhibition | null} */
    export let exhibition = null;
    /** @type {import('$lib/utils/types').Media[]} */
    export let media = [];
</script>

{#if exhibition}
    <a href="/exhibitions" class="exhibition">
        <div class="exhibition-image-container">
            <img src="{getMediaUrlByFingerprint(media, exhibition.acf.fingerprint)}" alt="Exhibition Media">
            <h2 class="exhibition-title">{exhibition.title.rendered}</h2>
        </div>
        <p class="exhibition-description">{exhibition.description}</p>
    </a>
{:else}
    <p>No virtual exhibitions available for this artist.</p>
{/if}

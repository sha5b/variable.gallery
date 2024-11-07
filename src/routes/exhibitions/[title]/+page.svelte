<script>
    import { page } from '$app/stores'; // Import the page store
    export let data;
    const { exhibitions, media } = data;

    import LatestVirtualExhibition from '$lib/components/LatestVirtualExhibition.svelte';

    // Access the current title from the URL parameters
    let currentTitle;
    $: currentTitle = $page.params.title;
</script>

<div class="exhibition-landing-page">
    <h1 class="exhibition-title">Exhibition: {currentTitle}</h1>
    
    <!-- Display the LatestVirtualExhibition component with the specific exhibition data -->
    <LatestVirtualExhibition {exhibitions} {media} />
</div>

<style>
    .exhibition-landing-page {
        padding: 2rem;
    }
    .exhibition-title {
        font-size: 2rem;
        font-weight: bold;
        margin-bottom: 1rem;
    }
</style>

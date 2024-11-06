<script>
    import { onMount } from 'svelte';

    let errorMessage = "404 - This world doesn’t exist!";
    
    onMount(() => {
        console.log("Generating procedural environment for 404 error.");
    });
</script>

<div class="error-page flex-center flex-col text-text-color px-page">
    <h1 class="text-xlarge font-heading">{errorMessage}</h1>
    <p class="margin-md text-base">It seems you've entered an uncharted territory of our gallery. Try heading back to explore the curated worlds we have.</p>
    <a href="/" class="button-primary mt-4">Return to Home</a>
</div>

<style>
    .error-page {
        height: 100vh;
        background-color: var(--background-color);
    }
</style>

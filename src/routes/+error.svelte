<script>
    import { onMount } from 'svelte';

    let errorMessage = "404 - This world doesn’t exist!";
    
    onMount(() => {
        console.log("Generating procedural environment for 404 error.");
    });
</script>

<div class="container flex items-center justify-center flex-col min-h-screen bg-background">
    <h1 class="h1">{errorMessage}</h1>
    <p class="m-md">It seems you've entered an uncharted territory of our gallery. Try heading back to explore the curated worlds we have.</p>
    <a href="/" class="btn btn-primary">Return to Home</a>
</div>

<script lang="ts">
    import '$lib/styles/components/loading.css';
    
    export let visible = false;
</script>

{#if visible}
    <div class="spinner-overlay">
        <div class="spinner"></div>
    </div>
{/if}

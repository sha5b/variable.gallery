<script>
    import * as THREE from 'three';
    import { onMount, onDestroy } from 'svelte';
    import { scene } from '../store/faunaStore';

    // Props for fog configuration
    export let color = 0x001b44;  // Match skybox color
    export let near = 10;
    export let far = 100;

    let fog;

    onMount(() => {
        // Create exponential fog for smoother falloff
        fog = new THREE.FogExp2(color, 0.01);
        $scene.fog = fog;
    });

    onDestroy(() => {
        if (fog) {
            $scene.fog = null;
        }
    });

    // Update fog if props change
    $: if (fog) {
        fog.color.setHex(color);
    }
</script> 
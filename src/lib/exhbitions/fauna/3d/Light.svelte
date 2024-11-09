<script>
    import * as THREE from 'three';
    import { onMount, onDestroy } from 'svelte';
    import { scene } from '../store/faunaStore';

    let lights = [];

    onMount(() => {
        // Stronger ambient light
        const ambient = new THREE.AmbientLight(0x666666);
        
        // Main directional light from top-front
        const mainLight = new THREE.DirectionalLight(0xffffff, 1.2);
        mainLight.position.set(1, 2, 1);
        
        // Fill light from opposite direction
        const fillLight = new THREE.DirectionalLight(0x4477ff, 0.4);
        fillLight.position.set(-1, 0.5, -1);

        lights = [ambient, mainLight, fillLight];
        lights.forEach(light => $scene.add(light));
    });

    onDestroy(() => {
        lights.forEach(light => {
            $scene.remove(light);
        });
    });
</script>
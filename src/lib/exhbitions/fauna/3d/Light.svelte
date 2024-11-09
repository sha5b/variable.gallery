<script>
    import * as THREE from 'three';
    import { onMount, onDestroy } from 'svelte';
    import { scene } from '../store/faunaStore';

    let lights = [];

    onMount(() => {
        // Ambient light
        const ambient = new THREE.AmbientLight(0x444444);
        
        // Directional lights
        const light1 = new THREE.DirectionalLight(0xffffff, 1);
        light1.position.set(1, 1, 1);
        
        const light2 = new THREE.DirectionalLight(0xffffff, 0.5);
        light2.position.set(-1, -1, -1);

        lights = [ambient, light1, light2];
        lights.forEach(light => $scene.add(light));
    });

    onDestroy(() => {
        lights.forEach(light => {
            $scene.remove(light);
        });
    });
</script>
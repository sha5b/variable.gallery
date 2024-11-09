<script>
    import * as THREE from 'three';
    import { onMount, onDestroy } from 'svelte';
    import { scene } from '../store/faunaStore';

    export let position = [0, 0, 0];
    export let color = 0x00ff00;

    let mesh;

    onMount(() => {
        const geometry = new THREE.BoxGeometry();
        const material = new THREE.MeshBasicMaterial({ color });
        mesh = new THREE.Mesh(geometry, material);
        mesh.position.set(...position);
        $scene.add(mesh);
    });

    onDestroy(() => {
        if (mesh) {
            $scene.remove(mesh);
        }
    });
</script>
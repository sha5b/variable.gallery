<script>
    import * as THREE from 'three';
    import { onMount, onDestroy } from 'svelte';
    import { scene } from '../store/faunaStore';

    export let size = 100;
    export let color = 0x3366ff;

    let mesh;

    onMount(() => {
        // Create a simple plane
        const geometry = new THREE.PlaneGeometry(size, size);
        const material = new THREE.MeshBasicMaterial({ 
            color: color,
            side: THREE.DoubleSide,
            wireframe: true
        });

        mesh = new THREE.Mesh(geometry, material);
        mesh.rotation.x = -Math.PI / 2;  // Rotate to be horizontal
        mesh.position.y = -2;            // Move it below the cube

        $scene.add(mesh);
    });

    onDestroy(() => {
        if (mesh) {
            mesh.geometry.dispose();
            mesh.material.dispose();
            $scene.remove(mesh);
        }
    });
</script>
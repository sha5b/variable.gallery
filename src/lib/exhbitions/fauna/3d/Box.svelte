<script>
    import * as THREE from 'three';
    import { onMount, onDestroy } from 'svelte';
    import { scene } from '../store/faunaStore';

    export let position = [0, 0, 0];
    export let color = 0x00ff00;
    export let onPositionChange = (pos) => {};

    let mesh;
    let time = 0;
    let animationId;

    onMount(() => {
        const geometry = new THREE.BoxGeometry(1, 1, 1);
        const material = new THREE.MeshBasicMaterial({ color });
        mesh = new THREE.Mesh(geometry, material);
        mesh.position.set(...position);
        $scene.add(mesh);

        function animate() {
            time += 0.01;
            
            const x = Math.sin(time) * 20;
            const z = Math.cos(time * 0.5) * 20;
            const y = 1;
            
            mesh.position.set(x, y, z);
            onPositionChange([x, y, z]);
            
            animationId = requestAnimationFrame(animate);
        }
        
        animate();
    });

    onDestroy(() => {
        if (mesh) {
            $scene.remove(mesh);
        }
        if (animationId) {
            cancelAnimationFrame(animationId);
        }
    });
</script>
<script>
    import * as THREE from 'three';
    import { onMount, onDestroy } from 'svelte';
    import { scene } from '../store/faunaStore';

    let skybox;

    onMount(() => {
        // Create a large cube
        const geometry = new THREE.BoxGeometry(1000, 1000, 1000);
        
        // Create materials for each side of the cube
        const materialArray = [];
        const colors = [
            0x001b44, // Right  - Deep blue
            0x001b44, // Left   - Deep blue
            0x000b24, // Top    - Darker blue
            0x002b64, // Bottom - Lighter blue
            0x001b44, // Front  - Deep blue
            0x001b44  // Back   - Deep blue
        ];

        for (let i = 0; i < 6; i++) {
            const material = new THREE.MeshBasicMaterial({
                color: colors[i],
                side: THREE.BackSide // Render on the inside of the cube
            });
            materialArray.push(material);
        }

        skybox = new THREE.Mesh(geometry, materialArray);
        $scene.add(skybox);
    });

    onDestroy(() => {
        if (skybox) {
            $scene.remove(skybox);
            skybox.geometry.dispose();
            skybox.material.forEach(material => material.dispose());
        }
    });
</script> 
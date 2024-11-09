<script>
    import * as THREE from 'three';
    import { onMount } from 'svelte';
    import { scene, camera } from '../store/faunaStore';

    let canvas;
    let renderer;

    onMount(() => {
        renderer = new THREE.WebGLRenderer({ canvas });
        renderer.setSize(window.innerWidth, window.innerHeight);

        $scene.background = new THREE.Color(0x20232a);

        const animate = () => {
            requestAnimationFrame(animate);
            if ($camera) {
                renderer.render($scene, $camera);
            }
        };
        animate();

        return () => {
            renderer.dispose();
        };
    });
</script>

<canvas bind:this={canvas}>
    <slot />
</canvas>
<script>
    import * as THREE from 'three';
    import { MarchingCubes } from 'three/examples/jsm/objects/MarchingCubes';
    import { createNoise3D } from 'simplex-noise';
    import { onMount, onDestroy } from 'svelte';
    import { scene, camera } from '../store/faunaStore';

    const noise3D = createNoise3D();
    let effect;
    let clock = new THREE.Clock();
    let time = 0;

    const material = new THREE.MeshPhongMaterial({
        color: 0x4444ff,
        specular: 0x111111,
        shininess: 100,
        side: THREE.DoubleSide
    });

    onMount(() => {
        effect = new MarchingCubes(64, material, true, true);
        effect.position.set(0, 0, 0);
        effect.scale.set(32, 32, 32);
        
        $scene.add(effect);

        function animate() {
            requestAnimationFrame(animate);
            time += clock.getDelta();
            
            effect.reset();

            // Create a more subtle base layer
            for (let x = 0.3; x <= 0.7; x += 0.05) {
                for (let z = 0.3; z <= 0.7; z += 0.05) {
                    const height = 0.5 + noise3D(x * 3, time * 0.1, z * 3) * 0.05;
                    effect.addBall(x, height, z, 0.6, 12);
                }
            }

            // Add smaller, more subtle animated metaballs
            for (let i = 0; i < 16; i++) {
                const angle = (i / 16) * Math.PI * 2;
                const radius = 0.15 + Math.sin(time + i) * 0.02;
                
                const x = Math.cos(angle + time * 0.3) * radius + 0.5;
                const z = Math.sin(angle + time * 0.3) * radius + 0.5;
                const y = 0.5 + noise3D(x, time * 0.2, z) * 0.08;
                
                effect.addBall(x, y, z, 0.4, 12);
            }

            // Fewer random movement metaballs
            for (let i = 0; i < 8; i++) {
                const x = 0.5 + noise3D(i, time, 0) * 0.15;
                const z = 0.5 + noise3D(0, time, i) * 0.15;
                const y = 0.5 + noise3D(i, time * 0.1, i) * 0.05;
                
                effect.addBall(x, y, z, 0.3, 12);
            }

            effect.isolation = 40;
            effect.update();
        }

        animate();
    });

    onDestroy(() => {
        if (effect) {
            effect.geometry?.dispose();
            effect.material?.dispose();
            $scene.remove(effect);
        }
    });
</script>
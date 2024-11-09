<script>
    import * as THREE from 'three';
    import { MarchingCubes } from 'three/examples/jsm/objects/MarchingCubes';
    import { createNoise3D } from 'simplex-noise';
    import { onMount, onDestroy } from 'svelte';
    import { scene, camera, terrainConfig } from '../store/faunaStore';

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
        effect = new MarchingCubes(48, material, true, true);
        effect.position.set(-16, -16, -16);
        effect.scale.set(32, 32, 32);
        
        $scene.add(effect);

        function animate() {
            requestAnimationFrame(animate);
            time += clock.getDelta() * 0.5;
            
            effect.reset();

            for (let x = 0; x < 8; x++) {
                for (let z = 0; z < 8; z++) {
                    const px = x / 8 + 0.06;
                    const pz = z / 8 + 0.06;
                    
                    const height = 0.5 + noise3D(px * 4, time * 0.2, pz * 4) * 0.1;
                    
                    effect.addBall(
                        px, 
                        height, 
                        pz, 
                        0.2,
                        12
                    );
                }
            }

            effect.isolation = 30;
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
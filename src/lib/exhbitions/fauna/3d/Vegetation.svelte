<script>
    import * as THREE from 'three';
    import { MarchingCubes } from 'three/examples/jsm/objects/MarchingCubes';
    import { createNoise3D } from 'simplex-noise';
    import { scene } from '../store/faunaStore';
    import { onMount, onDestroy } from 'svelte';

    export let position = [0, 0, 0];
    export let scale = 1;

    let vegetation;
    let time = 0;
    let animationId;
    const noise3D = createNoise3D();

    const config = {
        resolution: 32,
        metaballCount: 8,
        moveSpeed: 0.1,
        noiseScale: 0.5,
        metaballStrength: 0.8,
        metaballScale: 0.1,
        isolation: 1.2
    };

    const material = new THREE.MeshPhongMaterial({
        color: 0xff0000,
        specular: 0x111111,
        shininess: 30,
        transparent: true,
        opacity: 0.9
    });

    function createVegetation() {
        if (vegetation) {
            $scene.remove(vegetation);
            vegetation.geometry?.dispose();
            vegetation.material?.dispose();
        }

        vegetation = new MarchingCubes(config.resolution, material, true, true);
        vegetation.position.set(...position);
        vegetation.scale.set(scale, scale, scale);

        $scene.add(vegetation);
    }

    function updateMetaballs() {
        if (!vegetation) return;
        
        vegetation.reset();

        for (let i = 0; i < config.metaballCount; i++) {
            const noiseTime = time * config.moveSpeed;
            const nx = noise3D(i * 1.1, noiseTime, 0) * config.noiseScale;
            const ny = noise3D(i * 1.1, 0, noiseTime) * config.noiseScale;
            const nz = noise3D(0, i * 1.1, noiseTime) * config.noiseScale;

            const angle = (i / config.metaballCount) * Math.PI * 2;
            const radius = 0.3 + (i / config.metaballCount) * 0.2;
            
            const x = 0.5 + Math.sin(angle) * radius + nx;
            const y = 0.3 + (i / config.metaballCount) * 0.4 + ny;
            const z = 0.5 + Math.cos(angle) * radius + nz;

            vegetation.addBall(
                x, y, z,
                config.metaballScale,
                config.metaballStrength
            );
        }

        vegetation.isolation = config.isolation;
        vegetation.update();
    }

    function animate() {
        time += 0.01;
        updateMetaballs();
        animationId = requestAnimationFrame(animate);
    }

    onMount(() => {
        createVegetation();
        animate();
    });

    $: if (vegetation) {
        vegetation.position.set(...position);
        vegetation.scale.set(scale, scale, scale);
    }

    onDestroy(() => {
        if (vegetation) {
            $scene.remove(vegetation);
            vegetation.geometry?.dispose();
            vegetation.material?.dispose();
        }
        if (animationId) {
            cancelAnimationFrame(animationId);
        }
    });
</script> 
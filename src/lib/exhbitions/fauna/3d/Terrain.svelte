<script>
    import * as THREE from 'three';
    import { MarchingCubes } from 'three/examples/jsm/objects/MarchingCubes';
    import { createNoise3D } from 'simplex-noise';
    import { onMount, onDestroy } from 'svelte';
    import { scene, camera, chunkSize, renderDistance, voxelSize } from '../store/faunaStore';

    const noise3D = createNoise3D();
    let meshes = new Map();
    let clock = new THREE.Clock();
    let time = 0;
    let lastUpdate = 0;
    const UPDATE_INTERVAL = 100;

    const material = new THREE.MeshPhongMaterial({
        color: 0x4444ff,
        specular: 0x111111,
        shininess: 150,
        side: THREE.DoubleSide
    });

    class TerrainChunk {
        constructor(chunkX, chunkY, chunkZ) {
            this.position = { x: chunkX, y: chunkY, z: chunkZ };
            this.resolution = 48;
        }

        createMesh() {
            const effect = new MarchingCubes(this.resolution, material, true, true);
            
            effect.position.set(
                this.position.x * chunkSize,
                this.position.y * chunkSize,
                this.position.z * chunkSize
            );

            effect.scale.set(chunkSize, chunkSize, chunkSize);

            this.updateCubes(effect);
            return effect;
        }

        updateCubes(object) {
            object.reset();

            const numblobs = 80;
            const strength = 1.2 / ((Math.sqrt(numblobs) - 1) / 4 + 1);
            const subtract = 12;

            const terrainScale = 0.015;
            const heightScale = 0.5;

            for (let i = 0; i < numblobs; i++) {
                const ballx = Math.sin(i + 1.26 * time * (1.03 + 0.5 * Math.cos(0.21 * i))) * 0.27 + 0.5;
                const ballz = Math.cos(i + 1.32 * time * 0.1 * Math.sin((0.92 + 0.53 * i))) * 0.27 + 0.5;
                
                const worldX = (this.position.x + ballx) * chunkSize;
                const worldZ = (this.position.z + ballz) * chunkSize;
                
                const terrainHeight = noise3D(
                    worldX * terrainScale,
                    0,
                    worldZ * terrainScale
                ) * heightScale + 0.5;

                const bally = Math.abs(Math.cos(i + 1.12 * time * Math.cos(1.22 + 0.1424 * i))) * 0.3 + terrainHeight;

                object.addBall(
                    ballx,
                    bally,
                    ballz,
                    strength,
                    subtract
                );
            }

            object.isolation = 80;
            object.update();
        }
    }

    function updateChunks(cameraPos) {
        if (!cameraPos) return;

        const currentTime = Date.now();
        if (currentTime - lastUpdate < UPDATE_INTERVAL) return;
        lastUpdate = currentTime;

        time += clock.getDelta();

        const chunkX = Math.floor(cameraPos.x / chunkSize);
        const chunkZ = Math.floor(cameraPos.z / chunkSize);

        const neededChunks = new Set();
        const reducedRenderDistance = Math.max(2, renderDistance - 1);

        for (let y = -1; y < 1; y++) {
            for (let x = -reducedRenderDistance; x <= reducedRenderDistance; x++) {
                for (let z = -reducedRenderDistance; z <= reducedRenderDistance; z++) {
                    const distance = Math.sqrt(x * x + z * z);
                    if (distance > reducedRenderDistance) continue;

                    const cx = chunkX + x;
                    const cy = y;
                    const cz = chunkZ + z;
                    const key = `${cx},${cy},${cz}`;
                    neededChunks.add(key);

                    if (!meshes.has(key)) {
                        const chunk = new TerrainChunk(cx, cy, cz);
                        const mesh = chunk.createMesh();
                        meshes.set(key, mesh);
                        $scene.add(mesh);
                    }
                }
            }
        }

        if (time % 2 < 0.1) {
            meshes.forEach((mesh, key) => {
                if (neededChunks.has(key)) {
                    const [cx, cy, cz] = key.split(',').map(Number);
                    const chunk = new TerrainChunk(cx, cy, cz);
                    chunk.updateCubes(mesh);
                }
            });
        }

        if (time % 2 < 0.1) {
            for (const [key, mesh] of meshes) {
                if (!neededChunks.has(key)) {
                    $scene.remove(mesh);
                    mesh.geometry?.dispose();
                    mesh.material?.dispose();
                    meshes.delete(key);
                }
            }
        }
    }

    $: if ($camera) {
        updateChunks($camera.position);
    }

    onDestroy(() => {
        meshes.forEach(mesh => {
            $scene.remove(mesh);
            mesh.geometry?.dispose();
            mesh.material?.dispose();
        });
    });
</script>
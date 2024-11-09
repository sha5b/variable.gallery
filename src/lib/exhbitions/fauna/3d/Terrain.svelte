<script>
    import * as THREE from 'three';
    import { MarchingCubes } from 'three/examples/jsm/objects/MarchingCubes';
    import { createNoise3D } from 'simplex-noise';
    import { onMount, onDestroy } from 'svelte';
    import { scene, camera, chunkSize, renderDistance, voxelSize } from '../store/faunaStore';

    export let color = 0x3366ff;
    const noise3D = createNoise3D();
    let meshes = new Map();

    class TerrainChunk {
        constructor(chunkX, chunkY, chunkZ) {
            this.position = { x: chunkX, y: chunkY, z: chunkZ };
            this.resolution = 48;
        }

        createMesh() {
            const effect = new MarchingCubes(this.resolution, new THREE.MeshPhongMaterial({
                color: color,
                specular: 0x111111,
                shininess: 50
            }), true, true);

            effect.position.set(
                this.position.x * chunkSize * voxelSize,
                this.position.y * chunkSize * voxelSize,
                this.position.z * chunkSize * voxelSize
            );

            const scale = chunkSize * voxelSize;
            effect.scale.set(scale, scale, scale);

            // Keep your existing noise parameters as they work well
            const terrainScale = 0.03;
            const caveScale = 0.07;
            const heightScale = 32;

            effect.reset();

            for (let i = 0; i < this.resolution; i++) {
                for (let j = 0; j < this.resolution; j++) {
                    for (let k = 0; k < this.resolution; k++) {
                        const worldX = this.position.x * chunkSize + (i / this.resolution) * chunkSize;
                        const worldY = this.position.y * chunkSize + (j / this.resolution) * chunkSize;
                        const worldZ = this.position.z * chunkSize + (k / this.resolution) * chunkSize;

                        // Use your existing terrain generation
                        const height = (
                            noise3D(worldX * terrainScale, 0, worldZ * terrainScale) * 0.6 + 
                            noise3D(worldX * terrainScale * 2, 0, worldZ * terrainScale * 2) * 0.3 +
                            noise3D(worldX * terrainScale * 4, 0, worldZ * terrainScale * 4) * 0.1
                        ) * heightScale;

                        const cave = noise3D(
                            worldX * caveScale, 
                            worldY * caveScale, 
                            worldZ * caveScale
                        );

                        // Convert to metaball field values
                        const surfaceValue = (height - worldY) * 0.1;
                        const caveValue = (cave - 0.3) * 3;

                        // Combine values for final field
                        const fieldValue = Math.max(surfaceValue, -caveValue);

                        const index = i + j * this.resolution + k * this.resolution * this.resolution;
                        effect.field[index] = fieldValue;
                    }
                }
            }

            effect.isolation = 0.0;
            effect.update();

            return effect;
        }
    }

    // Keep your existing chunk management code
    function updateChunks(cameraPos) {
        if (!cameraPos) return;

        const chunkX = Math.floor(cameraPos.x / (chunkSize * voxelSize));
        const chunkZ = Math.floor(cameraPos.z / (chunkSize * voxelSize));

        for (let y = -1; y < 2; y++) {
            for (let x = -renderDistance; x <= renderDistance; x++) {
                for (let z = -renderDistance; z <= renderDistance; z++) {
                    const cx = chunkX + x;
                    const cy = y;
                    const cz = chunkZ + z;
                    const key = `${cx},${cy},${cz}`;

                    if (!meshes.has(key)) {
                        const chunk = new TerrainChunk(cx, cy, cz);
                        const mesh = chunk.createMesh();
                        meshes.set(key, mesh);
                        $scene.add(mesh);
                    }
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
<script>
    import * as THREE from 'three';
    import { createNoise3D } from 'simplex-noise';
    import { onMount, onDestroy } from 'svelte';
    import { scene, camera, chunkSize, renderDistance, voxelSize } from '../store/faunaStore';

    export let color = 0x3366ff;
    const noise3D = createNoise3D();
    let meshes = new Map();

    class VoxelChunk {
        constructor(chunkX, chunkY, chunkZ) {
            this.position = { x: chunkX, y: chunkY, z: chunkZ };
            this.voxels = new Array(chunkSize * chunkSize * chunkSize).fill(false);
        }

        getVoxel(x, y, z) {
            if (x < 0 || x >= chunkSize || y < 0 || y >= chunkSize || z < 0 || z >= chunkSize) return false;
            return this.voxels[x + y * chunkSize + z * chunkSize * chunkSize];
        }

        setVoxel(x, y, z, value) {
            if (x < 0 || x >= chunkSize || y < 0 || y >= chunkSize || z < 0 || z >= chunkSize) return;
            this.voxels[x + y * chunkSize + z * chunkSize * chunkSize] = value;
        }

        generate() {
            const scale = 0.03;  // Terrain scale
            const caveScale = 0.07;  // Cave noise scale
            const heightScale = 32;  // Terrain height

            for (let x = 0; x < chunkSize; x++) {
                for (let z = 0; z < chunkSize; z++) {
                    const worldX = this.position.x * chunkSize + x;
                    const worldZ = this.position.z * chunkSize + z;

                    // Base terrain height with smoother interpolation
                    const height = Math.floor(
                        (noise3D(worldX * scale, 0, worldZ * scale) * 0.6 + 
                         noise3D(worldX * scale * 2, 0, worldZ * scale * 2) * 0.3 +
                         noise3D(worldX * scale * 4, 0, worldZ * scale * 4) * 0.1) * heightScale
                    );

                    for (let y = 0; y < chunkSize; y++) {
                        const worldY = this.position.y * chunkSize + y;

                        // Cave generation with size limitation
                        const cave = noise3D(
                            worldX * caveScale, 
                            worldY * caveScale, 
                            worldZ * caveScale
                        );

                        // Check surrounding points to prevent large holes
                        const surroundingCave = 
                            noise3D((worldX + 1) * caveScale, worldY * caveScale, worldZ * caveScale) +
                            noise3D((worldX - 1) * caveScale, worldY * caveScale, worldZ * caveScale) +
                            noise3D(worldX * caveScale, worldY * caveScale, (worldZ + 1) * caveScale) +
                            noise3D(worldX * caveScale, worldY * caveScale, (worldZ - 1) * caveScale);

                        // Only create a cave if surrounding points also support it
                        const hasCave = cave > 0.3 && surroundingCave > 0.8;
                        const surface = worldY < height;
                        
                        this.setVoxel(x, y, z, surface && !hasCave);
                    }
                }
            }
        }

        createMesh() {
            const geometry = new THREE.BoxGeometry(1, 1, 1);
            const material = new THREE.MeshPhongMaterial({ color });
            const mesh = new THREE.InstancedMesh(geometry, material, chunkSize * chunkSize * chunkSize);
            
            let count = 0;
            const matrix = new THREE.Matrix4();
            const scale = new THREE.Matrix4().makeScale(1, 1, 1);
            
            for (let x = 0; x < chunkSize; x++) {
                for (let y = 0; y < chunkSize; y++) {
                    for (let z = 0; z < chunkSize; z++) {
                        if (this.getVoxel(x, y, z)) {
                            const worldX = (this.position.x * chunkSize + x);
                            const worldY = (this.position.y * chunkSize + y);
                            const worldZ = (this.position.z * chunkSize + z);
                            
                            matrix.makeTranslation(worldX, worldY, worldZ);
                            matrix.multiply(scale);
                            mesh.setMatrixAt(count, matrix);
                            count++;
                        }
                    }
                }
            }

            mesh.count = count;
            mesh.instanceMatrix.needsUpdate = true;
            return mesh;
        }

        addSmoothVoxel(x, y, z, positions, normals, indices, vertexIndex) {
            // Add smoothed vertices with interpolated positions
            const smooth = 0.1; // Smoothing factor
            
            for (let dx = -1; dx <= 1; dx += 2) {
                for (let dy = -1; dy <= 1; dy += 2) {
                    for (let dz = -1; dz <= 1; dz += 2) {
                        const nx = x + dx * smooth;
                        const ny = y + dy * smooth;
                        const nz = z + dz * smooth;
                        
                        positions.push(nx, ny, nz);
                        normals.push(dx, dy, dz);
                    }
                }
            }

            // Add indices for smoothed faces
            this.addSmoothFaces(indices, vertexIndex);
        }

        addSmoothFaces(indices, vertexIndex) {
            // Add triangles for each face with smooth interpolation
            const faces = [
                [0, 1, 2], [2, 1, 3], // front
                [4, 6, 5], [6, 7, 5], // back
                [0, 4, 1], [1, 4, 5], // left
                [2, 3, 6], [3, 7, 6], // right
                [0, 2, 4], [2, 6, 4], // top
                [1, 5, 3], [3, 5, 7]  // bottom
            ];

            faces.forEach(face => {
                face.forEach(index => {
                    indices.push(vertexIndex + index);
                });
            });
        }
    }

    function updateChunks(cameraPos) {
        if (!cameraPos) return;

        const chunkX = Math.floor(cameraPos.x / (chunkSize * voxelSize));
        const chunkZ = Math.floor(cameraPos.z / (chunkSize * voxelSize));

        // Generate chunks in vertical layers
        for (let y = -1; y < 2; y++) {
            for (let x = -renderDistance; x <= renderDistance; x++) {
                for (let z = -renderDistance; z <= renderDistance; z++) {
                    const cx = chunkX + x;
                    const cy = y;
                    const cz = chunkZ + z;
                    const key = `${cx},${cy},${cz}`;

                    if (!meshes.has(key)) {
                        const chunk = new VoxelChunk(cx, cy, cz);
                        chunk.generate();
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
            mesh.geometry.dispose();
            mesh.material.dispose();
        });
    });
</script>
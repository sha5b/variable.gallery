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
            for (let x = 0; x < chunkSize; x++) {
                for (let z = 0; z < chunkSize; z++) {
                    // Generate a height value for this x,z coordinate
                    const worldX = (this.position.x * chunkSize + x) * voxelSize;
                    const worldZ = (this.position.z * chunkSize + z) * voxelSize;
                    
                    // Base terrain height (normalized to 0-chunkSize)
                    const baseHeight = Math.floor((noise3D(worldX * 0.02, 0, worldZ * 0.02) + 1) * chunkSize * 0.3);
                    
                    // Fill from bottom to height
                    for (let y = 0; y < chunkSize; y++) {
                        const worldY = (this.position.y * chunkSize + y) * voxelSize;
                        
                        // Cave noise
                        const cave = noise3D(worldX * 0.05, worldY * 0.05, worldZ * 0.05);
                        const detail = noise3D(worldX * 0.1, worldY * 0.1, worldZ * 0.1) * 0.3;
                        
                        // Determine if this should be solid
                        const heightDifference = y - baseHeight;
                        const isSolid = heightDifference < 0; // Below surface
                        const hasCave = cave + detail > 0.6;
                        
                        this.setVoxel(x, y, z, isSolid && !hasCave);
                    }
                }
            }
        }

        createMesh() {
            const geometry = new THREE.BufferGeometry();
            const vertices = [];
            const indices = [];
            let vertexIndex = 0;

            // Generate faces for visible voxels
            for (let x = 0; x < chunkSize; x++) {
                for (let y = 0; y < chunkSize; y++) {
                    for (let z = 0; z < chunkSize; z++) {
                        if (this.getVoxel(x, y, z)) {
                            // Only create faces where there's no adjacent voxel
                            if (!this.getVoxel(x + 1, y, z)) this.addFace('right', vertices, indices, x, y, z, vertexIndex++);
                            if (!this.getVoxel(x - 1, y, z)) this.addFace('left', vertices, indices, x, y, z, vertexIndex++);
                            if (!this.getVoxel(x, y + 1, z)) this.addFace('top', vertices, indices, x, y, z, vertexIndex++);
                            if (!this.getVoxel(x, y - 1, z)) this.addFace('bottom', vertices, indices, x, y, z, vertexIndex++);
                            if (!this.getVoxel(x, y, z + 1)) this.addFace('front', vertices, indices, x, y, z, vertexIndex++);
                            if (!this.getVoxel(x, y, z - 1)) this.addFace('back', vertices, indices, x, y, z, vertexIndex++);
                        }
                    }
                }
            }

            geometry.setAttribute('position', new THREE.Float32BufferAttribute(vertices, 3));
            geometry.setIndex(indices);
            geometry.computeVertexNormals();

            return geometry;
        }

        addFace(direction, vertices, indices, x, y, z, vertexIndex) {
            const worldX = (this.position.x * chunkSize + x) * voxelSize;
            const worldY = (this.position.y * chunkSize + y) * voxelSize;
            const worldZ = (this.position.z * chunkSize + z) * voxelSize;

            const v = [];
            switch (direction) {
                case 'right':
                    v.push(
                        worldX + voxelSize, worldY, worldZ,
                        worldX + voxelSize, worldY, worldZ + voxelSize,
                        worldX + voxelSize, worldY + voxelSize, worldZ + voxelSize,
                        worldX + voxelSize, worldY + voxelSize, worldZ
                    );
                    break;
                case 'left':
                    v.push(
                        worldX, worldY, worldZ + voxelSize,
                        worldX, worldY, worldZ,
                        worldX, worldY + voxelSize, worldZ,
                        worldX, worldY + voxelSize, worldZ + voxelSize
                    );
                    break;
                case 'top':
                    v.push(
                        worldX, worldY + voxelSize, worldZ,
                        worldX + voxelSize, worldY + voxelSize, worldZ,
                        worldX + voxelSize, worldY + voxelSize, worldZ + voxelSize,
                        worldX, worldY + voxelSize, worldZ + voxelSize
                    );
                    break;
                case 'bottom':
                    v.push(
                        worldX, worldY, worldZ + voxelSize,
                        worldX + voxelSize, worldY, worldZ + voxelSize,
                        worldX + voxelSize, worldY, worldZ,
                        worldX, worldY, worldZ
                    );
                    break;
                case 'front':
                    v.push(
                        worldX, worldY, worldZ + voxelSize,
                        worldX, worldY + voxelSize, worldZ + voxelSize,
                        worldX + voxelSize, worldY + voxelSize, worldZ + voxelSize,
                        worldX + voxelSize, worldY, worldZ + voxelSize
                    );
                    break;
                case 'back':
                    v.push(
                        worldX + voxelSize, worldY, worldZ,
                        worldX + voxelSize, worldY + voxelSize, worldZ,
                        worldX, worldY + voxelSize, worldZ,
                        worldX, worldY, worldZ
                    );
                    break;
            }

            vertices.push(...v);

            const baseIndex = vertexIndex * 4;
            indices.push(
                baseIndex, baseIndex + 1, baseIndex + 2,
                baseIndex, baseIndex + 2, baseIndex + 3
            );
        }
    }

    function generateChunkGeometry(chunkX, chunkZ) {
        // Create chunks vertically
        const chunks = [];
        for (let y = 0; y < 2; y++) { // Generate 2 vertical chunks
            const chunk = new VoxelChunk(chunkX, y, chunkZ);
            chunk.generate();
            chunks.push(chunk);
        }

        // Combine geometries
        const geometry = new THREE.BufferGeometry();
        const vertices = [];
        const indices = [];
        let vertexIndex = 0;

        chunks.forEach(chunk => {
            const chunkGeometry = chunk.createMesh();
            const chunkVertices = chunkGeometry.attributes.position.array;
            const chunkIndices = chunkGeometry.index.array;

            // Add vertices
            for (let i = 0; i < chunkVertices.length; i++) {
                vertices.push(chunkVertices[i]);
            }

            // Add indices with offset
            const indexOffset = vertexIndex;
            for (let i = 0; i < chunkIndices.length; i++) {
                indices.push(chunkIndices[i] + indexOffset);
            }

            vertexIndex += chunkVertices.length / 3;
        });

        geometry.setAttribute('position', new THREE.Float32BufferAttribute(vertices, 3));
        geometry.setIndex(indices);
        geometry.computeVertexNormals();

        return geometry;
    }

    function updateChunks(cameraPos) {
        if (!cameraPos) return;

        const chunkX = Math.floor(cameraPos.x / (chunkSize * voxelSize));
        const chunkZ = Math.floor(cameraPos.z / (chunkSize * voxelSize));

        // Calculate visible chunks
        for(let x = -renderDistance; x <= renderDistance; x++) {
            for(let z = -renderDistance; z <= renderDistance; z++) {
                const cx = chunkX + x;
                const cz = chunkZ + z;
                const key = `${cx},${cz}`;

                if(!meshes.has(key)) {
                    const geometry = generateChunkGeometry(cx, cz);
                    const material = new THREE.MeshPhongMaterial({
                        color: color,
                        wireframe: false,
                        flatShading: true,
                        side: THREE.DoubleSide,
                        shininess: 0
                    });

                    const mesh = new THREE.Mesh(geometry, material);
                    meshes.set(key, mesh);
                    $scene.add(mesh);
                }
            }
        }

        // Remove far chunks
        for(const [key, mesh] of meshes) {
            const [x, z] = key.split(',').map(Number);
            if(Math.abs(x - chunkX) > renderDistance || Math.abs(z - chunkZ) > renderDistance) {
                $scene.remove(mesh);
                mesh.geometry.dispose();
                mesh.material.dispose();
                meshes.delete(key);
            }
        }
    }

    $: if ($camera && $camera.position) {
        updateChunks($camera.position);
    }

    onMount(() => {
        updateChunks(new THREE.Vector3(0, 0, 0));
    });

    onDestroy(() => {
        for(const mesh of meshes.values()) {
            mesh.geometry.dispose();
            mesh.material.dispose();
            $scene.remove(mesh);
        }
        meshes.clear();
    });
</script>
<script>
    import * as THREE from 'three';
    import { createNoise2D } from 'simplex-noise';
    import { onMount, onDestroy } from 'svelte';
    import { scene, camera, chunks, chunkSize, renderDistance } from '../store/faunaStore';

    export let color = 0x3366ff;
    const noise2D = createNoise2D();
    let meshes = new Map();

    function generateChunkGeometry(chunkX, chunkZ) {
        const geometry = new THREE.BufferGeometry();
        const vertices = [];
        const indices = [];
        const segments = 20; // Detail level of each chunk

        for(let i = 0; i <= segments; i++) {
            for(let j = 0; j <= segments; j++) {
                const x = chunkX * chunkSize + (i / segments) * chunkSize;
                const z = chunkZ * chunkSize + (j / segments) * chunkSize;
                const y = noise2D(x * 0.02, z * 0.02) * 10;
                
                vertices.push(x, y, z);
            }
        }

        // Generate indices (same as before)
        for(let i = 0; i < segments; i++) {
            for(let j = 0; j < segments; j++) {
                const a = i * (segments + 1) + j;
                const b = a + 1;
                const c = a + (segments + 1);
                const d = c + 1;
                indices.push(a, b, c, b, d, c);
            }
        }

        geometry.setAttribute('position', new THREE.Float32BufferAttribute(vertices, 3));
        geometry.setIndex(indices);
        geometry.computeVertexNormals();

        return geometry;
    }

    function updateChunks(cameraPos) {
        if (!cameraPos) return;

        const chunkX = Math.floor(cameraPos.x / chunkSize);
        const chunkZ = Math.floor(cameraPos.z / chunkSize);

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
                        wireframe: true,
                        side: THREE.DoubleSide
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
        // Generate a single chunk at origin while waiting for camera
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
<script>
    import * as THREE from 'three';
    import { MarchingCubes } from 'three/examples/jsm/objects/MarchingCubes';
    import { createNoise3D } from 'simplex-noise';
    import { onMount, onDestroy } from 'svelte';
    import { scene, terrainConfig } from '../store/faunaStore';

    export let target = [0, 0, 0];
    
    const noise3D = createNoise3D();
    let chunks = new Map();
    let lastChunkX = null;
    let lastChunkZ = null;
    let config;

    terrainConfig.subscribe(value => {
        config = value;
        if (chunks.size > 0) {
            regenerateChunks();
        }
    });

    const material = new THREE.MeshPhongMaterial({
        color: 0x3366ff,
        specular: 0x111111,
        shininess: 100,
        side: THREE.DoubleSide  // Changed to DoubleSide for cave interiors
    });

    function createChunk(chunkX, chunkZ) {
        const key = `${chunkX},${chunkZ}`;
        
        if (chunks.has(key)) {
            return chunks.get(key);
        }

        const effect = new MarchingCubes(32, material, true, false);
        effect.position.set(
            chunkX * config.chunkSize,
            0,
            chunkZ * config.chunkSize
        );
        effect.scale.set(config.chunkSize, config.chunkSize, config.chunkSize);

        effect.reset();

        // Create a 3D grid of metaballs
        for (let x = 0; x <= config.gridSize; x++) {
            for (let y = 0; y <= config.gridSize; y++) {
                for (let z = 0; z <= config.gridSize; z++) {
                    const localX = x / config.gridSize;
                    const localY = y / config.gridSize;
                    const localZ = z / config.gridSize;
                    
                    const worldX = (chunkX * config.chunkSize) + (x * (config.chunkSize/config.gridSize));
                    const worldY = y * (config.chunkSize/config.gridSize);
                    const worldZ = (chunkZ * config.chunkSize) + (z * (config.chunkSize/config.gridSize));
                    
                    // Generate 3D noise value
                    const noiseValue = noise3D(
                        worldX * config.noiseScale,
                        worldY * config.noiseScale,
                        worldZ * config.noiseScale
                    );

                    // Only place metaball if noise value is above threshold
                    if (noiseValue > 0.1) {
                        effect.addBall(
                            localX,
                            localY,
                            localZ,
                            config.metaballRadius,
                            config.metaballStrength
                        );
                    }
                }
            }
        }

        effect.isolation = config.isolation;
        effect.update();
        $scene.add(effect);
        chunks.set(key, effect);
        return effect;
    }

    function regenerateChunks() {
        // Clean up existing chunks
        chunks.forEach(chunk => {
            $scene.remove(chunk);
            chunk.geometry?.dispose();
            chunk.material?.dispose();
        });
        chunks.clear();

        // Reset tracking variables
        lastChunkX = null;
        lastChunkZ = null;

        // Force update if we have a target
        if (target) {
            updateChunks(target[0], target[2]);
        }
    }

    function updateChunks(targetX, targetZ) {
        const centerChunkX = Math.floor(targetX / config.chunkSize);
        const centerChunkZ = Math.floor(targetZ / config.chunkSize);

        if (centerChunkX === lastChunkX && centerChunkZ === lastChunkZ) return;

        lastChunkX = centerChunkX;
        lastChunkZ = centerChunkZ;

        const neededChunks = new Set();

        for (let x = -config.renderDistance; x <= config.renderDistance; x++) {
            for (let z = -config.renderDistance; z <= config.renderDistance; z++) {
                const chunkX = centerChunkX + x;
                const chunkZ = centerChunkZ + z;
                const key = `${chunkX},${chunkZ}`;
                neededChunks.add(key);

                if (!chunks.has(key)) {
                    createChunk(chunkX, chunkZ);
                }
            }
        }

        for (const [key, chunk] of chunks) {
            if (!neededChunks.has(key)) {
                $scene.remove(chunk);
                chunk.geometry?.dispose();
                chunk.material?.dispose();
                chunks.delete(key);
            }
        }
    }

    $: if (target) {
        updateChunks(target[0], target[2]);
    }

    onDestroy(() => {
        chunks.forEach(chunk => {
            chunk.geometry?.dispose();
            chunk.material?.dispose();
            $scene.remove(chunk);
        });
        chunks.clear();
    });
</script>
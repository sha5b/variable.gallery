<script>
    import * as THREE from 'three';
    import { MarchingCubes } from 'three/examples/jsm/objects/MarchingCubes';
    import { createNoise3D } from 'simplex-noise';
    import { scene, terrainConfig } from '../store/faunaStore';

    export let target = [0, 0, 0];
    
    // Create a single noise instance with fixed seed for all chunks
    const SEED = 42; // Any fixed number will do
    const globalNoise = createNoise3D(() => SEED);
    
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
        side: THREE.DoubleSide
    });

    function getTerrainDensity(worldX, worldY, worldZ) {
        // Use absolute world coordinates for continuous noise
        const density = globalNoise(
            worldX * 0.02,  // Fixed frequency for testing
            worldY * 0.02,
            worldZ * 0.02
        );

        // Simple height falloff
        const heightFalloff = worldY * 0.03;  // Use world Y for consistent falloff
        return density - heightFalloff;
    }

    function createChunk(chunkX, chunkZ) {
        const key = `${chunkX},${chunkZ}`;
        
        if (chunks.has(key)) {
            return chunks.get(key);
        }

        const effect = new MarchingCubes(64, material, true, false);
        
        // Exact positioning
        effect.position.set(
            chunkX * config.chunkSize,
            0,
            chunkZ * config.chunkSize
        );
        
        effect.scale.set(
            config.chunkSize,
            config.chunkSize,
            config.chunkSize
        );

        effect.reset();

        // Include one extra cell overlap for continuity
        for (let x = -1; x <= config.gridSize + 1; x++) {
            for (let y = 0; y <= config.gridSize; y++) {
                for (let z = -1; z <= config.gridSize + 1; z++) {
                    // Calculate exact world position
                    const worldX = (chunkX * config.chunkSize) + (x * (config.chunkSize/config.gridSize));
                    const worldY = y * (config.chunkSize/config.gridSize);
                    const worldZ = (chunkZ * config.chunkSize) + (z * (config.chunkSize/config.gridSize));

                    const density = getTerrainDensity(worldX, worldY, worldZ);

                    if (density > 0) {
                        // Convert world position back to local coordinates
                        const localX = (x + 1) / (config.gridSize + 2);
                        const localY = y / config.gridSize;
                        const localZ = (z + 1) / (config.gridSize + 2);

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
        chunks.forEach(chunk => {
            $scene.remove(chunk);
            chunk.geometry?.dispose();
            chunk.material?.dispose();
        });
        chunks.clear();
        lastChunkX = null;
        lastChunkZ = null;
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
</script>
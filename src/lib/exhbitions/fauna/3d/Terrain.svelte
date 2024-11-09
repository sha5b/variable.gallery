<script>
    import * as THREE from 'three';
    import { MarchingCubes } from 'three/examples/jsm/objects/MarchingCubes.js';
    import { createNoise2D, createNoise3D } from 'simplex-noise';
    import { scene, terrainConfig } from '../store/faunaStore';
    import alea from 'alea';

    export let target = [0, 0, 0];
    
    // Move these outside of the component to be shared across all instances
    const GLOBAL_SEED = Math.random();
    const GLOBAL_PRNG = alea(GLOBAL_SEED);
    const GLOBAL_HEIGHT_NOISE = createNoise2D(GLOBAL_PRNG);
    const GLOBAL_DETAIL_NOISE = createNoise2D(GLOBAL_PRNG);
    const GLOBAL_CAVE_NOISE = createNoise3D(GLOBAL_PRNG);

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
        side: THREE.DoubleSide,
        transparent: false,
        opacity: 1,
        flatShading: true
    });

    function shouldPlaceBlock(x, y, z) {
        const baseScale = config.noiseScale;
        
        // Single 3D noise for simplicity and consistency
        const density = GLOBAL_CAVE_NOISE(
            x * baseScale,
            y * baseScale,
            z * baseScale
        );
        
        return density < 0.1; // Threshold for solid vs air
    }

    function createChunk(chunkX, chunkZ) {
        const key = `${chunkX},${chunkZ}`;
        
        // Strict duplicate checking
        if (chunks.has(key)) {
            console.warn(`Chunk already exists at ${chunkX}, ${chunkZ}`);
            return chunks.get(key);
        }

        const effect = new MarchingCubes(config.chunkSize, material, true, false);
        
        // Precise positioning
        const worldX = chunkX * config.gridSize;
        const worldZ = chunkZ * config.gridSize;
        
        effect.position.set(worldX, 0, worldZ);
        effect.scale.set(config.gridSize, config.gridSize, config.gridSize);

        effect.reset();

        // Sample points
        for (let x = 0; x < config.gridSize; x++) {
            for (let y = 0; y < config.gridSize; y++) {
                for (let z = 0; z < config.gridSize; z++) {
                    const worldBlockX = worldX + x;
                    const worldBlockY = y;
                    const worldBlockZ = worldZ + z;

                    if (shouldPlaceBlock(worldBlockX, worldBlockY, worldBlockZ)) {
                        effect.addBall(
                            x / config.gridSize,
                            y / config.gridSize,
                            z / config.gridSize,
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
        chunks.forEach(effect => {
            $scene.remove(effect);
            effect.geometry?.dispose();
            effect.material?.dispose();
        });
        chunks.clear();
        lastChunkX = null;
        lastChunkZ = null;
        if (target) {
            updateChunks(target[0], target[2]);
        }
    }

    function updateChunks(targetX, targetZ) {
        const centerChunkX = Math.floor(targetX / config.gridSize);
        const centerChunkZ = Math.floor(targetZ / config.gridSize);

        if (centerChunkX === lastChunkX && centerChunkZ === lastChunkZ) return;

        // Remove old chunks first
        for (const [key, chunk] of chunks) {
            const [chunkX, chunkZ] = key.split(',').map(Number);
            const distance = Math.max(
                Math.abs(chunkX - centerChunkX),
                Math.abs(chunkZ - centerChunkZ)
            );
            
            if (distance > config.renderDistance) {
                $scene.remove(chunk);
                chunk.geometry?.dispose();
                chunk.material?.dispose();
                chunks.delete(key);
            }
        }

        // Then create new chunks
        for (let x = -config.renderDistance; x <= config.renderDistance; x++) {
            for (let z = -config.renderDistance; z <= config.renderDistance; z++) {
                const chunkX = centerChunkX + x;
                const chunkZ = centerChunkZ + z;
                const key = `${chunkX},${chunkZ}`;

                if (!chunks.has(key)) {
                    createChunk(chunkX, chunkZ);
                }
            }
        }

        lastChunkX = centerChunkX;
        lastChunkZ = centerChunkZ;
    }

    $: if (target) {
        updateChunks(target[0], target[2]);
    }

    // Add this function before getHeightAt
    function getTerrainDensity(x, y, z) {
        const baseFreq = 0.02;
        
        // Ensure consistent sampling across chunk boundaries
        const sampledX = Math.floor(x * 100) / 100;
        const sampledZ = Math.floor(z * 100) / 100;
        
        // Base terrain height using 2D noise
        const heightNoise = globalNoise(
            sampledX * baseFreq,
            0,
            sampledZ * baseFreq
        );
        
        // Convert noise to height (0-1 to actual height)
        const baseHeight = (heightNoise + 1) * 0.5 * config.gridSize;
        
        // Add 3D noise for caves and overhangs
        const caveNoise = globalNoise(
            sampledX * baseFreq * 2,
            y * baseFreq * 2,
            sampledZ * baseFreq * 2
        );
        
        // Return density value (positive means inside terrain, negative means outside)
        return baseHeight - y - (caveNoise * 0.5);
    }

    // Add this method to get height at any world position
    export function getHeightAt(worldX, worldZ) {
        const chunkX = Math.floor(worldX / config.chunkSize);
        const chunkZ = Math.floor(worldZ / config.chunkSize);
        
        // Get local coordinates within chunk
        const localX = (worldX % config.chunkSize) / config.chunkSize;
        const localZ = (worldZ % config.chunkSize) / config.chunkSize;
        
        // Sample a few points vertically to find the surface
        for (let y = config.gridSize; y >= 0; y--) {
            const worldY = y * (config.chunkSize/config.gridSize);
            const density = getTerrainDensity(worldX, worldY, worldZ);
            
            if (density > 0) {
                return worldY;
            }
        }
        
        return 0; // Default height if no terrain found
    }
</script>
<script>
    import * as THREE from 'three';
    import { MarchingCubes } from 'three/examples/jsm/objects/MarchingCubes.js';
    import { createNoise2D, createNoise3D } from 'simplex-noise';
    import { scene, terrainConfig } from '../store/faunaStore';
    import alea from 'alea';

    export let target = [0, 0, 0];
    
    // Create separate noise functions for different features
    const seed = Math.random();
    const prng = alea(seed);
    
    // One noise for base terrain height
    const heightNoise = createNoise2D(prng);
    // Another for terrain details
    const detailNoise = createNoise2D(prng);
    // And one for caves
    const caveNoise = createNoise3D(prng);
    
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

    function getTerrainHeight(x, z) {
        const baseScale = 0.02;
        const detailScale = 0.04;
        
        // Get base terrain height
        const base = heightNoise(x * baseScale, z * baseScale);
        
        // Add some detail
        const detail = detailNoise(x * detailScale, z * detailScale) * 0.5;
        
        // Combine and normalize to 0-1 range
        return (base + detail + 2) * 0.25 * config.gridSize;
    }

    function shouldPlaceBlock(x, y, z) {
        // Get the height at this x,z coordinate
        const terrainHeight = getTerrainHeight(x, z);
        
        // If we're above the surface, no block
        if (y > terrainHeight) return false;
        
        // Add caves using 3D noise
        const caveScale = 0.05;
        const caveValue = caveNoise(
            x * caveScale,
            y * caveScale,
            z * caveScale
        );
        
        // More caves as we go deeper
        const depthFactor = 1 - (y / terrainHeight);
        const caveThreshold = 0.3 + (depthFactor * 0.2);
        
        // Return true if we should place a block here
        return caveValue < caveThreshold;
    }

    function createChunk(chunkX, chunkZ) {
        const key = `${chunkX},${chunkZ}`;
        
        if (chunks.has(key)) {
            return chunks.get(key);
        }

        const effect = new MarchingCubes(32, material, true, false);
        
        // Position the chunk in world space
        const worldX = chunkX * config.gridSize;
        const worldZ = chunkZ * config.gridSize;
        
        effect.position.set(worldX, 0, worldZ);
        effect.scale.set(config.gridSize, config.gridSize, config.gridSize);

        effect.reset();

        // Generate terrain with overlap for smooth transitions
        const overlap = Math.ceil(config.metaballRadius * 2);
        const gridSizeWithOverlap = config.gridSize + (overlap * 2);
        
        for (let x = -overlap; x < config.gridSize + overlap; x++) {
            for (let y = 0; y < config.gridSize; y++) {
                for (let z = -overlap; z < config.gridSize + overlap; z++) {
                    // Get world coordinates
                    const worldBlockX = worldX + x;
                    const worldBlockY = y;
                    const worldBlockZ = worldZ + z;

                    if (shouldPlaceBlock(worldBlockX, worldBlockY, worldBlockZ)) {
                        // Convert to local coordinates (0-1 range)
                        const localX = (x + overlap) / gridSizeWithOverlap;
                        const localY = y / config.gridSize;
                        const localZ = (z + overlap) / gridSizeWithOverlap;

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
        const centerChunkX = Math.floor(targetX / config.gridSize);
        const centerChunkZ = Math.floor(targetZ / config.gridSize);

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
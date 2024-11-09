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
        color: config.color,
        specular: config.specular,
        shininess: config.shininess,
        side: THREE.DoubleSide,
        transparent: false,
        opacity: 1,
        flatShading: true
    });

    function getTerrainHeight(x, z) {
        const baseScale = config.noiseScale;
        const detailScale = config.noiseScale * 2;
        
        const base = GLOBAL_HEIGHT_NOISE(x * baseScale, z * baseScale);
        const detail = GLOBAL_DETAIL_NOISE(x * detailScale, z * detailScale) * 0.5;
        
        return (base + detail + 2) * 0.25 * config.gridSize;
    }

    function shouldPlaceBlock(x, y, z) {
        const terrainHeight = getTerrainHeight(x, z);
        
        if (y > terrainHeight) return false;
        
        const caveScale = config.noiseScale * 2.5;
        const caveValue = GLOBAL_CAVE_NOISE(
            x * caveScale,
            y * caveScale,
            z * caveScale
        );
        
        const depthFactor = 1 - (y / terrainHeight);
        const caveThreshold = 0.3 + (depthFactor * 0.2);
        
        return caveValue < caveThreshold;
    }

    function createChunk(chunkX, chunkZ) {
        const key = `${chunkX},${chunkZ}`;
        
        if (chunks.has(key)) {
            return chunks.get(key);
        }

        const effect = new MarchingCubes(config.chunkSize, material, true, false);
        
        const worldX = chunkX * config.gridSize;
        const worldZ = chunkZ * config.gridSize;
        
        effect.position.set(worldX, 0, worldZ);
        effect.scale.set(config.gridSize, config.gridSize, config.gridSize);

        effect.reset();
        
        const overlap = Math.ceil(config.metaballRadius * 2);
        const gridSizeWithOverlap = config.gridSize + (overlap * 2);
        
        for (let x = -overlap; x < config.gridSize + overlap; x++) {
            for (let y = 0; y < config.gridSize; y++) {
                for (let z = -overlap; z < config.gridSize + overlap; z++) {
                    const worldBlockX = worldX + x;
                    const worldBlockY = y;
                    const worldBlockZ = worldZ + z;

                    if (shouldPlaceBlock(worldBlockX, worldBlockY, worldBlockZ)) {
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

    function getTerrainDensity(x, y, z) {
        const baseFreq = 0.02;
        
        const sampledX = Math.floor(x * 100) / 100;
        const sampledZ = Math.floor(z * 100) / 100;
        
        const heightNoise = globalNoise(
            sampledX * baseFreq,
            0,
            sampledZ * baseFreq
        );
        
        const baseHeight = (heightNoise + 1) * 0.5 * config.gridSize;
        
        const caveNoise = globalNoise(
            sampledX * baseFreq * 2,
            y * baseFreq * 2,
            sampledZ * baseFreq * 2
        );
        
        return baseHeight - y - (caveNoise * 0.5);
    }

    export function getHeightAt(worldX, worldZ) {
        const chunkX = Math.floor(worldX / config.chunkSize);
        const chunkZ = Math.floor(worldZ / config.chunkSize);
        
        const localX = (worldX % config.chunkSize) / config.chunkSize;
        const localZ = (worldZ % config.chunkSize) / config.chunkSize;
        
        for (let y = config.gridSize; y >= 0; y--) {
            const worldY = y * (config.chunkSize/config.gridSize);
            const density = getTerrainDensity(worldX, worldY, worldZ);
            
            if (density > 0) {
                return worldY;
            }
        }
        
        return 0;
    }
</script>
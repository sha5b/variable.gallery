import * as THREE from 'three';
import { writable } from 'svelte/store';

export const scene = writable(new THREE.Scene());
export const camera = writable(null);

// Terrain configuration
export const terrainConfig = writable({
    // Chunk settings
    chunkSize: 32,
    renderDistance: 2,

    // Metaball settings
    gridSize: 32,         // Increased to match image
    metaballRadius: 0.05,  // Decreased for finer detail
    metaballStrength: 10,  // Increased for stronger connections
    isolation: 2.0,        // Increased for sharper surface

    // Noise settings
    noiseScale: 0.20,     // Adjusted for terrain scale
    heightScale: 0.1,

    // Visual settings
    color: 0x3366ff,
    shininess: 100,
    specular: 0x111111
});

// Camera settings
export const cameraConfig = writable({
    mode: 'orbit',
    speed: 10,
    autoRotate: true,
    radius: 50,
    height: 25
});

function updateChunks(targetX, targetZ) {
    const centerChunkX = Math.floor(targetX / config.chunkSize);
    const centerChunkZ = Math.floor(targetZ / config.chunkSize);

    // Only update if we moved to a new chunk
    if (centerChunkX === lastChunkX && centerChunkZ === lastChunkZ) return;

    // Create chunks in render distance
    for (let x = -config.renderDistance; x <= config.renderDistance; x++) {
        for (let z = -config.renderDistance; z <= config.renderDistance; z++) {
            const chunkX = centerChunkX + x;
            const chunkZ = centerChunkZ + z;
            createChunk(chunkX, chunkZ);
        }
    }

    // Remove chunks out of range
    // ... cleanup code ...
}


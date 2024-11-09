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
    gridSize: 8,         // Number of metaballs per side
    metaballRadius: 0.3, // Size of each metaball
    metaballStrength: 8, // Field strength
    isolation: 20,       // Surface threshold
    
    // Noise settings
    noiseScale: 0.1,
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
    height: 50
});


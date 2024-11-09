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
    gridSize: 32,
    metaballRadius: 0.1,
    metaballStrength: 8,
    isolation: 1.5,

    // Visual settings
    color: 0xffffff,
    shininess: 100,
    specular: 0x111111
});

// Camera settings
export const cameraConfig = writable({
    mode: 'orbit',
    speed: 10,
    autoRotate: true,
    radius: 100,
    height: 50
});


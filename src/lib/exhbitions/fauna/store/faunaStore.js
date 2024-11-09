import * as THREE from 'three';
import { writable } from 'svelte/store';

export const scene = writable(new THREE.Scene());
export const camera = writable(null);

// Terrain configuration
export const chunkSize = 20;             // Even smaller chunks
export const renderDistance = 5;         // See more chunks

export const terrainConfig = {
    resolution: 24,                     // Higher resolution for smoother balls
    metaballCount: 4,                   // Very few metaballs to clearly see them
    metaballSize: 0.2,                  // Tiny metaballs
    metaballStrength: 2.0,             // Stronger field effect
    animationSpeed: 0.1,               // Slower animation to track movement
    isolation: 20,                      // Much lower isolation for more defined shapes
    overlap: 0.5,                      // More overlap to see chunk blending
    noiseScale: 0.1,                   // Larger noise scale
    noiseOctaves: 1,                   // Single octave for clearest pattern
    heightScale: 0.2,                  // Very subtle height variation
    
    // New parameters to try
    metaballSpacing: 0.3,              // Space between metaballs
    boundarySpheres: 6,                // Number of boundary spheres
    boundaryStrength: 3.0,             // Strong boundary effect
    subtractValue: 5                    // Lower subtract value for bigger spheres
};
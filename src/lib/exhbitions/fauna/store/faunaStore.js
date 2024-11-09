import * as THREE from 'three';
import { writable } from 'svelte/store';

export const scene = writable(new THREE.Scene());
export const camera = writable(null);
export const chunkSize = 16;  // Smaller chunks for better detail
export const renderDistance = 3;
export const voxelSize = 1;   // Set to 1 to remove gapss
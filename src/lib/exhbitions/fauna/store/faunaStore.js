import * as THREE from 'three';
import { writable } from 'svelte/store';

export const scene = writable(new THREE.Scene());
export const camera = writable(null);
export const chunkSize = 32; // Larger chunks for more continuous terrain
export const renderDistance = 2;
export const voxelSize = 2; // Larger voxels for lower poly look
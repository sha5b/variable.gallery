import * as THREE from 'three';
import { writable } from 'svelte/store';

export const scene = writable(new THREE.Scene());
export const camera = writable(null);
export const chunks = writable(new Map()); // Store for terrain chunks
export const chunkSize = 50; // Size of each chunk
export const renderDistance = 2; // How many chunks to render in each direction
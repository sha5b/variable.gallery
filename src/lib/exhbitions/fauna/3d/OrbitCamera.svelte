<script>
    import * as THREE from 'three';
    import { onMount, onDestroy } from 'svelte';
    import { camera } from '../store/faunaStore';

    export let target = [0, 0, 0];
    export let mode = 'orbit';
    export let speed = 100;
    export let radius = 5;
    export let height = 2;
    export let autoRotate = true;
    export let minRadius = 5;   // Minimum zoom distance
    export let maxRadius = 100; // Maximum zoom distance

    let cameraInstance;
    let targetVector;
    let angle = 0;
    let animationId;

    // Function to handle zoom
    export function zoom(delta) {
        radius = Math.max(minRadius, Math.min(maxRadius, radius + delta));
    }

    onMount(() => {
        cameraInstance = new THREE.PerspectiveCamera(75, window.innerWidth / window.innerHeight, 0.1, 1000);
        targetVector = new THREE.Vector3(...target);
        
        // Set initial position
        cameraInstance.position.set(0, height, radius);
        cameraInstance.lookAt(targetVector);
        
        // Set camera in store immediately
        camera.set(cameraInstance);
        
        function animate() {
            if (autoRotate) {
                angle += speed * 0.001;
            }
            
            if (mode === 'orbit') {
                cameraInstance.position.x = targetVector.x + radius * Math.cos(angle);
                cameraInstance.position.z = targetVector.z + radius * Math.sin(angle);
                cameraInstance.position.y = targetVector.y + height;
            } else {
                cameraInstance.position.x = targetVector.x + radius * Math.sin(angle);
                cameraInstance.position.z = radius;
                cameraInstance.position.y = height;
            }
            
            cameraInstance.lookAt(targetVector);
            camera.set(cameraInstance);
            animationId = requestAnimationFrame(animate);
        }
        
        animate();
    });

    $: if (cameraInstance && radius) {
        // Update camera position when radius changes
        if (mode === 'orbit') {
            cameraInstance.position.x = targetVector.x + radius * Math.cos(angle);
            cameraInstance.position.z = targetVector.z + radius * Math.sin(angle);
        } else {
            cameraInstance.position.x = targetVector.x + radius * Math.sin(angle);
            cameraInstance.position.z = radius;
        }
        cameraInstance.lookAt(targetVector);
    }

    onDestroy(() => {
        if (animationId) {
            cancelAnimationFrame(animationId);
        }
        camera.set(null);
    });
</script>
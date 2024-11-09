<script>
    import * as THREE from 'three';
    import { onMount, onDestroy } from 'svelte';
    import { camera } from '../store/faunaStore';

    export let target = [0, 0, 0];
    export let mode = 'orbit';
    export let speed = 100;
    export let radius = 50;
    export let height = 50;
    export let autoRotate = true;

    let cameraInstance;
    let targetVector;
    let angle = 0;
    let animationId;

    onMount(() => {
        cameraInstance = new THREE.PerspectiveCamera(75, window.innerWidth / window.innerHeight, 0.1, 1000);
        targetVector = new THREE.Vector3(...target);
        
        function animate() {
            if (autoRotate) {
                angle += speed * 0.0001;
            }
            
            if (mode === 'orbit') {
                cameraInstance.position.x = radius * Math.cos(angle);
                cameraInstance.position.z = radius * Math.sin(angle);
                cameraInstance.position.y = height;
                cameraInstance.lookAt(targetVector);
            } else {
                // Pan mode
                const panSpeed = speed * 0.005;
                cameraInstance.position.x += Math.cos(angle) * panSpeed;
                cameraInstance.position.z += Math.sin(angle) * panSpeed;
                cameraInstance.position.y = height;
                
                // Look ahead
                const lookTarget = new THREE.Vector3(
                    cameraInstance.position.x + Math.cos(angle) * 10,
                    0,
                    cameraInstance.position.z + Math.sin(angle) * 10
                );
                cameraInstance.lookAt(lookTarget);
            }
            
            camera.set(cameraInstance);
            animationId = requestAnimationFrame(animate);
        }
        
        animate();
    });

    onDestroy(() => {
        if (animationId) {
            cancelAnimationFrame(animationId);
        }
    });
</script>
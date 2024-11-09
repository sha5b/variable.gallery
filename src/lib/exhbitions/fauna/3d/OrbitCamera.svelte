<script>
    import * as THREE from 'three';
    import { onMount, onDestroy } from 'svelte';
    import { camera, cameraConfig } from '../store/faunaStore';

    export let target = [0, 0, 0];
    
    let cameraInstance;
    let targetVector;
    let angle = 0;
    let animationId;

    $: if (target && targetVector) {
        targetVector.set(...target);
    }

    onMount(() => {
        cameraInstance = new THREE.PerspectiveCamera(75, window.innerWidth / window.innerHeight, 0.1, 1000);
        targetVector = new THREE.Vector3(...target);
        
        function animate() {
            if ($cameraConfig.autoRotate) {
                angle += $cameraConfig.speed * 0.0001;
            }
            
            if ($cameraConfig.mode === 'orbit') {
                cameraInstance.position.x = $cameraConfig.radius * Math.cos(angle);
                cameraInstance.position.z = $cameraConfig.radius * Math.sin(angle);
                cameraInstance.position.y = $cameraConfig.height;
                cameraInstance.lookAt(targetVector);
            } else {
                const panSpeed = $cameraConfig.speed * 0.005;
                cameraInstance.position.x += Math.cos(angle) * panSpeed;
                cameraInstance.position.z += Math.sin(angle) * panSpeed;
                cameraInstance.position.y = $cameraConfig.height;
                
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
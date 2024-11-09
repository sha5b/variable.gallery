<script>
    import { terrainConfig, cameraConfig } from '../store/faunaStore';

    // Local copies for two-way binding
    let terrain;
    let camera;

    terrainConfig.subscribe(value => terrain = value);
    cameraConfig.subscribe(value => camera = value);

    function updateTerrain() {
        terrainConfig.set(terrain);
    }

    function updateCamera() {
        cameraConfig.set(camera);
    }
</script>


<div class="controls">
    <div class="camera-controls">
        <button on:click={() => camera.speed = Math.min(50, camera.speed + 5)}>Faster</button>
        <button on:click={() => camera.autoRotate = !camera.autoRotate}>
            {camera.autoRotate ? 'Stop' : 'Start'}
        </button>
        <button on:click={() => camera.speed = Math.max(5, camera.speed - 5)}>Slower</button>
        <button on:click={() => camera.mode = camera.mode === 'orbit' ? 'pan' : 'orbit'}>
            {camera.mode === 'orbit' ? 'Pan' : 'Orbit'}
        </button>
        <button on:click={() => camera.radius = Math.max(20, camera.radius - 10)}>Zoom In</button>
        <button on:click={() => camera.radius = Math.min(200, camera.radius + 10)}>Zoom Out</button>
    </div>

    <div class="terrain-controls">
        <!-- Terrain controls here -->
    </div>
</div>

<style>
    .controls {
        position: fixed;
        bottom: 20px;
        left: 50%;
        transform: translateX(-50%);
        display: flex;
        flex-direction: column;
        gap: 10px;
        z-index: 1000;
    }

    .camera-controls {
        display: flex;
        gap: 10px;
    }

    button {
        padding: 8px 16px;
        background: #333;
        color: white;
        border: none;
        border-radius: 4px;
        cursor: pointer;
    }

    button:hover {
        background: #444;
    }
</style> 
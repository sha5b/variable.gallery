<script>
    import { terrainConfig, cameraConfig } from '../store/faunaStore';

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
        <label>
            Grid Size
            <input type="range" 
                min="8" max="32" step="4" 
                bind:value={terrain.gridSize} 
                on:change={updateTerrain}
            />
            {terrain.gridSize}
        </label>

        <label>
            Metaball Radius
            <input type="range" 
                min="0.05" max="0.3" step="0.05" 
                bind:value={terrain.metaballRadius} 
                on:change={updateTerrain}
            />
            {terrain.metaballRadius.toFixed(2)}
        </label>

        <label>
            Metaball Strength
            <input type="range" 
                min="1" max="10" step="1" 
                bind:value={terrain.metaballStrength} 
                on:change={updateTerrain}
            />
            {terrain.metaballStrength}
        </label>

        <label>
            Isolation
            <input type="range" 
                min="0.5" max="2" step="0.1" 
                bind:value={terrain.isolation} 
                on:change={updateTerrain}
            />
            {terrain.isolation.toFixed(1)}
        </label>

        <label>
            Noise Scale
            <input type="range" 
                min="0.01" max="0.2" step="0.01" 
                bind:value={terrain.noiseScale} 
                on:change={updateTerrain}
            />
            {terrain.noiseScale.toFixed(2)}
        </label>
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
        gap: 20px;
        z-index: 1000;
        background: rgba(0, 0, 0, 0.7);
        padding: 20px;
        border-radius: 8px;
    }

    .camera-controls, .terrain-controls {
        display: flex;
        gap: 10px;
    }

    .terrain-controls {
        flex-direction: column;
    }

    label {
        display: flex;
        flex-direction: column;
        color: white;
        font-size: 14px;
    }

    input[type="range"] {
        width: 200px;
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
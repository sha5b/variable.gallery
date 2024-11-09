<script>
    import { terrainConfig } from '../store/faunaStore';
    
    let terrain = {
        isolation: 1.5,
        noiseScale: 0.02,
        metaballRadius: 0.1,
        metaballStrength: 8
    };

    // Subscribe to terrainConfig and update local values
    terrainConfig.subscribe(config => {
        terrain = {
            isolation: config.isolation ?? terrain.isolation,
            noiseScale: config.noiseScale ?? terrain.noiseScale,
            metaballRadius: config.metaballRadius ?? terrain.metaballRadius,
            metaballStrength: config.metaballStrength ?? terrain.metaballStrength
        };
    });

    function updateTerrain() {
        terrainConfig.update(config => ({
            ...config,
            isolation: terrain.isolation,
            noiseScale: terrain.noiseScale,
            metaballRadius: terrain.metaballRadius,
            metaballStrength: terrain.metaballStrength
        }));
    }
</script>

<div class="controls">
    <div class="terrain-controls">
        <label>
            Isolation
            <input type="range" 
                min="0.1" max="5" step="0.1" 
                bind:value={terrain.isolation} 
                on:change={updateTerrain}
            />
            {terrain.isolation?.toFixed(1)}
        </label>

        <label>
            Noise Scale
            <input type="range" 
                min="0.01" max="0.2" step="0.01" 
                bind:value={terrain.noiseScale} 
                on:change={updateTerrain}
            />
            {terrain.noiseScale?.toFixed(2)}
        </label>

        <label>
            Metaball Radius
            <input type="range" 
                min="0.01" max="0.2" step="0.01" 
                bind:value={terrain.metaballRadius} 
                on:change={updateTerrain}
            />
            {terrain.metaballRadius?.toFixed(2)}
        </label>

        <label>
            Metaball Strength
            <input type="range" 
                min="1" max="20" step="1" 
                bind:value={terrain.metaballStrength} 
                on:change={updateTerrain}
            />
            {terrain.metaballStrength?.toFixed(0)}
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

    .terrain-controls {
        flex-direction: column;
        gap: 10px;
        display: flex;
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
</style> 
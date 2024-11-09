import { createNoise3D } from 'simplex-noise';

export class TerrainGenerator {
    constructor(seed = Math.random()) {
        this.noise3D = createNoise3D();
        
        // Different noise layers for terrain features
        this.baseNoise = createNoise3D();
        this.caveNoise = createNoise3D();
    }

    // Get terrain height at a point (like Minecraft's surface)
    getBaseHeight(x, z, config) {
        const scale = config.noiseScale;
        
        // Base terrain height
        let height = this.baseNoise(x * scale, 0, z * scale);
        
        // Add some larger features
        height += this.baseNoise(x * scale * 0.5, 0, z * scale * 0.5) * 2;
        
        // Normalize to 0-1 range and scale
        return (height + 1) * 0.5 * config.gridSize;
    }

    // Determine if a point should have a metaball (cave system)
    shouldPlaceMetaball(x, y, z, config) {
        const scale = config.noiseScale;
        
        // Get base terrain height
        const surfaceHeight = this.getBaseHeight(x, z, config);
        
        // Always place terrain above surface
        if (y > surfaceHeight) return false;
        
        // Cave noise
        const caveNoise = this.caveNoise(
            x * scale * 2,
            y * scale * 2,
            z * scale * 2
        );
        
        // Create more caves deeper underground
        const depthFactor = 1 - (y / surfaceHeight);
        const caveThreshold = 0.3 + (depthFactor * 0.2);
        
        return caveNoise > caveThreshold;
    }
} 
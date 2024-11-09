<script>
	import Scene from './3d/Scene.svelte';
	import Box from './3d/Box.svelte';
	import OrbitCamera from './3d/OrbitCamera.svelte';
    import Terrain from './3d/Terrain.svelte';
    import Light from './3d/Light.svelte';

	let cameraTarget = [0, 0, 0];
	let cameraMode = 'orbit';
	let cameraSpeed = 20;
	let autoRotate = true;
	let cameraRadius = 50;
	let height = 10;

	function handleSpeedChange(delta) {
		cameraSpeed = Math.max(5, Math.min(50, cameraSpeed + delta));
	}

	function handleZoomIn() {
		cameraRadius = Math.max(20, cameraRadius - 10);
	}

	function handleZoomOut() {
		cameraRadius = Math.min(200, cameraRadius + 10);
	}
</script>

<Scene>
    <Light />
    <Terrain 
        size={100}
        segments={50}
        height={10}
        color={0x3366ff}
    />
	<Box position={[0, 15, 0]} color={0x00ff00} />
	<OrbitCamera
		target={[0, 0, 0]}
		mode={cameraMode}
		speed={cameraSpeed}
		radius={cameraRadius}
		height={50}
		{autoRotate}
	/>
</Scene>

<div class="controls">
	<button on:click={() => handleSpeedChange(5)}>Faster</button>
	<button on:click={() => (autoRotate = !autoRotate)}>
		{autoRotate ? 'Stop' : 'Start'}
	</button>
	<button on:click={() => handleSpeedChange(-5)}>Slower</button>
	<button on:click={() => (cameraMode = cameraMode === 'orbit' ? 'pan' : 'orbit')}>
		{cameraMode === 'orbit' ? 'Pan' : 'Orbit'}
	</button>
	<button on:click={handleZoomIn}>Zoom In</button>
	<button on:click={handleZoomOut}>Zoom Out</button>
</div>

<style>
	.controls {
		position: fixed;
		bottom: 20px;
		left: 50%;
		transform: translateX(-50%);
		display: flex;
		gap: 10px;
		z-index: 1000;
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

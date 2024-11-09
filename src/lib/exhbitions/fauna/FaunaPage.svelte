<script>
	import Scene from './3d/Scene.svelte';
	import Box from './3d/Box.svelte';
	import OrbitCamera from './3d/OrbitCamera.svelte';
    import Terrain from './3d/Terrain.svelte';
    import Light from './3d/Light.svelte';

	let cameraTarget = [0, 0, 0];
	let cameraMode = 'orbit';
	let cameraSpeed = 100;
	let autoRotate = true;
	let radius = 20;
	let height = 10;

	function handleZoomIn() {
		radius = Math.max(5, radius - 5);
	}

	function handleZoomOut() {
		radius = Math.min(100, radius + 5);
	}
</script>

<Scene>
    <Light />
    <Terrain 
        size={50}
        color={0x3366ff}
    />
	<Box position={[0, 0, 0]} color={0x00ff00} />
	<OrbitCamera
		target={cameraTarget}
		mode={cameraMode}
		speed={cameraSpeed}
		{radius}
		{height}
		{autoRotate}
	/>
</Scene>

<div class="controls">
	<button on:click={() => (cameraSpeed += 50)}>Faster</button>
	<button on:click={() => (autoRotate = !autoRotate)}>
		{autoRotate ? 'Stop' : 'Start'}
	</button>
	<button on:click={() => (cameraSpeed -= 50)}>Slower</button>
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

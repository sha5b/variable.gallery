<script>
	import Scene from './3d/Scene.svelte';
	import Box from './3d/Box.svelte';
	import OrbitCamera from './3d/OrbitCamera.svelte';
    import Terrain from './3d/Terrain.svelte';
    import Light from './3d/Light.svelte';
    import ControlPanel from './3d/ControlPanel.svelte';

	let cameraTarget = [0, 0, 0];

	function updateCameraTarget(newPosition) {
		cameraTarget = newPosition;
	}
</script>

<Scene>
    <Light />
    <Terrain target={cameraTarget} />
    <Box 
        position={[0, 0, 0]} 
        color={0x00ff00} 
        onPositionChange={updateCameraTarget}
    />
    <OrbitCamera target={cameraTarget} />
</Scene>

<ControlPanel />



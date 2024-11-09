<script>
	import Scene from './3d/Scene.svelte';
	import Box from './3d/Box.svelte';
	import OrbitCamera from './3d/OrbitCamera.svelte';
    import Terrain from './3d/Terrain.svelte';
    import Light from './3d/Light.svelte';
    import ControlPanel from './3d/ControlPanel.svelte';
    import Skybox from './3d/Skybox.svelte';
    import Fog from './3d/Fog.svelte';

	let cameraTarget = [0, 0, 0];

	function updateCameraTarget(newPosition) {
		cameraTarget = newPosition;
	}
</script>

<Scene>
    <Skybox />
    <Fog />
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



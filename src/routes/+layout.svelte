<script>
	import '../app.css';

	import Footer from '$lib/components/navigation/Footer.svelte';
	import Navbar from '$lib/components/navigation/Navbar.svelte';
	import CartSlider from '$lib/components/navigation/CartSlider.svelte';
	import { isCartSliderOpen, closeCartSlider } from '$lib/stores/cartStore';

	export let data;
	const { artists } = data;
	
	$: isOpen = $isCartSliderOpen;

	function closeCart() {
		closeCartSlider(); // Close the cart when clicking on the overlay
	}
	console
</script>

<div class="relative min-h-screen flex flex-col">
	<!-- Navbar and Cart Overlay -->
	<Navbar  {artists}/>
	<div
		class={`fixed inset-0 bg-black bg-opacity-50 transition-opacity duration-300 ease-in-out ${isOpen ? 'visible z-50 opacity-100' : 'invisible opacity-0'}`}
		on:click={closeCart}
	></div>

	<!-- Main Content Area -->
	<div class="flex-grow flex ">
		<div class={`flex-grow transition-all duration-300 ${isOpen ? 'mr-[300px]' : 'mr-0'}`}>
			<slot /> <!-- Page-specific content goes here -->
		</div>

		<!-- Cart Slider -->
		<CartSlider bind:isOpen />
	</div>

	<!-- Footer that appears after the main content -->
	<Footer />
</div>


<style>
	/* Optional: Add styling for a smoother layout */
	.flex-grow {
		min-height: 100%;
	}
</style>

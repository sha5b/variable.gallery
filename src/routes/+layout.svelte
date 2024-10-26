<script>
	import "../app.css";
	import Navbar from '$lib/components/Navbar.svelte';
	import CartSlider from '$lib/components/CartSlider.svelte';
	import { isCartSliderOpen, closeCartSlider } from '$lib/stores/cartSliderStore';
  
	// Reactive store binding for cart slider visibility
	$: isOpen = $isCartSliderOpen;
  
	function closeCart() {
	  closeCartSlider(); // Close the cart when clicking on the overlay
	}
  </script>
  
  <div class="relative h-screen pt-16">
	<!-- Overlay for background dimming when the cart slider is open -->
	<div
	  class={`fixed inset-0 bg-black bg-opacity-50 transition-opacity duration-300 ease-in-out ${isOpen ? 'opacity-100 visible z-50' : 'opacity-0 invisible'}`}
	  on:click={closeCart}>
	</div>
  
	<div class="flex w-full h-screen transition-all duration-300 ease-in-out">
	  <!-- Main Content Area with Navbar and Slot for page content -->
	  <div class={`flex-grow transition-all duration-300 ${isOpen ? 'mr-[300px]' : 'mr-0'}`}>
		<Navbar />
		<slot /> <!-- Page-specific content goes here -->
	  </div>
  
	  <!-- Cart Slider -->
	  <CartSlider bind:isOpen />
	</div>
  </div>
  
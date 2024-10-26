<script>
	import { isCartSliderOpen, toggleCartSlider } from '$lib/stores/cartSliderStore';
	
	// Directly using the store's value for reactivity
	let isCartOpen;
  
	// Subscribe to the cart slider's open state reactively
	$: isCartSliderOpen.subscribe(value => {
	  isCartOpen = value;
	});
  
	// Function to handle cart icon click and toggle the cart slider
	function handleCartIconClick() {
	  toggleCartSlider(); // Toggling should always open or close on a single click
	}
  
	let isMenuOpen = false;
  
	function toggleMenu() {
	  isMenuOpen = !isMenuOpen;
	}
  </script>
  
  <nav class="fixed top-0 left-0 w-full z-50 flex justify-between items-center p-4 px-16 bg-white border-b border-gray-200">
	<div class="font-bold text-xl uppercase">
	  <a href="/" class="text-gray-800">MyShop</a>
	</div>
	
	<ul class={`flex gap-6 list-none transition-transform duration-300 ${isMenuOpen ? 'flex-col absolute top-16 right-0 w-48 p-6 bg-white border border-gray-200 rounded-lg' : 'hidden md:flex'}`}>
	  <li><a href="/shop" class="text-gray-800 hover:text-purple-500">Shop</a></li>
	  <li><a href="/about" class="text-gray-800 hover:text-purple-500">About</a></li>
	  <li><a href="/profile" class="text-gray-800 hover:text-purple-500">Profile</a></li>
	</ul>
	
	<div class="flex items-center">
	  <!-- Cart button that toggles the cart slider -->
	  <button class={`text-2xl ml-4 transition-colors ${isCartOpen ? 'text-purple-500' : 'text-gray-800'}`} on:click={handleCartIconClick}>
		🛒
	  </button>
	  
	  <!-- Hamburger Menu for smaller screens -->
	  <div class="md:hidden flex flex-col gap-1 cursor-pointer" on:click={toggleMenu}>
		<div class="w-6 h-[2px] bg-gray-800 transition-all duration-300"></div>
		<div class="w-6 h-[2px] bg-gray-800 transition-all duration-300"></div>
		<div class="w-6 h-[2px] bg-gray-800 transition-all duration-300"></div>
	  </div>
	</div>
  </nav>
  
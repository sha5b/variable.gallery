<script>
	import { isCartSliderOpen, toggleCartSlider } from '$lib/stores/cartSliderStore';
	import { cart } from '$lib/stores/cartStore'; // Import the cart store to access cart items

	let isCartOpen;

	// Subscribe to the cart slider's open state reactively
	$: isCartSliderOpen.subscribe(value => {
		isCartOpen = value;
	});

	// Function to handle cart icon click and toggle the cart slider
	function handleCartIconClick() {
		toggleCartSlider();
	}

	let isMenuOpen = false;

	function toggleMenu() {
		isMenuOpen = !isMenuOpen;
	}

	// Calculate total items in the cart
	let totalItems = 0;
	$: totalItems = $cart.reduce((sum, item) => sum + item.quantity, 0);
</script>

<nav class="fixed top-0 left-0 w-full z-50 flex justify-between items-center p-4 bg-white border-b border-gray-200 px-16">
	<!-- Left Aligned Site Name and Navigation Links -->
	<div class="flex items-center gap-8">
		<!-- Site Name -->
		<div class="text-sm font-semibold">
			<a href="/" class="text-gray-800 hover:text-purple-500">
				store.shahabned.xyz
			</a>
		</div>

		<!-- Navigation Links -->
		<ul class="flex gap-8 list-none">
			<li><a href="/shop" class="text-gray-800 hover:text-purple-500">Shop</a></li>
			<li><a href="/about" class="text-gray-800 hover:text-purple-500">About</a></li>
			<li><a href="/profile" class="text-gray-800 hover:text-purple-500">Profile</a></li>
		</ul>
	</div>

	<!-- Cart and Menu Button -->
	<div class="flex items-center relative">
		<!-- Cart button -->
		<button class={`text-2xl ml-4 transition-colors ${isCartOpen ? 'text-purple-500' : 'text-gray-800'}`} on:click={handleCartIconClick}>
			🛒
			<!-- Badge to show total items in cart -->
			{#if totalItems > 0}
				<span class="absolute -top-1 -right-3 bg-red-500 text-white text-xs rounded-full w-5 h-5 flex items-center justify-center">
					{totalItems}
				</span>
			{/if}
		</button>

		<!-- Hamburger Menu for smaller screens -->
		<div class="md:hidden flex flex-col gap-1 cursor-pointer" on:click={toggleMenu}>
			<div class="w-6 h-[2px] bg-gray-800 transition-all duration-300"></div>
			<div class="w-6 h-[2px] bg-gray-800 transition-all duration-300"></div>
			<div class="w-6 h-[2px] bg-gray-800 transition-all duration-300"></div>
		</div>
	</div>
</nav>

<style>
	/* Badge styling */
	.relative .absolute {
		position: absolute;
	}

	/* Styling for nav items and site name */
	nav a {
		font-size: 0.875rem; /* Makes the text smaller */
		text-transform: none; /* Removes capitalization */
	}

	/* Adjust spacing for left alignment */
	.flex.items-center.gap-8 {
		gap: 2rem; /* Adjust gap as needed */
	}
</style>

<script>
	import { isCartSliderOpen, toggleCartSlider } from '$lib/stores/cartSliderStore';
	import { cart } from '$lib/stores/cartStore';
	import { onMount } from 'svelte';

	let isCartOpen;
	$: isCartSliderOpen.subscribe(value => (isCartOpen = value));

	function handleCartIconClick() {
		toggleCartSlider();
	}

	let isMenuOpen = false;

	function toggleMenu() {
		isMenuOpen = !isMenuOpen;
	}

	let totalItems = 0;
	$: totalItems = $cart.reduce((sum, item) => sum + item.quantity, 0);

	function closeMenu() {
		isMenuOpen = false;
	}

	// Close menu when clicking outside
	function handleClickOutside(event) {
		if (isMenuOpen && !event.target.closest('.menu-container') && !event.target.closest('.burger-icon')) {
			closeMenu();
		}
	}

	// Add event listener to close menu on outside click
	onMount(() => {
		document.addEventListener('click', handleClickOutside);
		return () => document.removeEventListener('click', handleClickOutside);
	});
</script>

<nav class="fixed top-0 left-0 w-full z-50 flex justify-between items-center p-4 bg-white border-b border-gray-200 px-16">
	<!-- Logo -->
	<div class="text-sm font-semibold">
		<a href="/" class="text-gray-800 hover:text-purple-500">
			store.shahabned.xyz
		</a>
	</div>

	<!-- Desktop Navigation Links -->
	<ul class="hidden md:flex gap-8 list-none">
		<li><a href="/shop" class="text-gray-800 hover:text-purple-500">Shop</a></li>
		<li><a href="/about" class="text-gray-800 hover:text-purple-500">About</a></li>
		<li><a href="/profile" class="text-gray-800 hover:text-purple-500">Profile</a></li>
	</ul>

	<!-- Cart and Hamburger Menu -->
	<div class="flex items-center relative">
		<!-- Cart Icon (hidden on mobile) -->
		<button class="hidden md:block text-2xl ml-4 transition-colors" on:click={handleCartIconClick}>
			🛒
			{#if totalItems > 0}
				<span class="absolute -top-1 -right-3 bg-red-500 text-white text-xs rounded-full w-5 h-5 flex items-center justify-center">
					{totalItems}
				</span>
			{/if}
		</button>

		<!-- Hamburger Menu (visible on mobile) -->
		<div class="burger-icon md:hidden flex flex-col gap-1 cursor-pointer" on:click={toggleMenu}>
			<div class="w-6 h-[2px] bg-gray-800"></div>
			<div class="w-6 h-[2px] bg-gray-800"></div>
			<div class="w-6 h-[2px] bg-gray-800"></div>
		</div>
	</div>

	<!-- Mobile Menu -->
	{#if isMenuOpen}
		<div class="menu-container absolute top-full right-4 mt-2 w-48 bg-white border rounded-md shadow-lg flex flex-col items-start p-4 md:hidden">
			<ul class="flex flex-col gap-4 list-none text-right w-full">
				<li><a href="/shop" class="text-gray-800 hover:text-purple-500">Shop</a></li>
				<li><a href="/about" class="text-gray-800 hover:text-purple-500">About</a></li>
				<li><a href="/profile" class="text-gray-800 hover:text-purple-500">Profile</a></li>
				<li class="text-2xl">
					<button on:click={handleCartIconClick}>🛒
						{#if totalItems > 0}
							<span class="absolute -top-1 -right-3 bg-red-500 text-white text-xs rounded-full w-5 h-5 flex items-center justify-center">
								{totalItems}
							</span>
						{/if}
					</button>
				</li>
			</ul>
		</div>
	{/if}
</nav>

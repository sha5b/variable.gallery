<script>
	import { onMount } from 'svelte';
	import { fetchArtists } from '$lib/api';
	import { cart, isCartSliderOpen, toggleCartSlider } from '$lib/stores/cartStore';
	import { ShoppingCart, ChevronDown } from 'svelte-heros';

	let artists = [];
	let isCartOpen;
	$: isCartSliderOpen.subscribe((value) => (isCartOpen = value));

	function handleCartIconClick() {
		toggleCartSlider();
	}

	let isMenuOpen = false;
	let isDropdownOpen = false;

	function toggleMenu() {
		isMenuOpen = !isMenuOpen;
	}

	function toggleDropdown(event) {
		event.stopPropagation();
		isDropdownOpen = !isDropdownOpen;
	}

	let totalItems = 0;
	$: totalItems = $cart.reduce((sum, item) => sum + item.quantity, 0);

	function closeMenu() {
		isMenuOpen = false;
	}

	function handleClickOutside(event) {
		const dropdown = document.querySelector('.dropdown-menu');
		const dropdownButton = document.querySelector('.dropdown-button');

		if (
			dropdown &&
			dropdownButton &&
			!dropdown.contains(event.target) &&
			!dropdownButton.contains(event.target)
		) {
			isDropdownOpen = false;
		}
	}

	onMount(async () => {
		artists = await fetchArtists();
		if (typeof document !== 'undefined') {
			document.addEventListener('click', handleClickOutside);
		}

		return () => {
			if (typeof document !== 'undefined') {
				document.removeEventListener('click', handleClickOutside);
			}
		};
	});
</script>

<nav class="navbar bg-background px-page py-md z-50 flex w-full items-center justify-between">
	<!-- Logo -->
	<div class="text-lg font-semibold">
		<a href="/" class="text-text-color hover:text-primary-color">variable.gallery</a>
	</div>

	<!-- Desktop Navigation Links -->
	<ul class="hidden list-none items-center gap-12 md:flex">
		<li><a href="/shop" class="text-text-color hover:text-primary-color">shop</a></li>
		<li><a href="/about" class="text-text-color hover:text-primary-color">about</a></li>

		<!-- Artists Dropdown with Icon -->
		<li class="relative flex items-center">
			<a href="/artist" class="text-text-color hover:text-primary-color">artists</a>
			<button
				class="dropdown-button text-text-color hover:text-primary-color"
				on:click={toggleDropdown}
			>
				<ChevronDown class="icon ml-6" />
			</button>
			{#if isDropdownOpen}
				<ul class="dropdown-menu bg-background absolute mt-2 py-2" style="left: 0;">
					{#each artists as artist}
						<li>
							<a
								href={`/artist/${artist.slug}`}
								class="dropdown-item text-text-color hover:bg-primary-color hover:text-background block px-4 py-2"
								on:click={() => (isDropdownOpen = false)}
							>
								{artist.title.rendered}
							</a>
						</li>
					{/each}
				</ul>
			{/if}
		</li>
        <!-- <li>
            <a href="/exhibitions" class="text-text-color hover:text-primary-color" on:click={closeMenu}
                >exhibitions</a
            >
        </li> -->

	</ul>

	<!-- Cart and Hamburger Menu -->
	<div class="flex items-center gap-3">
		<button class="cart-icon relative text-xl mr-4" on:click={handleCartIconClick}>
			<ShoppingCart class="cart-icon" />
			{#if totalItems > 0}
				<span class="cart-badge">{totalItems}</span>
			{/if}
		</button>

		<!-- Hamburger Menu (visible on mobile) -->
		<div class="burger-icon flex cursor-pointer flex-col gap-1 md:hidden" on:click={toggleMenu}>
			<div class="bg-text-color h-[2px] w-6"></div>
			<div class="bg-text-color h-[2px] w-6"></div>
			<div class="bg-text-color h-[2px] w-6"></div>
		</div>
	</div>

	<!-- Mobile Menu -->
	{#if isMenuOpen}
		<div
			class="menu-container bg-background fixed inset-0 top-[60px] z-40 flex flex-col overflow-y-auto p-4 md:hidden"
		>
			<ul class="flex flex-col gap-2 ">
				<li>
					<a href="/shop" class="text-text-color hover:text-primary-color" on:click={closeMenu}
						>shop</a
					>
				</li>
				<li>
					<a href="/about" class="text-text-color hover:text-primary-color" on:click={closeMenu}
						>about</a
					>
				</li>
				<li class="text-text-color">artists</li>
				<ul class="ml-4">
					{#each artists as artist}
						<li>
							<a
								href={`/artist/${artist.slug}`}
								class="dropdown-item text-text-color hover:bg-primary-color hover:text-background block px-4 py-2"
								on:click={closeMenu}
							>
								{artist.title.rendered}
							</a>
						</li>
					{/each}
				</ul>
                <!-- <li>
					<a href="/exhibitions" class="text-text-color hover:text-primary-color" on:click={closeMenu}
						>exhibitions</a
					>
				</li> -->
			</ul>
		</div>
	{/if}
</nav>

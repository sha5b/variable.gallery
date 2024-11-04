<script>
	import { isCartSliderOpen, toggleCartSlider } from '$lib/stores/cartSliderStore';
	import { cart } from '$lib/stores/cartStore';
	import { onMount } from 'svelte';
	export let artists = [];

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

	function toggleDropdown() {
		isDropdownOpen = !isDropdownOpen;
	}

	let totalItems = 0;
	$: totalItems = $cart.reduce((sum, item) => sum + item.quantity, 0);

	function closeMenu() {
		isMenuOpen = false;
	}
</script>

<nav
	class="navbar bg-background px-page py-md md:px-page-md flex w-full items-center justify-between"
>
	<!-- Logo -->
	<div class="text-base font-semibold">
		<a href="/" class="text-text-color hover:text-primary-color">variable.gallery</a>
	</div>

	<!-- Desktop Navigation Links -->
	<ul class="gap-lg hidden list-none items-center md:flex">
		<li><a href="/shop" class="text-text-color hover:text-primary-color">Shop</a></li>
		<li><a href="/about" class="text-text-color hover:text-primary-color">About</a></li>

		<!-- Artists Dropdown Link -->
		<li class="relative">
			<button on:click={toggleDropdown} class="text-text-color hover:text-primary-color">
				Artists
			</button>
			{#if isDropdownOpen}
				<ul class="dropdown-menu bg-background absolute mt-2 rounded-lg py-2 shadow-lg">
					{#each artists as artist}
						<li>
							<a
								href={`/artist/${artist.slug}`}
								class="text-text-color hover:bg-primary-color hover:text-background block px-4 py-2"
							>
								{artist.title.rendered}
							</a>
						</li>
					{/each}
				</ul>
			{/if}
		</li>
	</ul>

	<!-- Cart and Hamburger Menu -->
	<div class="gap-sm relative flex items-center">
		<button class="relative text-2xl" on:click={handleCartIconClick}>
			🛒
			{#if totalItems > 0}
				<span class="cart-badge">{totalItems}</span>
			{/if}
		</button>

		<!-- Hamburger Menu (visible on mobile) -->
		<div
			class="burger-icon ml-sm gap-xs flex cursor-pointer flex-col md:hidden"
			on:click={toggleMenu}
		>
			<div class="bg-text-color h-[2px] w-6"></div>
			<div class="bg-text-color h-[2px] w-6"></div>
			<div class="bg-text-color h-[2px] w-6"></div>
		</div>
	</div>

	<!-- Mobile Menu -->
	{#if isMenuOpen}
		<div
			class="menu-container right-md mt-sm bg-background p-md absolute top-full flex w-48 flex-col md:hidden"
		>
			<ul class="gap-sm w-full flex-col text-left">
				<li>
					<a href="/shop" class="text-text-color hover:text-primary-color" on:click={closeMenu}
						>Shop</a
					>
				</li>
				<li>
					<a href="/about" class="text-text-color hover:text-primary-color" on:click={closeMenu}
						>About</a
					>
				</li>
				<li class="relative">
					<button on:click={toggleDropdown} class="text-text-color hover:text-primary-color">
						Artists
					</button>
					{#if isDropdownOpen}
						<ul class="dropdown-menu-mobile bg-background absolute mt-2 rounded-lg py-2 shadow-lg">
							{#each artists as artist}
								<li>
									<a
										href={`/artist/${encodeURIComponent(artist.title.rendered)}`}
										class="text-text-color hover:bg-primary-color hover:text-background block px-4 py-2"
									>
										{artist.title.rendered}
									</a>
								</li>
							{/each}
						</ul>
					{/if}
				</li>
				<li class="text-2xl">
					<button
						on:click={() => {
							handleCartIconClick();
							closeMenu();
						}}
					>
						🛒
						{#if totalItems > 0}
							<span class="cart-badge">{totalItems}</span>
						{/if}
					</button>
				</li>
			</ul>
		</div>
	{/if}
</nav>

<style>
	.navbar {
		position: sticky;
		top: 0;
		z-index: 50;
		background-color: var(--background-color);
	}

	.cart-badge {
		position: absolute;
		top: -0.5rem;
		right: -0.5rem;
		display: flex;
		justify-content: center;
		align-items: center;
		width: 1.25rem;
		height: 1.25rem;
		background-color: var(--error-color);
		color: var(--background-color);
		font-size: var(--font-size-small);
		border-radius: 9999px;
	}

	.dropdown-menu {
		min-width: 150px;
	}

	.dropdown-menu-mobile {
		position: relative;
	}

	.burger-icon div {
		background-color: var(--text-color);
	}
</style>

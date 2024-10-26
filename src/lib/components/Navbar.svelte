<script>
	import { isCartSliderOpen, toggleCartSlider } from '$lib/stores/cartSliderStore';
	import { cart } from '$lib/stores/cartStore';
	import { onMount } from 'svelte';

	let isCartOpen;
	$: isCartSliderOpen.subscribe((value) => (isCartOpen = value));

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
		if (
			isMenuOpen &&
			!event.target.closest('.menu-container') &&
			!event.target.closest('.burger-icon')
		) {
			closeMenu();
		}
	}

	// Add event listener to close menu on outside click
	onMount(() => {
		document.addEventListener('click', handleClickOutside);
		return () => document.removeEventListener('click', handleClickOutside);
	});
</script>

<nav
  class="fixed left-0 top-0 z-50 flex w-full items-center justify-between  bg-[var(--background-color)] px-4 py-4 md:px-16"
>
  <!-- Logo -->
  <div class="text-sm font-semibold">
    <a href="/" class="text-[var(--text-color)] hover:text-[var(--primary-color)]"> store.shahabned.xyz </a>
  </div>

  <!-- Desktop Navigation Links -->
  <ul class="hidden list-none gap-8 md:flex">
    <li><a href="/shop" class="text-[var(--text-color)] hover:text-[var(--primary-color)]">Shop</a></li>
    <li><a href="/about" class="text-[var(--text-color)] hover:text-[var(--primary-color)]">About</a></li>
    <li><a href="/profile" class="text-[var(--text-color)] hover:text-[var(--primary-color)]">Profile</a></li>
  </ul>

  <!-- Cart and Hamburger Menu -->
  <div class="relative flex items-center">
    <!-- Cart Icon (hidden on mobile) -->
    <button class="hidden text-2xl transition-colors md:block" on:click={handleCartIconClick}>
      🛒
      {#if totalItems > 0}
        <span
          class="absolute -right-3 -top-1 flex h-5 w-5 items-center justify-center rounded-full bg-[var(--error-color)] text-xs text-[var(--background-color)]"
        >
          {totalItems}
        </span>
      {/if}
    </button>

    <!-- Hamburger Menu (visible on mobile) -->
    <div
      class="burger-icon ml-4 flex cursor-pointer flex-col gap-1 md:hidden"
      on:click={toggleMenu}
    >
      <div class="h-[2px] w-6 bg-[var(--text-color)]"></div>
      <div class="h-[2px] w-6 bg-[var(--text-color)]"></div>
      <div class="h-[2px] w-6 bg-[var(--text-color)]"></div>
    </div>
  </div>

  <!-- Mobile Menu -->
  {#if isMenuOpen}
    <div
      class="menu-container absolute right-4 top-full mt-2 flex w-48 flex-col items-start rounded-md border bg-[var(--background-color)] p-4 shadow-lg md:hidden"
    >
      <ul class="flex w-full list-none flex-col gap-4 text-left">
        <li>
          <a href="/shop" class="text-[var(--text-color)] hover:text-[var(--primary-color)]" on:click={closeMenu}>Shop</a>
        </li>
        <li>
          <a href="/about" class="text-[var(--text-color)] hover:text-[var(--primary-color)]" on:click={closeMenu}>About</a>
        </li>
        <li>
          <a href="/profile" class="text-[var(--text-color)] hover:text-[var(--primary-color)]" on:click={closeMenu}>Profile</a>
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
              <span
                class="absolute -right-3 -top-1 flex h-5 w-5 items-center justify-center rounded-full bg-[var(--error-color)] text-xs text-[var(--background-color)]"
              >
                {totalItems}
              </span>
            {/if}
          </button>
        </li>
      </ul>
    </div>
  {/if}
</nav>


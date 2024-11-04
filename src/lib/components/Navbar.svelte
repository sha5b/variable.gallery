<script>
  import { isCartSliderOpen, toggleCartSlider } from '$lib/stores/cartSliderStore';
  import { cart } from '$lib/stores/cartStore';
  import { onMount } from 'svelte';
  export let artists = []; // Artists data from WordPress API

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

<nav class="navbar w-full flex justify-between items-center bg-background px-page py-md md:px-page-md">
  <!-- Logo -->
  <div class="text-base font-semibold">
    <a href="/" class="text-text-color hover:text-primary-color">variable.gallery</a>
  </div>

  <!-- Desktop Navigation Links -->
  <ul class="hidden md:flex list-none gap-lg items-center">
    <li><a href="/shop" class="text-text-color hover:text-primary-color">Shop</a></li>
    <li><a href="/about" class="text-text-color hover:text-primary-color">About</a></li>

    <!-- Artists Dropdown Link -->
    <li class="relative">
      <button on:click={toggleDropdown} class="text-text-color hover:text-primary-color">
        Artists
      </button>
      {#if isDropdownOpen}
        <ul class="dropdown-menu absolute bg-background rounded-lg mt-2 shadow-lg py-2">
          {#each artists as artist}
            <li>
              <a href={`/artist/${artist.slug}`} class="block px-4 py-2 text-text-color hover:bg-primary-color hover:text-background">
                {artist.title.rendered}
              </a>
            </li>
          {/each}
        </ul>
      {/if}
    </li>
  </ul>

  <!-- Cart and Hamburger Menu -->
  <div class="relative flex items-center gap-sm">
    <!-- Cart Icon (now visible on all screen sizes) -->
    <button class="text-2xl relative" on:click={handleCartIconClick}>
      🛒
      {#if totalItems > 0}
        <span class="cart-badge">{totalItems}</span>
      {/if}
    </button>

    <!-- Hamburger Menu (visible on mobile) -->
    <div class="burger-icon ml-sm flex flex-col gap-xs cursor-pointer md:hidden" on:click={toggleMenu}>
      <div class="h-[2px] w-6 bg-text-color"></div>
      <div class="h-[2px] w-6 bg-text-color"></div>
      <div class="h-[2px] w-6 bg-text-color"></div>
    </div>
  </div>

  <!-- Mobile Menu -->
  {#if isMenuOpen}
    <div class="menu-container absolute right-md top-full mt-sm flex flex-col w-48 bg-background p-md md:hidden">
      <ul class="w-full flex-col gap-sm text-left">
        <li><a href="/shop" class="text-text-color hover:text-primary-color" on:click={closeMenu}>Shop</a></li>
        <li><a href="/about" class="text-text-color hover:text-primary-color" on:click={closeMenu}>About</a></li>
        <li class="relative">
          <button on:click={toggleDropdown} class="text-text-color hover:text-primary-color">
            Artists
          </button>
          {#if isDropdownOpen}
            <ul class="dropdown-menu-mobile absolute bg-background rounded-lg mt-2 shadow-lg py-2">
              {#each artists as artist}
                <li>
                  <a href={`/artist/${artist.slug}`} class="block px-4 py-2 text-text-color hover:bg-primary-color hover:text-background">
                    {artist.title.rendered}
                  </a>
                </li>
              {/each}
            </ul>
          {/if}
        </li>
        <li class="text-2xl">
          <button on:click={() => { handleCartIconClick(); closeMenu(); }}>
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

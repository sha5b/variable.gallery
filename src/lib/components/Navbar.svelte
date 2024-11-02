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
</script>

<nav class="navbar w-full flex justify-between items-center bg-background px-page py-md md:px-page-md">
  <!-- Logo -->
  <div class="text-base font-semibold">
    <a href="/" class="text-text-color hover:text-primary-color">store.shahabned.xyz</a>
  </div>

  <!-- Desktop Navigation Links -->
  <ul class="hidden md:flex list-none gap-lg items-center">
    <li><a href="/shop" class="text-text-color hover:text-primary-color">Shop</a></li>
    <li><a href="/about" class="text-text-color hover:text-primary-color">About</a></li>
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
    <div class="menu-container absolute right-md top-full mt-sm flex flex-col w-48 bg-background rounded-md p-md md:hidden">
      <ul class="w-full flex-col gap-sm text-left">
        <li><a href="/shop" class="text-text-color hover:text-primary-color" on:click={closeMenu}>Shop</a></li>
        <li><a href="/about" class="text-text-color hover:text-primary-color" on:click={closeMenu}>About</a></li>
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

  .burger-icon div {
    background-color: var(--text-color);
  }
</style>

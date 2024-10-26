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

  function handleClickOutside(event) {
    if (
      isMenuOpen &&
      !event.target.closest('.menu-container') &&
      !event.target.closest('.burger-icon')
    ) {
      closeMenu();
    }
  }

  onMount(() => {
    document.addEventListener('click', handleClickOutside);
    return () => document.removeEventListener('click', handleClickOutside);
  });
</script>

<nav class="fixed left-0 top-0 z-50 flex w-full items-center justify-between bg-[var(--background-color)] px-[var(--page-padding)] py-[var(--spacing-md)] md:px-[var(--page-padding-md)]">
  <!-- Logo -->
  <div class="text-sm font-semibold">
    <a href="/" class="text-[var(--text-color)] hover:text-[var(--primary-color)]">store.shahabned.xyz</a>
  </div>

  <!-- Desktop Navigation Links -->
  <ul class="hidden list-none gap-[var(--spacing-lg)] md:flex">
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
        <span class="absolute -right-[var(--spacing-xs)] -top-[var(--spacing-xs)] flex h-5 w-5 items-center justify-center rounded-full bg-[var(--error-color)] text-xs text-[var(--background-color)]">
          {totalItems}
        </span>
      {/if}
    </button>

    <!-- Hamburger Menu (visible on mobile) -->
    <div class="burger-icon ml-[var(--spacing-sm)] flex cursor-pointer flex-col gap-[var(--spacing-xs)] md:hidden" on:click={toggleMenu}>
      <div class="h-[2px] w-6 bg-[var(--text-color)]"></div>
      <div class="h-[2px] w-6 bg-[var(--text-color)]"></div>
      <div class="h-[2px] w-6 bg-[var(--text-color)]"></div>
    </div>
  </div>

  <!-- Mobile Menu -->
  {#if isMenuOpen}
    <div class="menu-container absolute right-[var(--spacing-md)] top-full mt-[var(--spacing-sm)] flex w-48 flex-col items-start rounded-md bg-[var(--background-color)] p-[var(--spacing-md)] md:hidden">
      <ul class="flex w-full list-none flex-col gap-[var(--spacing-sm)] text-left">
        <li><a href="/shop" class="text-[var(--text-color)] hover:text-[var(--primary-color)]" on:click={closeMenu}>Shop</a></li>
        <li><a href="/about" class="text-[var(--text-color)] hover:text-[var(--primary-color)]" on:click={closeMenu}>About</a></li>
        <li><a href="/profile" class="text-[var(--text-color)] hover:text-[var(--primary-color)]" on:click={closeMenu}>Profile</a></li>
        <li class="text-2xl">
          <button on:click={() => { handleCartIconClick(); closeMenu(); }}>
            🛒
            {#if totalItems > 0}
              <span class="absolute -right-[var(--spacing-xs)] -top-[var(--spacing-xs)] flex h-5 w-5 items-center justify-center rounded-full bg-[var(--error-color)] text-xs text-[var(--background-color)]">
                {totalItems}
              </span>
            {/if}
          </button>
        </li>
      </ul>
    </div>
  {/if}
</nav>

<script>
    import { cart , isCartSliderOpen, toggleCartSlider  } from '$lib/stores/cartStore';
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

    function handleClickOutside(event) {
        const dropdown = document.querySelector('.dropdown-menu');
        const mobileDropdown = document.querySelector('.dropdown-menu-mobile');

        if (!dropdown.contains(event.target) && !mobileDropdown.contains(event.target)) {
            isDropdownOpen = false;
        }
    }

    onMount(() => {
        document.addEventListener('click', handleClickOutside);
        return () => {
            document.removeEventListener('click', handleClickOutside);
        };
    });
</script>

<nav class="navbar sticky top-0 bg-background px-page py-md flex w-full items-center justify-between z-50">
    <!-- Logo -->
    <div class="text-lg font-semibold">
        <a href="/" class="text-text-color hover:text-primary-color">variable.gallery</a>
    </div>

    <!-- Desktop Navigation Links -->
    <ul class="hidden md:flex gap-6 list-none items-center">
        <li><a href="/shop" class="text-text-color hover:text-primary-color">shop</a></li>
        <li><a href="/about" class="text-text-color hover:text-primary-color">about</a></li>

        <!-- Artists Dropdown Link -->
        <li class="relative">
            <button on:click={toggleDropdown} class="text-text-color hover:text-primary-color">
                artists
            </button>
            {#if isDropdownOpen}
                <ul class="dropdown-menu bg-background absolute mt-2 rounded-lg py-2">
                    {#each artists as artist}
                        <li>
                            <a
                                href={`/artist/${artist.slug}`}
                                class="text-text-color hover:bg-primary-color hover:text-background block px-4 py-2"
                                on:click={() => (isDropdownOpen = false)}
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
    <div class="flex items-center gap-3">
        <button class="relative text-2xl" on:click={handleCartIconClick}>
            🛒
            {#if totalItems > 0}
                <span class="cart-badge">{totalItems}</span>
            {/if}
        </button>

        <!-- Hamburger Menu (visible on mobile) -->
        <div class="burger-icon flex flex-col gap-1 cursor-pointer md:hidden" on:click={toggleMenu}>
            <div class="h-[2px] w-6 bg-text-color"></div>
            <div class="h-[2px] w-6 bg-text-color"></div>
            <div class="h-[2px] w-6 bg-text-color"></div>
        </div>
    </div>

    <!-- Mobile Menu -->
    {#if isMenuOpen}
        <div class="menu-container absolute right-4 mt-2 w-48 bg-background p-4 flex flex-col md:hidden z-40">
            <ul class="flex flex-col gap-2">
                <li><a href="/shop" class="text-text-color hover:text-primary-color" on:click={closeMenu}>Shop</a></li>
                <li><a href="/about" class="text-text-color hover:text-primary-color" on:click={closeMenu}>About</a></li>
                <li class="relative">
                    <button on:click={toggleDropdown} class="text-text-color hover:text-primary-color">
                        Artists
                    </button>
                    {#if isDropdownOpen}
                        <ul class="dropdown-menu-mobile bg-background border border-primary-color absolute mt-2 rounded-lg py-2">
                            {#each artists as artist}
                                <li>
                                    <a
                                        href={`/artist/${encodeURIComponent(artist.title.rendered)}`}
                                        class="text-text-color hover:bg-primary-color hover:text-background block px-4 py-2"
                                        on:click={() => {
                                            closeMenu();
                                            isDropdownOpen = false;
                                        }}
                                    >
                                        {artist.title.rendered}
                                    </a>
                                </li>
                            {/each}
                        </ul>
                    {/if}
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
        font-size: 0.75rem;
        border-radius: 9999px;
    }

    .dropdown-menu, .dropdown-menu-mobile {
        min-width: 150px;
        border-radius: var(--rounded-md);
    }

    .burger-icon div {
        background-color: var(--text-color);
    }
</style>

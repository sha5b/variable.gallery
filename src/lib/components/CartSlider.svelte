<script>
  import { cart, removeItem, addItem } from '$lib/stores/cartStore';
  import { isCartSliderOpen, toggleCartSlider } from '$lib/stores/cartSliderStore';
  import { goto } from '$app/navigation';

  let isOpen;

  // Subscribe to the store's value
  $: isCartSliderOpen.subscribe(value => {
    isOpen = value;
  });

  function closeCart() {
    toggleCartSlider();
  }

  function increaseQuantity(item) {
    addItem(item);
  }

  function decreaseQuantity(item) {
    cart.update((items) => {
      const existingItem = items.find((i) => i.id === item.id);
      if (existingItem.quantity > 1) {
        existingItem.quantity -= 1;
      } else {
        return items.filter((i) => i.id !== item.id);
      }
      return [...items];
    });
  }

  function handleCheckout() {
    closeCart();
    goto('/checkout');
  }

  function viewCart() {
    closeCart();
    goto('/cart');
  }

  function handleImageClick(productId) {
    goto(`/shop/${productId}`);
  }
</script>

<!-- Cart Slider -->
<div class={`fixed top-0 right-0 h-screen w-[350px] bg-[var(--primary-color)] text-[var(--background-color)] transition-transform duration-300 ${isOpen ? 'translate-x-0' : 'translate-x-full'} z-50 flex flex-col`}>
  <div class="p-[var(--page-padding)]">
    <div class="flex justify-between items-center mb-6">
      <h2 class="text-[var(--font-size-large)] font-bold">Your Cart</h2>
      <button class="bg-[var(--background-color)] text-[var(--primary-color)] font-bold rounded-lg w-8 h-8 flex items-center justify-center hover:bg-[var(--accent-color)] transition-colors duration-300" on:click={closeCart}>✕</button>
    </div>
    
    <!-- Cart Content (Scrollable) -->
    <div class="cart-content overflow-y-auto max-h-[calc(100vh_-_240px)]">
      {#if $cart.length === 0}
        <p>Your cart is empty</p>
      {:else}
        <ul class="space-y-4">
          {#each $cart as item (item.id)}
            <li class="flex items-start">
              <!-- Redirect to product page on image click -->
              <img src={item.images?.[0]?.src || '/path/to/placeholder.jpg'} alt={item.name} 
                   class="w-20 h-20 object-cover rounded-lg mr-4 cursor-pointer" 
                   on:click={() => handleImageClick(item.id)} />
              <div class="flex-1">
                <h3 class="text-[var(--font-size-base)] font-semibold mb-2">{item.name}</h3>
                <div class="flex items-center gap-2">
                  <p class="text-[var(--font-size-base)] font-semibold">€{(item.price * item.quantity).toFixed(2)}</p>
                  <button on:click={() => decreaseQuantity(item)} class="bg-[var(--background-color)] text-[var(--primary-color)] rounded-md px-2 py-1 font-semibold hover:bg-[var(--accent-color)] transition-colors duration-300">-</button>
                  <span class="text-[var(--font-size-base)]">{item.quantity}</span>
                  <button on:click={() => increaseQuantity(item)} class="bg-[var(--background-color)] text-[var(--primary-color)] rounded-md px-2 py-1 font-semibold hover:bg-[var(--accent-color)] transition-colors duration-300">+</button>
                  {#if item.variation}
                    <span class="bg-white/20 text-[var(--background-color)] px-2 py-1 rounded-full text-sm font-semibold ml-4">{item.variation}</span>
                  {/if}
                </div>
                <button on:click={() => removeItem(item.id)} class="bg-[var(--error-color)] text-[var(--background-color)] rounded-md w-full py-2 mt-2 font-semibold hover:bg-red-600 transition-colors duration-300">Remove</button>
              </div>
            </li>
          {/each}
        </ul>
      {/if}
    </div>
  </div>

  <!-- Fixed Checkout and View Cart Buttons -->
  <div class="p-[var(--page-padding)] bg-[var(--primary-color)] flex flex-col items-center gap-4 rounded-b-lg">
    <button 
      on:click={viewCart} 
      class="bg-[var(--secondary-color)] text-[var(--background-color)] w-full py-3 rounded-md font-semibold hover:bg-[var(--accent-color)] transition-transform transform "

    >
      View Cart
    </button>
    <button 
      on:click={handleCheckout} 
      class="bg-[var(--secondary-color)] text-[var(--background-color)] w-full py-3 rounded-md font-semibold hover:bg-[var(--accent-color)] transition-transform transform "
    >
      Checkout
    </button>
  </div>
</div>

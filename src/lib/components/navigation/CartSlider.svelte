<script>
  import { cart, removeItem, addItem, isCartSliderOpen, toggleCartSlider } from '$lib/stores/cartStore';
  import { goto } from '$app/navigation';
  import { handleImageLoad, getProductUrl, getProductImageUrl } from '$lib/utils/mediaUtils';

  /** @type {boolean} */
  let isOpen = false;
  /** @type {number} */
  let total = 0;

  /** @typedef {import('$lib/utils/types').Product & { quantity: number, price: number }} CartItem */

  // Subscribe to the store's value and calculate total
  $: {
      isCartSliderOpen.subscribe((value) => {
          isOpen = value;
      });
      
      total = $cart.reduce((/** @type {number} */ sum, /** @type {CartItem} */ item) => sum + (item.price * item.quantity), 0);
      console.log('Current cart items:', $cart);
  }

  function closeCart() {
      toggleCartSlider();
  }

  /**
   * @param {CartItem} item
   */
  function increaseQuantity(item) {
      addItem(item);
  }

  /**
   * @param {CartItem} item
   */
  function decreaseQuantity(item) {
      cart.update((/** @type {CartItem[]} */ items) => {
          const existingItem = items.find((/** @type {CartItem} */ i) => i.id === item.id);
          if (existingItem && existingItem.quantity > 1) {
              existingItem.quantity -= 1;
          } else {
              return items.filter((/** @type {CartItem} */ i) => i.id !== item.id);
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

  /**
   * @param {number} productId
   */
  function onImageClick(productId) {
      goto(getProductUrl(productId));
  }

  // Handle image loading for cart items
  $: imagePromises = $cart.map((/** @type {CartItem} */ item) => ({
      ...item,
      loadedSrc: handleImageLoad(getProductImageUrl(item))
  }));
</script>

<!-- Cart Slider -->
<div class={`cart-slider fixed top-0 right-0 h-screen bg-background shadow-xl transition-transform duration-300 ${isOpen ? 'translate-x-0' : 'translate-x-full'} z-50 flex flex-col`}>

<!-- Header -->
<div class="cart-header border-b border-gray-200 p-4">
  <div class="flex justify-between items-center">
    <h2 class="text-xl font-semibold text-primary">Shopping Cart</h2>
    <button 
      class="hover:bg-gray-100 rounded-full p-2 transition-colors"
      on:click={closeCart}
    >
      <span class="sr-only">Close cart</span>
      ✕
    </button>
  </div>
</div>

<!-- Cart Items -->
<div class="cart-items flex-1 overflow-y-auto p-4">
  {#if $cart.length === 0}
    <div class="flex flex-col items-center justify-center h-full text-gray-500">
      <p>Your cart is empty</p>
      <button 
        class="mt-4 text-primary hover:text-secondary underline"
        on:click={() => goto('/shop')}
      >
        Continue Shopping
      </button>
    </div>
  {:else}
    <ul class="space-y-4">
      {#each $cart as item (item.id)}
        <li class="flex gap-4 p-2 hover:bg-gray-50 rounded-lg transition-colors">
          {#await imagePromises.find((/** @type {CartItem & { loadedSrc: Promise<string> }} */ p) => p.id === item.id)?.loadedSrc || handleImageLoad(getProductImageUrl(item))}
            <img 
              src="/placeholder.jpg"
              alt="Loading..."
              class="w-20 h-20 object-cover rounded-md cursor-pointer"
            />
          {:then src}
            <img 
              {src}
              alt={item.name}
              class="w-20 h-20 object-cover rounded-md cursor-pointer"
              on:click={() => onImageClick(item.id)}
            />
          {/await}
          
          <div class="flex-1">
            <h3 class="font-medium text-primary">{item.name}</h3>
            <div class="flex items-center gap-2 mt-2">
              <div class="flex items-center">
                <button 
                  class="quantity-btn"
                  on:click={() => decreaseQuantity(item)}
                >-</button>
                <span class="mx-3">{item.quantity}</span>
                <button 
                  class="quantity-btn"
                  on:click={() => increaseQuantity(item)}
                >+</button>
              </div>
              <p class="ml-auto font-medium">€{(item.price * item.quantity).toFixed(2)}</p>
            </div>
          </div>
        </li>
      {/each}
    </ul>
  {/if}
</div>

<!-- Footer -->
<div class="cart-footer border-t border-gray-200 p-4">
  <div class="flex justify-between mb-4">
    <span class="font-medium">Total</span>
    <span class="font-bold">€{total.toFixed(2)}</span>
  </div>
  <div class="space-y-2">
    <button 
      class="button-primary w-full"
      on:click={handleCheckout}
    >
      Checkout
    </button>
    <button 
      class="button-secondary w-full"
      on:click={viewCart}
    >
      View Cart
    </button>
  </div>
</div>
</div>

<script>
  import { handleProductClick, preloadImage } from '$lib/utils/sliderHelper';
  import { cart, removeItem, addItem , isCartSliderOpen, toggleCartSlider } from '$lib/stores/cartStore';
  import { goto } from '$app/navigation';

  let isOpen;
  let total = 0;

  // Subscribe to the store's value and calculate total
  $: {
      isCartSliderOpen.subscribe((value) => {
          isOpen = value;
      });
      
      total = $cart.reduce((sum, item) => sum + (item.price * item.quantity), 0);
      console.log('Current cart items:', $cart);
  }

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

  // Redirect to product page on image click
  function onImageClick(productId) {
      handleProductClick(productId, goto);
  }

  // Preload images with fallback
  function getImageSrc(src) {
      return preloadImage(src, '/path/to/placeholder.jpg');
  }
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
          <img 
            src={getImageSrc(item.images?.[0]?.src)} 
            alt={item.name}
            class="w-20 h-20 object-cover rounded-md cursor-pointer"
            on:click={() => onImageClick(item.id)}
          />
          
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

<style>
  .cart-slider {
    width: 400px;
    max-width: 100vw;
    box-shadow: -2px 0 10px rgba(0, 0, 0, 0.1);
  }

  @media (max-width: 480px) {
    .cart-slider {
      width: 100vw;
    }
  }
</style>

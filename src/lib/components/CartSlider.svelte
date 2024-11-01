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
<div class={` fixed top-0 right-0 h-screen w-[500px] bg-primary text-background transition-transform duration-300 ${isOpen ? 'translate-x-0' : 'translate-x-full'} z-50 flex flex-col`}>
  
  <!-- Header with Cart Title and Close Button -->
  <div class="padding-md">
    <div class="flex-between items-center margin-md">
      <h2 class="text-large font-bold text-white">Your Cart</h2>
      <button class="button-primary w-8 h-8 rounded-lg flex-center hover:bg-accent text-white" on:click={closeCart}>✕</button>
    </div>
    
    <!-- Cart Content (Scrollable) -->
    <div class="cart-content overflow-y-auto max-h-cart-content padding-md text-white">
      {#if $cart.length === 0}
        <p>Your cart is empty</p>
      {:else}
        <ul class="space-y-md">
          {#each $cart as item (item.id)}
            <li class="flex items-start gap-sm">
              <!-- Image with Click Redirect -->
              <img src={item.images?.[0]?.src || '/path/to/placeholder.jpg'} alt={item.name} 
                   class="w-20 h-20 object-cover rounded-lg cursor-pointer" 
                   on:click={() => handleImageClick(item.id)} />
              <div class="flex-1">
                <h3 class="text-base font-semibold margin-sm text-white">{item.name}</h3>
                <div class="flex items-center gap-2">
                  <p class="text-base font-semibold text-white">€{(item.price * item.quantity).toFixed(2)}</p>
                  <button on:click={() => decreaseQuantity(item)} class="quantity-btn">-</button>
                  <span class="text-base text-white">{item.quantity}</span>
                  <button on:click={() => increaseQuantity(item)} class="quantity-btn">+</button>
                  {#if item.variation}
                    <span class="badge ml-md">{item.variation}</span>
                  {/if}
                  <button on:click={() => removeItem(item.id)} class="remove-btn ml-auto">Remove</button>
                </div>
              </div>
            </li>
          {/each}
        </ul>
      {/if}
    </div>
    
  </div>

  <!-- Fixed Checkout and View Cart Buttons -->
  <div class="padding-md bg-primary flex flex-col items-center gap-md rounded-b-lg">
    <button 
      on:click={viewCart} 
      class="button-secondary w-full text-white">View Cart
    </button>
    <button 
      on:click={handleCheckout} 
      class="button-secondary w-full text-white">Checkout
    </button>
  </div>
</div>

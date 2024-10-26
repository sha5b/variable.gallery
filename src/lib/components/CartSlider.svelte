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
</script>

<!-- Cart Slider -->
<div class={`fixed top-0 right-0 h-full w-[350px] bg-purple-500 text-white shadow-lg transition-transform duration-300 ${isOpen ? 'translate-x-0' : 'translate-x-full'} z-50 flex flex-col`}>
  <div class="p-6">
    <div class="flex justify-between items-center mb-6">
      <h2 class="text-xl font-bold">Your Cart</h2>
      <button class="bg-white text-purple-500 font-bold rounded-lg w-8 h-8 flex items-center justify-center hover:bg-purple-100" on:click={closeCart}>✕</button>
    </div>
    
    <!-- Cart Content (Scrollable) -->
    <div class="cart-content flex-grow overflow-y-auto">
      {#if $cart.length === 0}
        <p>Your cart is empty</p>
      {:else}
        <ul class="space-y-8">
          {#each $cart as item (item.id)}
            <li class="flex items-start">
              <!-- Use product's main thumbnail from WooCommerce data -->
              <img src={item.images?.[0]?.src || '/path/to/placeholder.jpg'} alt={item.name} class="w-20 h-20 object-cover rounded-lg mr-4" />
              <div class="flex-1">
                <!-- Product Title -->
                <h3 class="text-lg font-semibold mb-2">{item.name}</h3>

                <!-- Quantity and Variation Row -->
                <div class="flex items-center gap-2">
                  <!-- Price Display -->
                  <p class="text-lg font-semibold">€{(item.price * item.quantity).toFixed(2)}</p>
                  
                  <!-- Quantity Controls -->
                  <button on:click={() => decreaseQuantity(item)} class="bg-white text-purple-500 rounded-md px-2 py-1 font-semibold hover:bg-purple-100">-</button>
                  <span class="text-lg">{item.quantity}</span>
                  <button on:click={() => increaseQuantity(item)} class="bg-white text-purple-500 rounded-md px-2 py-1 font-semibold hover:bg-purple-100">+</button>
                
                  {#if item.variation}
                    <!-- Variation as pill format -->
                    <span class="bg-white/20 text-white px-2 py-1 rounded-full text-sm font-semibold ml-4">{item.variation}</span>
                  {/if}
                </div>

                <!-- Remove Button -->
                <button on:click={() => removeItem(item.id)} class="bg-red-500 text-white rounded-md w-full py-2 mt-2 font-semibold hover:bg-red-600">Remove</button>
              </div>
            </li>
          {/each}
        </ul>
      {/if}
    </div>
  </div>

  <!-- Fixed Checkout and View Cart Buttons -->
  <div class="p-6 space-y-4">
    <button on:click={viewCart} class="bg-white text-purple-500 w-full py-3 rounded-md font-semibold hover:bg-purple-100">View Cart</button>
    <button on:click={handleCheckout} class="bg-white text-purple-500 w-full py-3 rounded-md font-semibold hover:bg-purple-100">Checkout</button>
  </div>
</div>

<style>
  .cart-content {
    max-height: calc(100vh - 160px);
  }
</style>

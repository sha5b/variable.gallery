<script>
  import { cart, addItem, removeItem } from '$lib/stores/cartStore'; // Cart items store with functions
  import { userInfo } from '$lib/stores/userInfoStore'; // New store for user information

  // Calculate total price
  $: total = $cart.reduce((sum, item) => sum + item.quantity * item.price, 0); // Assuming item.price is in cents

  // Format price (assumes price is in cents)
  function formatPrice(price) {
    return `€${(price / 1).toFixed(2)}`;
  }

  // Function to update user information
  function handleInputChange(event) {
    userInfo.update((info) => ({
      ...info,
      [event.target.name]: event.target.value,
    }));
  }

  // Increase quantity of an item
  function increaseQuantity(item) {
    addItem(item);
  }

  // Decrease quantity of an item or remove if quantity is 1
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

  // Remove item from cart completely
  function removeItemFromCart(itemId) {
    removeItem(itemId);
  }
</script>

<div class="container mx-auto p-6 grid grid-cols-1 md:grid-cols-2 gap-8">
  <!-- Left Column: Cart Items and Total -->
  <div>
    <h1 class="text-3xl font-bold mb-6">Your Cart</h1>
    {#if $cart.length === 0}
      <p>Your cart is empty.</p>
    {:else}
      <div class="grid gap-4">
        {#each $cart as item}
          <div class="flex items-center justify-between p-4 bg-gray-100 rounded-lg">
            <div class="flex items-center">
              <!-- WooCommerce uses images array for product images -->
              <img src={item.images[0]?.src} alt={item.name} class="w-16 h-16 rounded-lg mr-4" />
              <div>
                <h3 class="text-lg font-semibold">{item.name}</h3>
                {#if item.variation}
                  <p class="text-sm text-gray-600">Variation: {item.variation}</p>
                {/if}
                <!-- Display the price per item -->
                <p class="text-sm text-gray-600">Price: {formatPrice(item.price)}</p>
              </div>
            </div>

            <div class="flex items-center">
              <!-- Quantity Controls -->
              <button on:click={() => decreaseQuantity(item)} class="bg-white text-purple-500 rounded-md px-2 py-1 font-semibold hover:bg-purple-100">-</button>
              <span class="mx-2">{item.quantity}</span>
              <button on:click={() => increaseQuantity(item)} class="bg-white text-purple-500 rounded-md px-2 py-1 font-semibold hover:bg-purple-100">+</button>
            </div>

            <!-- Remove Button -->
            <button on:click={() => removeItemFromCart(item.id)} class="bg-red-500 text-white rounded-md px-4 py-2 font-semibold hover:bg-red-600">
              Remove
            </button>
          </div>
        {/each}
      </div>

      <!-- Total Price -->
      <div class="mt-6 text-right">
        <h2 class="text-2xl font-bold">Total: {formatPrice(total)}</h2>
      </div>
    {/if}
  </div>

  <!-- Right Column: User Information Form -->
  <div>
    <h1 class="text-3xl font-bold mb-6">Your Information</h1>
    <form class="grid gap-4">
      <label class="block">
        <span class="text-gray-700">Name</span>
        <input type="text" name="name" class="mt-1 block w-full p-2 border rounded" on:input={handleInputChange} placeholder="John Doe" />
      </label>

      <label class="block">
        <span class="text-gray-700">Email</span>
        <input type="email" name="email" class="mt-1 block w-full p-2 border rounded" on:input={handleInputChange} placeholder="example@mail.com" />
      </label>

      <label class="block">
        <span class="text-gray-700">Address</span>
        <input type="text" name="address" class="mt-1 block w-full p-2 border rounded" on:input={handleInputChange} placeholder="123 Main St" />
      </label>

      <label class="block">
        <span class="text-gray-700">Phone</span>
        <input type="tel" name="phone" class="mt-1 block w-full p-2 border rounded" on:input={handleInputChange} placeholder="123-456-7890" />
      </label>
    </form>

    <!-- Proceed Button -->
    {#if $cart.length > 0}
      <div class="mt-6">
        <button class="bg-purple-500 text-white py-2 px-4 rounded-md hover:bg-purple-700">
          Proceed to Payment
        </button>
      </div>
    {/if}
  </div>
</div>

<style>
  .container {
    max-width: 1200px;
  }
</style>

<script>
	import { cart, addItem, removeItem } from '$lib/stores/cartStore';
	import { page } from '$app/stores';
	import { goto } from '$app/navigation';

	let total = $cart.reduce((sum, item) => sum + item.quantity * item.price, 0);

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

	function proceedToCheckout() {
		goto('/checkout');
	}

	function formatPrice(price) {
		return `€${(price / 100).toFixed(2)}`;
	}
</script>

<div class="cart-container mx-auto my-10 p-6 max-w-6xl grid grid-cols-1 md:grid-cols-3 gap-8">
	<!-- Cart Items Section -->
	<div class="col-span-2">
		<h1 class="text-4xl font-bold mb-8">Cart</h1>
		{#if $cart.length === 0}
			<p>Your cart is empty.</p>
		{:else}
			<table class="w-full text-left">
				<thead>
					<tr class="border-b">
						<th class="pb-4">Product</th>
						<th></th>
						<th class="pb-4">Total</th>
					</tr>
				</thead>
				<tbody>
					{#each $cart as item}
						<tr class="border-b">
							<td class="py-4">
								<img src={item.images[0]?.src} alt={item.name} class="h-24 w-24 rounded-md object-cover" />
							</td>
							<td>
								<div>
									<h3 class="text-xl font-semibold">{item.name}</h3>
									<p class="text-gray-600">{formatPrice(item.price)}</p>
									<div class="flex items-center mt-2">
										<button class="border px-3 py-1" on:click={() => decreaseQuantity(item)}>-</button>
										<span class="mx-3">{item.quantity}</span>
										<button class="border px-3 py-1" on:click={() => increaseQuantity(item)}>+</button>
									</div>
									<a href="#" class="text-red-500 text-sm mt-2 inline-block" on:click={() => removeItem(item.id)}>Remove item</a>
								</div>
							</td>
							<td class="py-4 text-right text-lg font-semibold">{formatPrice(item.quantity * item.price)}</td>
						</tr>
					{/each}
				</tbody>
			</table>
		{/if}
	</div>

	<!-- Cart Totals Section -->
	<div class="bg-gray-100 p-6 rounded-lg shadow-md">
		<h2 class="text-2xl font-bold mb-6">Cart Totals</h2>
		<div class="mb-4">
			<label class="block font-semibold mb-2">Add a coupon</label>
			<input type="text" placeholder="Coupon code" class="w-full border border-gray-300 p-2 rounded" />
		</div>
		<div class="flex justify-between text-lg font-semibold">
			<span>Subtotal</span>
			<span>{formatPrice(total)}</span>
		</div>
		<hr class="my-4" />
		<div class="flex justify-between text-2xl font-bold">
			<span>Total</span>
			<span>{formatPrice(total)} EUR</span>
		</div>
		<button on:click={proceedToCheckout} class="w-full mt-6 py-3 bg-black text-white font-semibold rounded hover:bg-gray-800 transition">
			Proceed to Checkout
		</button>
	</div>
</div>

<style>
	.cart-container {
		max-width: 1200px;
	}
</style>

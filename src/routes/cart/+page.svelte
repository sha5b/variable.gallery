<script>
	import { cart, addItem, removeItem } from '$lib/stores/cartStore';
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
		return `€${(price / 1).toFixed(2)}`;
	}
</script>

<div class="cart-container mx-auto my-lg p-md max-w-6xl grid grid-cols-1 md:grid-cols-3 gap-lg">
	<!-- Cart Items Section -->
	<div class="col-span-2">
		<h1 class="text-xlarge font-bold mb-lg">Cart</h1>
		{#if $cart.length === 0}
			<p>Your cart is empty.</p>
		{:else}
			<table class="w-full text-left border-separate space-y-md">
				<thead>
					<tr class="border-b text-large">
						<th class="pb-md">Product</th>
						<th></th>
						<th class="pb-md text-right">Total</th>
					</tr>
				</thead>
				<tbody>
					{#each $cart as item}
						<tr class="border-b">
							<td class="py-md">
								<img src={item.images[0]?.src} alt={item.name} class="h-24 w-24 object-cover" />
							</td>
							<td>
								<div>
									<h3 class="text-base font-semibold">{item.name}</h3>
									<p class="text-gray-600">{formatPrice(item.price)}</p>
									<div class="flex items-center mt-sm gap-xs">
										<button class="quantity-btn" on:click={() => decreaseQuantity(item)}>-</button>
										<span class="mx-3">{item.quantity}</span>
										<button class="quantity-btn" on:click={() => increaseQuantity(item)}>+</button>
									</div>
									<a href="#" class="remove-btn mt-sm inline-block" on:click={() => removeItem(item.id)}>Remove item</a>
								</div>
							</td>
							<td class="py-md text-right text-lg font-semibold">{formatPrice(item.quantity * item.price)}</td>
						</tr>
					{/each}
				</tbody>
			</table>
		{/if}
	</div>

	<!-- Cart Totals Section -->
	<div class="cart-totals p-lg rounded-lg">
		<h2 class="text-large font-bold mb-md">Cart Totals</h2>
		<div class="mb-md">
			<label class="block font-semibold mb-xs">Add a coupon</label>
			<input type="text" placeholder="Coupon code" class="w-full border border-gray-300 p-sm" />
		</div>
		<div class="flex justify-between text-base font-semibold">
			<span>Subtotal</span>
			<span>{formatPrice(total)}</span>
		</div>
		<hr class="my-md" />
		<div class="flex justify-between text-large font-bold">
			<span>Total</span>
			<span>{formatPrice(total)} EUR</span>
		</div>
		<button on:click={proceedToCheckout} class="button-primary w-full mt-md py-md">
			Proceed to Checkout
		</button>
	</div>
</div>

<style>
	.cart-container {
		max-width: 1200px;
	}

	/* Cart Totals Styling */
	.cart-totals {
		padding: var(--spacing-lg);
	}

	.quantity-btn {
		padding: var(--spacing-xs) var(--spacing-sm);
		border: 1px solid var(--border-color);
		border-radius: var(--rounded-sm);
	}

	/* Remove button styling */
	.remove-btn {
		margin-top: var(--spacing-sm);
		color: #ffffff; /* Ensures text is visible on red background */
		background-color: var(--error-color);
		padding: var(--spacing-xs) var(--spacing-sm);
		border-radius: var(--rounded-sm);
		display: inline-block;
		text-align: center;
		font-weight: bold;
	}

	/* Responsive adjustments */
	@media (max-width: 767px) {
		.cart-container {
			padding: var(--spacing-md) var(--spacing-sm);
		}

		.cart-totals {
			width: 100%;
		}
	}
</style>

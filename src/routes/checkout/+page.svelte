<script>
	import { cart } from '$lib/stores/cartStore';
	import { goto } from '$app/navigation';

	let userInfo = {
		email: '',
		firstName: '',
		lastName: '',
		address: '',
		apartment: '',
		postalCode: '',
		city: '',
		phone: '',
		country: 'Austria'
	};

	let savePaymentInfo = false;
	let addOrderNote = false;

	// Calculate the total price
	let total = $cart.reduce((sum, item) => sum + item.quantity * item.price, 0);

	// Format price function
	function formatPrice(price) {
		return `€${(price / 1).toFixed(2)}`;
	}

	

	async function placeOrder() {
		// Log all variables for debugging
		console.log("User Info:", userInfo);
		console.log("Cart Items:", $cart);
		console.log("Total Price:", total);
		console.log("Save Payment Info:", savePaymentInfo);
		console.log("Add Order Note:", addOrderNote);

		const orderDetails = {
			billing: userInfo,
			shipping: userInfo,
			cart: $cart,
			payment_method: 'bacs' // Example payment method
		};

		console.log("Order Details:", orderDetails);

		try {
			const response = await fetch('/checkout', {
				method: 'POST',
				headers: { 'Content-Type': 'application/json' },
				body: JSON.stringify(orderDetails)
			});

			// Check response
			console.log("Server Response:", response);

			const text = await response.text();
			let result;
			try {
				result = JSON.parse(text); // Parse only if JSON
				console.log("Parsed Result:", result);
			} catch {
				console.error('Non-JSON response:', text);
				throw new Error('Failed to place order. Check server response.');
			}

			if (result.success) {
				goto(`/order-confirmation?orderId=${result.orderId}`);
			} else {
				console.error('Order failed:', result.error);
			}
		} catch (error) {
			console.error('An error occurred:', error);
		}
	}
</script>


<div class="checkout-container mx-auto my-10 grid max-w-6xl grid-cols-1 gap-8 p-6 md:grid-cols-3">
	<!-- Left Column: Contact and Billing Information -->
	<div class="col-span-2 space-y-6">
		<h1 class="text-4xl font-bold">Checkout</h1>

		<!-- Contact Information -->
		<div>
			<h2 class="text-lg font-semibold">Contact information</h2>
			<p class="mb-2 text-gray-500">
				We'll use this email to send you details and updates about your order.
			</p>
			<input
				type="email"
				bind:value={userInfo.email}
				placeholder="Email address"
				class="mb-4 w-full rounded border border-gray-300 p-2"
			/>
		</div>

		<!-- Billing Address -->
		<div>
			<h2 class="text-lg font-semibold">Billing address</h2>
			<p class="mb-2 text-gray-500">Enter the billing address that matches your payment method.</p>

			<select bind:value={userInfo.country} class="mb-4 w-full rounded border border-gray-300 p-2">
				<option value="Austria">Austria</option>
				<option value="Germany">Germany</option>
				<option value="Switzerland">Switzerland</option>
			</select>

			<div class="grid grid-cols-2 gap-4">
				<input
					type="text"
					bind:value={userInfo.firstName}
					placeholder="First name"
					class="w-full rounded border border-gray-300 p-2"
				/>
				<input
					type="text"
					bind:value={userInfo.lastName}
					placeholder="Last name"
					class="w-full rounded border border-gray-300 p-2"
				/>
			</div>
			<input
				type="text"
				bind:value={userInfo.address}
				placeholder="Address"
				class="my-4 w-full rounded border border-gray-300 p-2"
			/>
			<input
				type="text"
				bind:value={userInfo.apartment}
				placeholder="Add apartment, suite, etc."
				class="mb-4 w-full rounded border border-gray-300 p-2"
			/>

			<div class="grid grid-cols-2 gap-4">
				<input
					type="text"
					bind:value={userInfo.postalCode}
					placeholder="Postal code"
					class="w-full rounded border border-gray-300 p-2"
				/>
				<input
					type="text"
					bind:value={userInfo.city}
					placeholder="City"
					class="w-full rounded border border-gray-300 p-2"
				/>
			</div>
			<input
				type="tel"
				bind:value={userInfo.phone}
				placeholder="Phone (optional)"
				class="my-4 w-full rounded border border-gray-300 p-2"
			/>
		</div>

		<!-- Payment Options -->
		<div>
			<h2 class="text-lg font-semibold">Payment options</h2>
			<div class="rounded border border-gray-300 p-4">
				<p class="mb-2 font-semibold">Credit card / debit card</p>
				<div class="mb-4 flex gap-2">
					<input
						type="text"
						placeholder="Card number"
						class="w-full rounded border border-gray-300 p-2"
					/>
					<input
						type="text"
						placeholder="Expiration date"
						class="w-full rounded border border-gray-300 p-2"
					/>
					<input
						type="text"
						placeholder="Security code"
						class="w-full rounded border border-gray-300 p-2"
					/>
				</div>
				<div class="flex items-center">
					<input type="checkbox" bind:checked={savePaymentInfo} class="mr-2" />
					<label>Save payment information to my account for future purchases.</label>
				</div>
			</div>
		</div>

		<!-- Additional Options -->
		<div class="flex items-center">
			<input type="checkbox" bind:checked={addOrderNote} class="mr-2" />
			<label>Add a note to your order</label>
		</div>
	</div>

	<!-- Right Column: Order Summary -->
	<div class="rounded-lg bg-gray-100 p-6">
		<h2 class="mb-6 text-2xl font-bold">Order summary</h2>
		{#each $cart as item}
			<div class="mb-4 flex justify-between">
				<div class="flex items-center">
					<img
						src={item.images[0]?.src}
						alt={item.name}
						class="mr-4 h-16 w-16 rounded-md object-cover"
					/>
					<div>
						<p class="font-semibold">{item.name}</p>
						<p class="text-gray-600">{formatPrice(item.price)}</p>
					</div>
				</div>
				<p class="font-semibold">{formatPrice(item.quantity * item.price)}</p>
			</div>
		{/each}

		<!-- Coupon and Totals -->
		<div class="mb-4">
			<label class="mb-2 block font-semibold">Add a coupon</label>
			<input
				type="text"
				placeholder="Coupon code"
				class="w-full rounded border border-gray-300 p-2"
			/>
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

		<button
			on:click={placeOrder}
			class="mt-6 w-full rounded bg-black py-3 font-semibold text-white transition hover:bg-gray-800"
		>
			Place Order
		</button>
	</div>
</div>

<style>
	.checkout-container {
		max-width: 1200px;
	}
	.object-cover {
		object-fit: cover;
	}
</style>

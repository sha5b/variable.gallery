<script>
	import { cart } from '$lib/stores/cartStore'; // Import your cart store
	import { goto } from '$app/navigation';
	import { fetchWooCommerceData } from '$lib/api'; // Ensure this is for the V3 API

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

async function placeOrder() {
    if (!userInfo.email || !validateEmail(userInfo.email)) {
        alert("Please enter a valid email address.");
        return;
    }

    const lineItems = $cart.map((item) => ({
        product_id: item.id,
        quantity: item.quantity
    }));

    const orderData = {
        payment_method: 'bacs',
        payment_method_title: 'Direct Bank Transfer',
        set_paid: false,
        billing: {
            first_name: userInfo.firstName,
            last_name: userInfo.lastName,
            address_1: userInfo.address,
            city: userInfo.city,
            postcode: userInfo.postalCode,
            country: userInfo.country,
            email: userInfo.email,
            phone: userInfo.phone
        },
        line_items: lineItems,
        customer_note: addOrderNote ? 'Customer added a note' : ''
    };

    try {
        const response = await fetchWooCommerceData('orders', {
            method: 'POST',
            body: JSON.stringify(orderData)
        });

        if (response && response.id) {
            console.log('Order created:', response);
            goto(`/order-confirmation/${response.id}`);
        } else {
            console.error('Order creation failed:', response);
            alert('Order creation failed. Please check WooCommerce logs.');
        }
    } catch (error) {
        console.error('Error creating order:', error);
        alert('Error creating order. Please try again.');
    }
}

// Email validation helper
function validateEmail(email) {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return emailRegex.test(email);
}


	// Calculate total price from cart
	let total = $cart.reduce((sum, item) => sum + item.quantity * item.price, 0);
	function formatPrice(price) {
		return `€${(price / 100).toFixed(2)}`;
	}
</script>

<div class="checkout-container mx-auto my-10 p-6 max-w-6xl grid grid-cols-1 md:grid-cols-3 gap-8">
	<!-- Left Column: Contact and Billing Information -->
	<div class="col-span-2 space-y-6">
		<h1 class="text-4xl font-bold">Checkout</h1>

		<!-- Contact Information -->
		<div>
			<h2 class="text-lg font-semibold">Contact information</h2>
			<p class="text-gray-500 mb-2">We'll use this email to send you details and updates about your order.</p>
			<input type="email" bind:value={userInfo.email} placeholder="Email address" class="w-full border border-gray-300 p-2 rounded mb-4" />
		</div>

		<!-- Billing Address -->
		<div>
			<h2 class="text-lg font-semibold">Billing address</h2>
			<p class="text-gray-500 mb-2">Enter the billing address that matches your payment method.</p>

			<select bind:value={userInfo.country} class="w-full border border-gray-300 p-2 rounded mb-4">
				<option value="Austria">Austria</option>
				<option value="Germany">Germany</option>
				<option value="Switzerland">Switzerland</option>
			</select>

			<div class="grid grid-cols-2 gap-4">
				<input type="text" bind:value={userInfo.firstName} placeholder="First name" class="w-full border border-gray-300 p-2 rounded" />
				<input type="text" bind:value={userInfo.lastName} placeholder="Last name" class="w-full border border-gray-300 p-2 rounded" />
			</div>
			<input type="text" bind:value={userInfo.address} placeholder="Address" class="w-full border border-gray-300 p-2 rounded my-4" />
			<input type="text" bind:value={userInfo.apartment} placeholder="Add apartment, suite, etc." class="w-full border border-gray-300 p-2 rounded mb-4" />

			<div class="grid grid-cols-2 gap-4">
				<input type="text" bind:value={userInfo.postalCode} placeholder="Postal code" class="w-full border border-gray-300 p-2 rounded" />
				<input type="text" bind:value={userInfo.city} placeholder="City" class="w-full border border-gray-300 p-2 rounded" />
			</div>
			<input type="tel" bind:value={userInfo.phone} placeholder="Phone (optional)" class="w-full border border-gray-300 p-2 rounded my-4" />
		</div>

		<!-- Payment Options -->
		<div>
			<h2 class="text-lg font-semibold">Payment options</h2>
			<div class="border border-gray-300 rounded p-4">
				<p class="font-semibold mb-2">Credit card / debit card</p>
				<div class="flex gap-2 mb-4">
					<input type="text" placeholder="Card number" class="w-full border border-gray-300 p-2 rounded" />
					<input type="text" placeholder="Expiration date" class="w-full border border-gray-300 p-2 rounded" />
					<input type="text" placeholder="Security code" class="w-full border border-gray-300 p-2 rounded" />
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
	<div class="bg-gray-100 p-6 rounded-lg ">
		<h2 class="text-2xl font-bold mb-6">Order summary</h2>
		{#each $cart as item}
			<div class="flex justify-between mb-4">
				<div class="flex items-center">
					<img src={item.images[0]?.src} alt={item.name} class="h-16 w-16 rounded-md object-cover mr-4" />
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

		<button on:click={placeOrder} class="w-full mt-6 py-3 bg-black text-white font-semibold rounded hover:bg-gray-800 transition">
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

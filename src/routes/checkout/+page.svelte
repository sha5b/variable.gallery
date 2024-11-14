<script>
	import { onMount } from 'svelte';
	import { loadStripe } from '@stripe/stripe-js';
	import { userInfo } from '$lib/stores/userInfoStore';
	import { cart } from '$lib/stores/cartStore';
	import { get } from 'svelte/store';
	import { fetchWooCommerceData } from '$lib/api';
	export let data;
	const {products} = data

	let stripe, elements, cardElement, paymentRequest, prButton;
	let amount = 1000; // Example amount in cents
	let currency = 'usd';
	let paymentSuccess = false;
	let paymentError = '';
	let cartItems = [];
	let validationErrors = {};

	onMount(async () => {
		stripe = await loadStripe(import.meta.env.VITE_STRIPE_PUBLISHABLE_KEY);
		elements = stripe.elements();
		cartItems = get(cart);

		paymentRequest = stripe.paymentRequest({
			country: 'US',
			currency: currency,
			total: { label: 'Total', amount: amount },
			requestPayerName: true,
			requestPayerEmail: true
		});

		const canMakePayment = await paymentRequest.canMakePayment();
		if (canMakePayment) {
			prButton = elements.create('paymentRequestButton', { paymentRequest });
			prButton.mount('#payment-request-button');
		}

		cardElement = elements.create('card', {
			style: {
				base: {
					color: 'var(--text-color)',
					fontFamily: 'var(--font-primary)',
					fontSize: '16px',
					'::placeholder': { color: 'var(--secondary-color)' }
				}
			}
		});
		cardElement.mount('#card-element');

		paymentRequest.on('paymentmethod', async (event) => {
			const response = await fetch('/checkout', {
				method: 'POST',
				headers: { 'Content-Type': 'application/json' },
				body: JSON.stringify({ amount, currency })
			});
			const { clientSecret } = await response.json();
			if (!clientSecret) return event.complete('fail');
			const { error } = await stripe.confirmCardPayment(
				clientSecret,
				{ payment_method: event.paymentMethod.id },
				{ handleActions: false }
			);
			if (error) return event.complete('fail');
			paymentSuccess = true;
			event.complete('success');
		});
	});

	function validateForm() {
		validationErrors = {};
		const user = get(userInfo);

		// Validation logic for each required field
		if (!user.firstName) validationErrors.firstName = 'First name is required.';
		if (!user.lastName) validationErrors.lastName = 'Last name is required.';
		if (!user.email || !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(user.email))
			validationErrors.email = 'Valid email is required.';
		if (!user.address) validationErrors.address = 'Address is required.';
		if (!user.city) validationErrors.city = 'City is required.';
		if (!user.postalCode || !/^\d{5}(-\d{4})?$/.test(user.postalCode))
			validationErrors.postalCode = 'Valid postal code is required.';
		if (!user.phone || !/^\d{10,15}$/.test(user.phone))
			validationErrors.phone = 'Valid phone number is required.';

		return Object.keys(validationErrors).length === 0;
	}

	async function handlePayment() {
		paymentError = '';
		if (!validateForm()) {
			console.error('Form validation failed:', validationErrors);
			return;
		}

		try {
			console.log('Creating PaymentIntent...');
			const response = await fetch('/checkout', {
				method: 'POST',
				headers: { 'Content-Type': 'application/json' },
				body: JSON.stringify({ amount, currency })
			});
			const result = await response.json();
			if (!result.success) throw new Error(result.error || 'PaymentIntent creation failed');

			const clientSecret = result.clientSecret;
			const user = get(userInfo);

			console.log('Confirming payment with Stripe...');
			const confirmation = await stripe.confirmCardPayment(clientSecret, {
				payment_method: {
					card: cardElement,
					billing_details: { name: `${user.firstName} ${user.lastName}`, email: user.email }
				}
			});

			if (confirmation.error) {
				paymentError = confirmation.error.message;
			} else if (confirmation.paymentIntent && confirmation.paymentIntent.status === 'succeeded') {
				// Payment successful, now create WooCommerce order
				console.log('Payment successful, creating WooCommerce order...');
				const orderId = await createWooCommerceOrder();
				
				if (!orderId) {
					throw new Error('Failed to create WooCommerce order.');
				}

				// Store orderId in userInfo and sessionStorage
				userInfo.update((info) => {
					const updatedInfo = { ...info, orderId };
					sessionStorage.setItem('orderId', orderId);
					return updatedInfo;
				});

				// Set payment success and clear cart
				paymentSuccess = true;
				cart.set([]); // Clear the cart after successful order

				// Redirect to order confirmation page
				window.location.href = `/order-confirmation/${orderId}`;
			}
		} catch (error) {
			console.error('Payment/Order Creation Error:', error);
			paymentError = error.message || 'An error occurred during the payment process. Please try again.';
		}
	}

	async function createWooCommerceOrder() {
		try {
			const user = get(userInfo);
			const cartData = get(cart).map((item) => ({
				product_id: item.id,
				quantity: item.quantity
			}));

			const orderData = {
				payment_method: 'stripe',
				payment_method_title: 'Stripe',
				set_paid: true,
				billing: {
					first_name: user.firstName,
					last_name: user.lastName,
					address_1: user.address,
					city: user.city,
					postcode: user.postalCode,
					country: 'US',
					email: user.email,
					phone: user.phone
				},
				shipping: {
					first_name: user.firstName,
					last_name: user.lastName,
					address_1: user.address,
					city: user.city,
					postcode: user.postalCode,
					country: 'US'
				},
				line_items: cartData,
				shipping_lines: [{ method_id: 'flat_rate', method_title: 'Flat Rate', total: '10.00' }]
			};

			const result = await fetchWooCommerceData('orders', {
				method: 'POST',
				headers: { 'Content-Type': 'application/json' },
				body: JSON.stringify(orderData)
			});

			if (!result.id) throw new Error('Order creation failed in WooCommerce');
			console.log('Order created in WooCommerce:', result);
			return result.id; // Return orderId for confirmation page
		} catch (error) {
			console.error('WooCommerce Order Creation Error:', error);
			paymentError = 'Failed to create order in WooCommerce. Please contact support.';
			return null;
		}
	}

</script>

<div class="checkout-wrapper">
	<!-- Left Column: User Information Form -->
	<div class="user-info-container bg-background rounded-lg p-lg">
		<h2 class="text-xlarge font-heading text-primary mb-lg border-b pb-md">Shipping Information</h2>
		<form class="user-info-form">
			<div class="form-group">
				<label for="firstName">First Name</label>
				<input
					id="firstName"
					type="text"
					bind:value={$userInfo.firstName}
					placeholder="Your First Name"
					class="input-field"
				/>
				{#if validationErrors.firstName}
					<p class="error">{validationErrors.firstName}</p>
				{/if}
			</div>

			<div class="form-group">
				<label for="lastName">Last Name</label>
				<input
					id="lastName"
					type="text"
					bind:value={$userInfo.lastName}
					placeholder="Your Last Name"
					class="input-field"
				/>
				{#if validationErrors.lastName}
					<p class="error">{validationErrors.lastName}</p>
				{/if}
			</div>

			<div class="form-group">
				<label for="email">Email</label>
				<input
					id="email"
					type="email"
					bind:value={$userInfo.email}
					placeholder="Your Email"
					class="input-field"
				/>
				{#if validationErrors.email}
					<p class="error">{validationErrors.email}</p>
				{/if}
			</div>

			<div class="form-group">
				<label for="address">Address</label>
				<textarea
					id="address"
					bind:value={$userInfo.address}
					placeholder="Your Address"
					class="input-field"
				></textarea>
				{#if validationErrors.address}
					<p class="error">{validationErrors.address}</p>
				{/if}
			</div>

			<div class="form-group">
				<label for="city">City</label>
				<input
					id="city"
					type="text"
					bind:value={$userInfo.city}
					placeholder="Your City"
					class="input-field"
				/>
				{#if validationErrors.city}
					<p class="error">{validationErrors.city}</p>
				{/if}
			</div>

			<div class="form-group">
				<label for="postalCode">Postal Code</label>
				<input
					id="postalCode"
					type="text"
					bind:value={$userInfo.postalCode}
					placeholder="Your Postal Code"
					class="input-field"
				/>
				{#if validationErrors.postalCode}
					<p class="error">{validationErrors.postalCode}</p>
				{/if}
			</div>

			<div class="form-group">
				<label for="phone">Phone</label>
				<input
					id="phone"
					type="text"
					bind:value={$userInfo.phone}
					placeholder="Your Phone"
					class="input-field"
				/>
				{#if validationErrors.phone}
					<p class="error">{validationErrors.phone}</p>
				{/if}
			</div>
		</form>
	</div>

	<!-- Right Column: Cart Summary and Payment -->
	<div class="order-summary-container">
		<!-- Cart Summary -->
		<div class="cart-summary bg-background rounded-lg p-lg mb-lg">
			<h2 class="text-xlarge font-heading text-primary mb-lg border-b pb-md">Cart Summary</h2>
			{#each cartItems as item}
				<div class="cart-item gap-sm flex items-center">
					<a href={`/shop/${item.id}`} class="product-image-link">
						<img
							src={item.images[0]?.src || '/placeholder.jpg'}
							alt={item.name}
							class="product-image-large"
						/>
					</a>
					<div class="item-details">
						<p class="font-heading text-lg">{item.name}</p>
						<p class="text-secondary-color text-sm">Quantity: {item.quantity}</p>
						<p class="text-primary-color text-sm">Price: ${(item.price / 1).toFixed(2)}</p>
					</div>
				</div>
			{/each}

			<!-- Price Breakdown -->
			<div class="price-breakdown mt-4 pt-4 border-t space-y-2">
				<div class="flex justify-between text-base">
					<span class="text-secondary-color">Subtotal</span>
					<span>€{cartItems.reduce((sum, item) => sum + (item.price * item.quantity), 0).toFixed(2)}</span>
				</div>
				<div class="flex justify-between text-base">
					<span class="text-secondary-color">Shipping</span>
					<span>€15.00</span>
				</div>
				<div class="flex justify-between text-large font-bold mt-4 pt-4 border-t">
					<span>Total</span>
					<span>€{(cartItems.reduce((sum, item) => sum + (item.price * item.quantity), 0) + 15).toFixed(2)}</span>
				</div>
			</div>
		</div>

		<!-- Payment Section -->
		<div class="payment-section bg-background rounded-lg p-lg">
			<h2 class="text-xlarge font-heading text-primary mb-lg border-b pb-md">Payment Details</h2>
			{#if paymentSuccess}
				<p class="text-accent-color font-heading text-lg">
					Payment successful! Thank you for your purchase.
				</p>
			{:else}
				<div id="payment-request-button" class="payment-request-button mb-8"></div>
				<form on:submit|preventDefault={handlePayment} class="payment-form">
					<label for="card-element" class="font-heading text-secondary-color block text-base"
						>Credit or Debit Card</label
					>
					<div id="card-element" class="card-element padding-sm"></div>
					{#if paymentError}
						<p class="error text-error-color text-sm">{paymentError}</p>
					{/if}
					<button type="submit" class="button-primary w-full">Pay Now</button>
				</form>
			{/if}
		</div>
	</div>
</div>

<style>
	.checkout-wrapper {
		display: flex;
		gap: var(--spacing-lg);
		max-width: 1200px;
		margin: auto;
		padding: var(--page-padding-md);
	}
	.user-info-container,
	.order-summary-container {
		flex: 1;
	}
	.user-info-form,
	.cart-summary,
	.payment-form {
		display: flex;
		flex-direction: column;
		gap: var(--spacing-sm);
	}
	.input-field,
	.card-element,
	.button-primary {
		width: 100%;
		padding: var(--spacing-sm);
		border: 1px solid #ddd;
		border-radius: 4px;
		font-size: var(--font-size-base);
	}
	.product-image-large {
		width: 80px;
		height: 80px;
		object-fit: cover;
		border-radius: 4px;
		margin-right: var(--spacing-sm);
	}
	.button-primary {
		background-color: var(--primary-color);
		color: #fff;
		border: none;
		cursor: pointer;
		padding: var(--spacing-sm) var(--spacing-md);
		transition: background-color 0.3s ease;
	}
	.button-primary:hover {
		background-color: var(--secondary-color);
	}
	.error {
		color: var(--error-color);
	}
</style>

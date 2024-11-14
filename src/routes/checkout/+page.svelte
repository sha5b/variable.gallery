<script>
	import { onMount } from 'svelte';
	import { loadStripe } from '@stripe/stripe-js';
	import { userInfo } from '$lib/stores/userInfoStore';
	import { cart } from '$lib/stores/cartStore';
	import { get } from 'svelte/store';
	import { fetchWooCommerceData } from '$lib/api';
	import { goto } from '$app/navigation';

	export let data
	const { products } = data
	
	let stripe, elements, cardElement, paymentRequest, prButton;
	let amount;
	let shippingCost = 1000; // 10.00 in cents
	let currency = 'usd';
	let paymentSuccess = false;
	let paymentError = '';
	let cartItems = [];
	let validationErrors = {};
	let selectedCountry = '';

	onMount(async () => {
		stripe = await loadStripe(import.meta.env.VITE_STRIPE_PUBLISHABLE_KEY);
		elements = stripe.elements();
		cartItems = get(cart);

		// Log initial cart and user data
		console.log('Cart Items:', {
			items: cartItems,
			count: cartItems.length,
			itemDetails: cartItems.map(item => ({
				id: item.id,
				title: item.title?.rendered,
				name: item.name,
				price: item.price,
				quantity: item.quantity
			}))
		});

		console.log('User Info:', get(userInfo));
		console.log('Products:', products);

		// Calculate total including shipping
		amount = Math.round(cartItems.reduce((sum, item) => {
			const itemPrice = parseFloat(item.price);
			return sum + (item.quantity * (itemPrice * 100));
		}, 0) + shippingCost);

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
					fontSize: '14px',
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

		// Log price calculations
		const subtotal = cartItems.reduce((sum, item) => sum + (item.quantity * item.price), 0);
		console.log('Price Breakdown:', {
			subtotal: subtotal,
			shippingCost: shippingCost/100,
			total: (subtotal + shippingCost/100),
			rawAmount: amount
		});

		// Log Stripe setup
		console.log('Stripe Config:', {
			currency,
			totalAmount: amount,
			paymentRequestAvailable: !!paymentRequest
		});

		// Log validation state
		console.log('Validation Errors:', validationErrors);
	});

	function validateForm() {
		validationErrors = {};
		const user = get(userInfo);

		// Email validation (more strict)
		const emailRegex = /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/;
		if (!user.email || !emailRegex.test(user.email)) {
			validationErrors.email = 'Please enter a valid email address';
		}

		// Phone validation (international format)
		const phoneRegex = /^\+?[1-9]\d{1,14}$/;
		if (!user.phone || !phoneRegex.test(user.phone.replace(/\s+/g, ''))) {
			validationErrors.phone = 'Please enter a valid international phone number (e.g., +49123456789)';
		}

		// Address validation (more comprehensive)
		if (!user.address || user.address.length < 5) {
			validationErrors.address = 'Please enter a complete street address (minimum 5 characters)';
		}

		// Postal code validation (customize for target countries)
		const postalRegex = /^[0-9]{4,6}$/;
		if (!user.postalCode || !postalRegex.test(user.postalCode)) {
			validationErrors.postalCode = 'Please enter a valid postal code (4-6 digits)';
		}

		// Name validation (more strict)
		const nameRegex = /^[a-zA-ZäöüßÄÖÜ\s-]{2,}$/;
		if (!user.firstName || !nameRegex.test(user.firstName)) {
			validationErrors.firstName = 'Please enter a valid first name (minimum 2 characters, letters only)';
		}
		if (!user.lastName || !nameRegex.test(user.lastName)) {
			validationErrors.lastName = 'Please enter a valid last name (minimum 2 characters, letters only)';
		}

		// City validation
		if (!user.city || !nameRegex.test(user.city)) {
			validationErrors.city = 'Please enter a valid city name';
		}

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
				paymentSuccess = true;

				// Step 3: Create WooCommerce Order
				const orderId = await createWooCommerceOrder();
				if (!orderId) throw new Error('Failed to create WooCommerce order.');

				// Store orderId in userInfo
				userInfo.update((info) => {
					const updatedInfo = { ...info, orderId };
					sessionStorage.setItem('orderId', orderId); // Save to sessionStorage
					return updatedInfo;
				});
				// Redirect to order confirmation page
				// window.location.href = `/order-confirmation`;
			}
		} catch (error) {
			paymentError =
				error.message || 'An error occurred during the payment process. Please try again.';
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

	// Helper function to safely format price
	function formatPrice(price) {
		const numPrice = parseFloat(price);
		return !isNaN(numPrice) ? numPrice.toFixed(2) : '0.00';
	}

	function goToProduct(productId) {
		goto(`/shop/${productId}`);
	}

	$: cartItems = get(cart).map(item => {
		const matchingProduct = products.find(p => p.id === (item.parent_id || item.id));
		return {
			...item,
			displayName: matchingProduct?.name || item.name,
			price: parseFloat(item.price)
		};
	});

	// Debug log to verify the mapping
	console.log('Cart Items with Product Names:', cartItems.map(item => ({
		id: item.id,
		productId: item.id,
		matchingProductName: products.find(p => p.id === item.id)?.name,
		finalName: item.displayName,
		price: item.price
	})));
</script>

<div class="checkout-wrapper">
	<!-- Left Column: User Information Form -->
	<div class="user-info-container">
		<form class="user-info-form">
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

			<div class="form-group">
				<label for="country">Country</label>
				<select 
					id="country" 
					bind:value={selectedCountry}
					class="input-field"
					required
				>
					<option value="">Select a country</option>
					<option value="GB">United Kingdom</option>
					<option value="DE">Germany</option>
					<option value="FR">France</option>
					<option value="US">United States</option>
					<option value="other">Other</option>
				</select>
			</div>
		</form>
	</div>

	<!-- Right Column: Cart Summary and Payment -->
	<div class="order-summary-container bg-background p-lg rounded-lg">
		<h2 class="text-xlarge font-bold mb-lg text-primary">Order Summary</h2>
		
		{#each cartItems as item}
			<div class="cart-item flex items-start mb-md p-md border-b border-border-color">
				<!-- Clickable image -->
				<div class="cursor-pointer" on:click={() => goToProduct(item.parent_id || item.id)}>
					<img 
						src={item.images[0]?.src || '/placeholder.jpg'} 
						alt={item.displayName}
						class="product-image rounded-sm hover:opacity-80 transition-opacity"
					/>
				</div>
				
				<div class="item-details ml-md">
					<h3 class="text-base font-semibold text-primary">{item.displayName}</h3>
					<p class="text-sm text-secondary-color">Quantity: {item.quantity}</p>
					<p class="text-base font-medium">€{formatPrice(item.price)}</p>
				</div>
			</div>
		{/each}

		<div class="cost-breakdown bg-lighter p-md rounded-sm mt-lg">
			<div class="flex justify-between mb-sm">
				<span class="text-secondary-color">Subtotal</span>
				<span class="font-medium">€{formatPrice(amount/100 - shippingCost/100)}</span>
			</div>
			<div class="flex justify-between mb-sm">
				<span class="text-secondary-color">Shipping</span>
				<span class="font-medium">€{formatPrice(shippingCost/100)}</span>
			</div>
			<div class="flex justify-between text-lg font-bold mt-md pt-md border-t border-border-color">
				<span>Total</span>
				<span>€{formatPrice(amount/100)}</span>
			</div>
		</div>
	</div>
</div>

<style>
	.checkout-wrapper {
		display: grid;
		grid-template-columns: 1fr 1fr;
		gap: var(--spacing-xl);
		max-width: 1200px;
		margin: 2rem auto;
		padding: var(--spacing-lg);
	}

	.user-info-container, .order-summary-container {
		padding: var(--spacing-lg);
	}

	.input-field {
		border: 1px solid var(--border-color);
		padding: var(--spacing-sm);
		margin-bottom: var(--spacing-md);
		width: 100%;
		background-color: var(--bg-lighter-color);
	}

	.input-field:focus {
		outline: none;
		border-color: var(--primary-color);
	}

	.product-image {
		width: 80px;
		height: 80px;
		object-fit: cover;
	}

	.error {
		color: var(--error-color);
		font-size: 0.875rem;
		margin-top: -0.5rem;
		margin-bottom: var(--spacing-sm);
	}

	.cost-breakdown {
		padding: var(--spacing-md);
	}

	label {
		display: block;
		margin-bottom: var(--spacing-xs);
		color: var(--text-color);
	}

	@media (max-width: 768px) {
		.checkout-wrapper {
			grid-template-columns: 1fr;
			padding: var(--spacing-md);
		}
	}

	.cart-item {
		padding: 1rem 0;
		border-bottom: 1px solid var(--border-color);
	}

	.cost-breakdown {
		background-color: var(--bg-lighter-color);
		padding: 1rem;
		border-radius: 4px;
	}

	.product-image {
		width: 60px;
		height: 60px;
		object-fit: cover;
	}

	.item-details {
		flex: 1;
	}

	.cost-breakdown {
		margin-top: 1rem;
		padding: 1rem 0;
		border-top: 1px solid var(--border-color);
	}

	.product-image {
		width: 48px;
		height: 48px;
		object-fit: cover;
	}

	.item-details {
		flex: 1;
	}

	.order-summary-container {
		box-shadow: var(--shadow-sm);
	}

	.cart-item:hover {
		background-color: var(--bg-lighter-color);
	}
</style>

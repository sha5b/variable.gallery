<script>
	import { onMount } from 'svelte';
	import { loadStripe } from '@stripe/stripe-js';
	import { userInfo } from '$lib/stores/userInfoStore';
	import { cart, addItem, removeItem } from '$lib/stores/cartStore';
	import { get } from 'svelte/store';
	import { fetchWooCommerceData } from '$lib/api';
	import { goto } from '$app/navigation';
	import { defaultSEO, generateMetaTags } from '$lib/utils/seo';

	export let data;
	const { products } = data;

	let stripe, elements, cardElement, paymentRequest, prButton;
	let paymentSuccess = false;
	let paymentError = '';
	$: cartItems = $cart;
	let validationErrors = {};

	// Create checkout-specific SEO
	const pageSEO = {
		...defaultSEO,
		title: 'Checkout | variable.gallery',
		description: 'Securely complete your purchase of digital artworks and NFTs. Enter your shipping and payment details to finalize your order.',
		keywords: [
			...defaultSEO.keywords,
			'checkout',
			'secure payment',
			'digital art purchase',
			'NFT checkout',
			'shipping details'
		],
		openGraph: {
			...defaultSEO.openGraph,
			title: 'Checkout | variable.gallery',
			description: 'Securely complete your purchase of digital artworks and NFTs. Enter your shipping and payment details to finalize your order.',
			url: 'https://variable.gallery/checkout'
		}
	};

	$: metaTags = generateMetaTags(pageSEO);

	onMount(async () => {
		stripe = await loadStripe(import.meta.env.VITE_STRIPE_PUBLISHABLE_KEY);
		elements = stripe.elements();

		// Create payment request button
		paymentRequest = stripe.paymentRequest({
			country: 'US',
			currency: 'eur',
			total: {
				label: 'Total',
				amount: cartItems.reduce((sum, item) => sum + (item.price * item.quantity), 0) * 100 + 1500
			},
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

	// Calculate totals
	$: subtotal = cartItems.reduce((sum, item) => {
		const itemPrice = typeof item.price === 'string' ? parseFloat(item.price) : item.price;
		return sum + (itemPrice * item.quantity);
	}, 0);

	$: shippingCost = 15.00;
	$: total = subtotal + shippingCost;

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
				body: JSON.stringify({ 
					amount: Math.round(total * 100), // Convert to cents
					currency: 'eur'
				})
			});

			const result = await response.json();
			if (!result.success) throw new Error(result.error || 'PaymentIntent creation failed');

			const clientSecret = result.clientSecret;
			const user = get(userInfo);

			console.log('Confirming payment with Stripe...');
			const confirmation = await stripe.confirmCardPayment(clientSecret, {
				payment_method: {
					card: cardElement,
					billing_details: { 
						name: `${user.firstName} ${user.lastName}`, 
						email: user.email 
					}
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

	// Helper function to parse and format price
	function formatPrice(price) {
		const numPrice = typeof price === 'string' ? parseFloat(price) : price;
		return `€${numPrice.toFixed(2)}`;
	}

	// Modified remove function to handle reactive updates
	async function handleRemoveItem(itemId) {
		removeItem(itemId);
		// Force reactive update of totals
		subtotal = cartItems.reduce((sum, item) => {
			const itemPrice = typeof item.price === 'string' ? parseFloat(item.price) : item.price;
			return sum + (itemPrice * item.quantity);
		}, 0);
	}

	function increaseQuantity(item) {
		addItem(item);
		// Force reactive update of totals
		subtotal = cartItems.reduce((sum, item) => {
			const itemPrice = typeof item.price === 'string' ? parseFloat(item.price) : item.price;
			return sum + (itemPrice * item.quantity);
		}, 0);
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
		// Force reactive update of totals
		subtotal = cartItems.reduce((sum, item) => {
			const itemPrice = typeof item.price === 'string' ? parseFloat(item.price) : item.price;
			return sum + (itemPrice * item.quantity);
		}, 0);
	}
</script>

<svelte:head>
	<title>{pageSEO.title}</title>
	{#each metaTags as tag}
		{#if tag.name}
			<meta name={tag.name} content={tag.content}>
		{:else if tag.property}
			<meta property={tag.property} content={tag.content}>
		{/if}
	{/each}
</svelte:head>

<div class="px-page pb-12">
	<div class="checkout-container gap-md flex w-full flex-col md:flex-row">
		<!-- Left Column: Shipping Information -->
		<div class="shipping-info bg-background rounded-lg md:w-1/2">
			<h2 class="text-xlarge font-heading text-primary mb-lg pb-md">Shipping Information</h2>
			<form class="shipping-form space-y-md">
				<div class="form-group">
					<label for="firstName" class="text-sm text-secondary">First Name</label>
					<input
						type="text"
						id="firstName"
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
		<div class="order-summary bg-background rounded-lg md:w-1/2">
			<h2 class="text-xlarge font-heading text-primary mb-lg pb-md">Cart Summary</h2>
			
			<!-- Cart Items -->
			{#if cartItems.length === 0}
				<div class="flex flex-col items-center justify-center py-12 text-secondary">
					<p>Your cart is empty</p>
					<button 
						class="mt-4 text-primary hover:text-secondary underline"
						on:click={() => goto('/shop')}
					>
						Continue Shopping
					</button>
				</div>
			{:else}
				{#each cartItems as item}
					<div class="detail-row clean">
						<div class="flex gap-md">
							<img 
								src={item.images[0]?.src || '/placeholder.jpg'} 
								alt={item.name}
								class="h-24 w-24 object-cover cursor-pointer hover:opacity-80 transition-opacity"
								on:click={() => goto(`/shop/${item.id}`)}
								on:keydown={(e) => e.key === 'Enter' && goto(`/shop/${item.id}`)}
								role="button"
								tabindex="0"
							/>
							<div class="flex flex-col justify-between">
								<div>
									<h3 class="text-base font-semibold text-primary">{item.name}</h3>
									{#if item.variation}
										<p class="text-sm text-secondary">{item.variation.name}</p>
									{/if}
									<p class="text-primary">{formatPrice(item.price)}</p>
								</div>
								<div class="flex items-center gap-xs">
									<button class="quantity-btn" on:click={() => decreaseQuantity(item)}>−</button>
									<span class="mx-3">{item.quantity}</span>
									<button class="quantity-btn" on:click={() => increaseQuantity(item)}>+</button>
								</div>
							</div>
						</div>
						<div class="flex flex-col items-end justify-between">
							<span class="text-lg font-semibold text-primary">
								{formatPrice(item.quantity * item.price)}
							</span>
							<button 
								class="remove-btn" 
								on:click={() => handleRemoveItem(item.id)}
							>
								Remove
							</button>
						</div>
					</div>
				{/each}

				<!-- Price Summary -->
				<div class="space-y-2 mt-lg pt-md border-t border-secondary">
					<div class="detail-row clean">
						<span class="detail-label">Subtotal</span>
						<span class="detail-value">{formatPrice(subtotal)}</span>
					</div>
					<div class="detail-row clean">
						<span class="detail-label">Shipping</span>
						<span class="detail-value">{formatPrice(shippingCost)}</span>
					</div>
					<div class="detail-row clean">
						<span class="detail-label font-bold">Total</span>
						<span class="detail-value text-lg font-bold">{formatPrice(total)}</span>
					</div>
				</div>

				<!-- Payment Section -->
				<div class="payment-section mt-lg pt-md border-t border-secondary">
					<h2 class="text-xlarge font-heading text-primary mb-lg pb-md">Payment Details</h2>
					
					<div id="payment-request-button" class="mb-lg"></div>
					
					<div class="card-payment">
						<label class="text-base text-secondary mb-sm block">Credit or Debit Card</label>
						<div id="card-element" class="card-element mb-md"></div>
						{#if paymentError}
							<p class="error mb-sm">{paymentError}</p>
						{/if}
						<button class="button-primary w-full" on:click={handlePayment}>
							Pay Now
						</button>
					</div>
				</div>
			{/if}
		</div>
	</div>
</div>

<style>
	.checkout-container {
		max-width: var(--max-width-lg);
		margin: 0 auto;
	}

	.input-field {
		width: 100%;
		padding: var(--spacing-xs) 0;
		border: none;
		border-bottom: 1px solid var(--border-color);
		background: transparent;
		color: var(--text-color);
		font-size: var(--font-size-base);
		transition: border-color 0.2s ease;
	}

	.input-field:focus {
		outline: none;
		border-bottom-color: var(--primary-color);
	}

	.input-field::placeholder {
		color: var(--secondary-color);
	}

	/* Make textarea match the input styling */
	textarea.input-field {
		resize: vertical;
		min-height: 2.5rem;
	}

	.card-element {
		padding: var(--spacing-sm);
		border: 1px solid var(--border-color);
		background: var(--background-color);
	}

	.error {
		color: var(--error-color);
		font-size: var(--font-size-sm);
	}

	.button-primary {
		background-color: var(--primary-color);
		color: var(--background-color);
		padding: var(--spacing-sm) var(--spacing-md);
		border: none;
		cursor: pointer;
		transition: all 0.2s ease-in-out;
	}

	.button-primary:hover {
		background-color: var(--secondary-color);
	}

	.remove-btn {
		background: #E76F51;  /* coral/red background */
		color: white;
		border: none;
		padding: var(--spacing-xs) var(--spacing-sm);
		cursor: pointer;
		font-size: var(--font-size-sm);
		text-transform: uppercase;
		width: fit-content;
		transition: opacity 0.2s ease;
	}

	.remove-btn:hover {
		opacity: 0.9;
	}

	.detail-row {
		display: flex;
		justify-content: space-between;
		align-items: flex-start;
		padding: var(--spacing-md) 0;
		border-bottom: 1px solid var(--secondary-bg-color);
	}

	.detail-row:last-child {
		border-bottom: none;
	}

	.detail-label {
		color: var(--secondary-color);
	}

	.remove-btn {
		color: var(--error-color);
		font-size: 0.875rem;
		background: none;
		border: none;
		cursor: pointer;
		padding: var(--spacing-xs);
	}

	.detail-value {
		font-weight: 500;
	}

	@media (max-width: 767px) {
		.order-summary {
			width: 100%;
		}
	}

	.quantity-btn {
		padding: var(--spacing-xs) var(--spacing-sm);
		border: 1px solid var(--border-color);
		background: var(--background-color);
		color: var(--text-color);
		min-width: 2rem;
		text-align: center;
		cursor: pointer;
		transition: all 0.2s ease-in-out;
	}

	.quantity-btn:hover {
		background: var(--secondary-bg-color);
	}

	.gap-xs {
		gap: var(--spacing-xs);
	}

	.mx-3 {
		margin-left: 0.75rem;
		margin-right: 0.75rem;
	}
</style>

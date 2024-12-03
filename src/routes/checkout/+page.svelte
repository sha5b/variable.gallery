<script>
	import { onMount } from 'svelte';
	import { loadStripe } from '@stripe/stripe-js';
	import { userInfo } from '$lib/stores/userInfoStore';
	import { cart, addItem, removeItem } from '$lib/stores/cartStore';
	import { get } from 'svelte/store';
	import { fetchWooCommerceData } from '$lib/api';
	import { goto } from '$app/navigation';
	import { defaultSEO, generateMetaTags } from '$lib/utils/seo';
	import { countries } from '$lib/data/countries';
	import LoadingSpinner from '$lib/components/LoadingSpinner.svelte'; // Import the spinner

	export let data;
	const { products } = data;

	let stripe, elements, cardElement, paymentRequest, prButton;
	let paymentSuccess = false;
	let showLoadingSpinner = false; // State to control spinner visibility
	let paymentError = '';
	$: cartItems = $cart;
	let validationErrors = {};

	// Create checkout-specific SEO
	const pageSEO = {
		...defaultSEO,
		title: 'Checkout | variable.gallery',
		description:
			'Securely complete your purchase of digital artworks and NFTs. Enter your shipping and payment details to finalize your order.',
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
			description:
				'Securely complete your purchase of digital artworks and NFTs. Enter your shipping and payment details to finalize your order.',
			url: 'https://variable.gallery/checkout'
		}
	};

	$: metaTags = generateMetaTags(pageSEO);

	onMount(async () => {
		stripe = await loadStripe(import.meta.env.VITE_STRIPE_PUBLISHABLE_KEY);

		// Create and mount payment element with all payment methods
		try {
			elements = stripe.elements({
				mode: 'payment',
				amount: Math.round((subtotal + shippingCost) * 100),
				currency: 'eur',
				appearance: {
					theme: 'stripe',
					variables: {
						fontFamily: 'SUSE, sans-serif',
						colorPrimary: '#0a0a1a',
						colorBackground: '#ffffff',
						colorText: '#333333'
					}
				},
				payment_method_types: ['card', 'paypal', 'wechat_pay', 'eps']
			});

			const paymentElement = elements.create('payment', {
				layout: {
					type: 'tabs',
					defaultCollapsed: false
				},
				paymentMethodOrder: ['card', 'paypal', 'wechat_pay', 'eps'],
				defaultValues: {
					billingDetails: {
						name: `${$userInfo.firstName} ${$userInfo.lastName}`,
						email: $userInfo.email,
						phone: $userInfo.phone,
						address: {
							country: $userInfo.country,
							postal_code: $userInfo.postalCode,
							line1: $userInfo.address,
							city: $userInfo.city
						}
					}
				}
			});

			paymentElement.mount('#payment-element');
		} catch (error) {
			console.error('Payment Element Error:', error);
			paymentError = 'Failed to load payment form. Please refresh the page.';
		}
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
		if (!user.postalCode || !/^\d{4,5}(-\d{4})?$/.test(user.postalCode))
			validationErrors.postalCode = 'Valid postal code required (minimum 4 digits)';
		if (!user.phone || !/^\d{10,15}$/.test(user.phone))
			validationErrors.phone = 'Valid phone number is required.';

		return Object.keys(validationErrors).length === 0;
	}

	// Calculate totals
	$: subtotal = cartItems.reduce((sum, item) => {
		const itemPrice = typeof item.price === 'string' ? parseFloat(item.price) : item.price;
		return sum + itemPrice * item.quantity;
	}, 0);

	$: shippingCost = 15;
	$: total = subtotal + shippingCost;

	async function handlePayment() {
		paymentError = '';
		showLoadingSpinner = true; // Show the loading spinner

		if (!validateForm()) {
			console.error('Form validation failed:', validationErrors);
			showLoadingSpinner = false; // Hide the spinner if validation fails
			return;
		}

		try {
			// 1. Create PaymentIntent
			const response = await fetch('/checkout', {
				method: 'POST',
				headers: {
					'Content-Type': 'application/json'
				},
				body: JSON.stringify({
					amount: Math.round((subtotal + shippingCost) * 100),
					currency: 'eur'
				})
			});

			if (!response.ok) {
				throw new Error('Failed to create payment intent');
			}

			const { clientSecret } = await response.json();

			// 2. Submit the Payment Element form
			const { error: submitError } = await elements.submit();
			if (submitError) {
				throw new Error(submitError.message);
			}

			// Store order data in sessionStorage for after successful payment
			const orderData = {
				firstName: $userInfo.firstName,
				lastName: $userInfo.lastName,
				email: $userInfo.email,
				phone: $userInfo.phone,
				address: $userInfo.address,
				city: $userInfo.city,
				postalCode: $userInfo.postalCode,
				country: $userInfo.country,
				items: cartItems
			};

			// Create WooCommerce order first
			const wooOrder = await createWooCommerceOrder(orderData);
			
			// Store the order ID in sessionStorage
			sessionStorage.setItem('wooOrderId', wooOrder.id);
			sessionStorage.setItem('pendingOrderData', JSON.stringify(orderData));

			// Confirm payment with Stripe
			const { error, paymentIntent } = await stripe.confirmPayment({
				elements,
				clientSecret,
				confirmParams: {
					return_url: `${window.location.origin}/order-confirmation/${wooOrder.id}`, // Use actual order ID
					payment_method_data: {
						billing_details: {
							name: `${$userInfo.firstName} ${$userInfo.lastName}`,
							email: $userInfo.email,
							phone: $userInfo.phone,
							address: {
								city: $userInfo.city,
								country: $userInfo.country,
								line1: $userInfo.address,
								postal_code: $userInfo.postalCode
							}
						}
					}
				},
				redirect: 'if_required'
			});

			if (error) {
				throw new Error(error.message);
			}

			// If we get here without a redirect, payment was successful
			goto(`/order-confirmation/${wooOrder.id}`);
		} catch (error) {
			console.error('Payment Error:', error);
			paymentError = error.message || 'An error occurred during payment. Please try again.';
		} finally {
			showLoadingSpinner = false;
		}
	}

	async function createWooCommerceOrder(orderData) {
		const response = await fetchWooCommerceData('orders', {
			method: 'POST',
			body: JSON.stringify({
				payment_method: 'stripe',
				payment_method_title: 'Credit Card (Stripe)',
				set_paid: true, // Set to true since payment is confirmed
				status: 'processing', // Set to processing since payment is complete
				billing: {
					first_name: orderData.firstName,
					last_name: orderData.lastName,
					address_1: orderData.address,
					city: orderData.city,
					postcode: orderData.postalCode,
					country: orderData.country,
					email: orderData.email,
					phone: orderData.phone || ''
				},
				shipping: {
					first_name: orderData.firstName,
					last_name: orderData.lastName,
					address_1: orderData.address,
					city: orderData.city,
					postcode: orderData.postalCode,
					country: orderData.country
				},
				line_items: orderData.items.map((item) => ({
					product_id: item.id,
					quantity: item.quantity
				}))
			})
		});

		if (!response || !response.id) {
			throw new Error('Failed to create order - no order ID received');
		}

		return response;
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
			return sum + itemPrice * item.quantity;
		}, 0);
	}

	function increaseQuantity(item) {
		addItem(item);
		// Force reactive update of totals
		subtotal = cartItems.reduce((sum, item) => {
			const itemPrice = typeof item.price === 'string' ? parseFloat(item.price) : item.price;
			return sum + itemPrice * item.quantity;
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
			return sum + itemPrice * item.quantity;
		}, 0);
	}
</script>

<svelte:head>
	<title>{pageSEO.title}</title>
	{#each metaTags as tag}
		{#if tag.name}
			<meta name={tag.name} content={tag.content} />
		{:else if tag.property}
			<meta property={tag.property} content={tag.content} />
		{/if}
	{/each}
</svelte:head>

<LoadingSpinner visible={showLoadingSpinner} />

<div class="px-page pb-12">
	<div class="checkout-container flex w-full flex-col gap-md md:flex-row">
		<!-- Left Column: Shipping Information -->
		<div class="shipping-info rounded-lg bg-background md:w-1/2">
			<h2 class="text-xlarge mb-lg pb-md font-heading text-primary">Shipping Information</h2>
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
					<label for="country">Country</label>
					<select id="country" bind:value={$userInfo.country} class="input-field">
						<option value="">Select a country</option>
						<optgroup label="European Union">
							{#each countries.filter((c) => c.group === 'EU') as country}
								<option value={country.code}>{country.flag} {country.name}</option>
							{/each}
						</optgroup>
						<optgroup label="Other European Countries">
							{#each countries.filter((c) => c.group === 'Europe') as country}
								<option value={country.code}>{country.flag} {country.name}</option>
							{/each}
						</optgroup>
						<optgroup label="Other Developed Countries">
							{#each countries.filter((c) => c.group === 'Developed') as country}
								<option value={country.code}>{country.flag} {country.name}</option>
							{/each}
						</optgroup>
						<optgroup label="Rest of World">
							{#each countries.filter((c) => c.group === 'Other') as country}
								<option value={country.code}>{country.flag} {country.name}</option>
							{/each}
						</optgroup>
					</select>
					{#if validationErrors.country}
						<p class="error">{validationErrors.country}</p>
					{/if}
				</div>

				<div class="form-group">
					<label for="phone">Phone</label>
					<div class="phone-input-group">
						<select class="country-code input-field" bind:value={$userInfo.phoneCountryCode}>
							{#each countries as country}
								<option value={country.phoneCode}>
									{country.flag}
									{country.phoneCode}
								</option>
							{/each}
						</select>
						<input
							id="phone"
							type="tel"
							bind:value={$userInfo.phone}
							placeholder="Phone number"
							class="input-field flex-1"
						/>
					</div>
					{#if validationErrors.phone}
						<p class="error">{validationErrors.phone}</p>
					{/if}
				</div>
			</form>
		</div>

		<!-- Right Column: Cart Summary and Payment -->
		<div class="order-summary rounded-lg bg-background md:w-1/2">
			<h2 class="text-xlarge mb-lg pb-md font-heading text-primary">Cart Summary</h2>

			<!-- Cart Items -->
			{#if cartItems.length === 0}
				<div class="flex flex-col items-center justify-center py-12 text-secondary">
					<p>Your cart is empty</p>
					<button
						class="mt-4 text-primary underline hover:text-secondary"
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
								class="h-24 w-24 cursor-pointer object-cover transition-opacity hover:opacity-80"
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
							<button class="remove-btn" on:click={() => handleRemoveItem(item.id)}>
								Remove
							</button>
						</div>
					</div>
				{/each}

				<!-- Price Summary -->
				<div class="mt-lg space-y-2 border-t border-secondary pt-md">
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
				<div class="payment-section mt-lg border-t border-secondary pt-md">
					<h2 class="text-xlarge mb-lg pb-md font-heading text-primary">Payment Details</h2>

					<div id="payment-request-button" class="mb-lg"></div>

					<div class="payment-element-container">
						<div id="payment-element" class="mb-md"></div>
						{#if paymentError}
							<p class="error mb-sm">{paymentError}</p>
						{/if}
						<button class="button-primary w-full" on:click={handlePayment}> Pay Now </button>
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
		background: #e76f51; /* coral/red background */
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

	.payment-element-container {
		background: var(--background-color);
		padding: var(--spacing-md);
		border: 1px solid var(--secondary-bg-color);
		border-radius: 0.25rem;
	}

	#payment-element {
		margin-bottom: var(--spacing-md);
		font-family: var(--font-primary);
	}

	.error {
		color: var(--error-color);
		font-size: var(--font-size-small);
		font-family: var(--font-primary);
	}

	.button-primary {
		background-color: var(--primary-color);
		color: var(--background-color);
		padding: var(--spacing-sm) var(--spacing-md);
		border: none;
		border-radius: 0.25rem;
		font-weight: 500;
		cursor: pointer;
		transition: all 0.3s ease;
		font-family: var(--font-primary);
	}

	.button-primary:hover {
		background-color: var(--secondary-color);
		transform: translateY(-1px);
	}
</style>

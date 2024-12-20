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
	import LoadingSpinner from '$lib/components/LoadingSpinner.svelte';

	/**
	 * @typedef {Object} PageData
	 * @property {any[]} products
	 */

	/**
	 * @typedef {Object} CartItem
	 * @property {number} id
	 * @property {string} name
	 * @property {number|string} price
	 * @property {number} quantity
	 * @property {Array<{src: string}>} images
	 * @property {{name: string}=} variation
	 */

	/**
	 * @typedef {Object} UserInfo
	 * @property {string} firstName
	 * @property {string} lastName
	 * @property {string} email
	 * @property {string} phone
	 * @property {string} phoneCountryCode
	 * @property {string} address
	 * @property {string} apartment
	 * @property {string} city
	 * @property {string} postalCode
	 * @property {string} country
	 * @property {null} orderId
	 */

	/**
	 * @typedef {Object} ValidationErrors
	 * @property {string=} firstName
	 * @property {string=} lastName
	 * @property {string=} email
	 * @property {string=} phone
	 * @property {string=} address
	 * @property {string=} city
	 * @property {string=} postalCode
	 * @property {string=} country
	 */

	/**
	 * @typedef {Object} MetaTag
	 * @property {string=} name
	 * @property {string=} property
	 * @property {string} content
	 */

	/** @type {PageData} */
	export let data;
	const { products } = data;

	/** @type {import('@stripe/stripe-js').Stripe | null} */
	let stripe = null;
	/** @type {import('@stripe/stripe-js').StripeElements | null} */
	let elements = null;
	let cardElement;
	let paymentRequest;
	let prButton;
	let paymentSuccess = false;
	let showLoadingSpinner = false;
	let paymentError = '';
	/** @type {CartItem[]} */
	$: cartItems = $cart;
	/** @type {ValidationErrors} */
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

	/** @type {MetaTag[]} */
	$: metaTags = generateMetaTags(pageSEO);

	onMount(async () => {
		stripe = await loadStripe(import.meta.env.VITE_STRIPE_PUBLISHABLE_KEY);
		if (!stripe) return;

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

			if (!elements) return;

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

	/**
	 * @returns {boolean}
	 */
	function validateForm() {
		validationErrors = {};
		/** @type {UserInfo} */
		const user = get(userInfo);

		if (!user.firstName) validationErrors.firstName = 'First name is required.';
		if (!user.lastName) validationErrors.lastName = 'Last name is required.';
		if (!user.email || !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(user.email))
			validationErrors.email = 'Valid email is required.';
		if (!user.address) validationErrors.address = 'Address is required.';
		if (!user.city) validationErrors.city = 'City is required.';
		if (!user.postalCode || user.postalCode.length < 3)
			validationErrors.postalCode = 'Valid postal code required (minimum 3 characters)';
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
		if (!stripe || !elements) return;

		paymentError = '';
		showLoadingSpinner = true;

		if (!validateForm()) {
			console.error('Form validation failed:', validationErrors);
			showLoadingSpinner = false;
			return;
		}

		try {
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

			const { error: submitError } = await elements.submit();
			if (submitError) {
				throw new Error(submitError.message);
			}

			/** @type {UserInfo & { items: CartItem[] }} */
			const orderData = {
				...$userInfo,
				items: cartItems
			};

			const wooOrder = await createWooCommerceOrder(orderData);

			sessionStorage.setItem('wooOrderId', wooOrder.id);
			sessionStorage.setItem('pendingOrderData', JSON.stringify(orderData));

			const { error, paymentIntent } = await stripe.confirmPayment({
				elements,
				clientSecret,
				confirmParams: {
					return_url: `${window.location.origin}/order-confirmation/${wooOrder.id}`,
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

			goto(`/order-confirmation/${wooOrder.id}`);
		} catch (error) {
			if (error instanceof Error) {
				paymentError = error.message;
			} else {
				paymentError = 'An error occurred during payment. Please try again.';
			}
			console.error('Payment Error:', error);
		} finally {
			showLoadingSpinner = false;
		}
	}

	/**
	 * @param {UserInfo & { items: CartItem[] }} orderData
	 */
	async function createWooCommerceOrder(orderData) {
		const response = await fetchWooCommerceData('orders', {
			method: 'POST',
			body: JSON.stringify({
				payment_method: 'stripe',
				payment_method_title: 'Credit Card (Stripe)',
				set_paid: true,
				status: 'processing',
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

	/**
	 * @param {number|string} price
	 * @returns {string}
	 */
	function formatPrice(price) {
		const numPrice = typeof price === 'string' ? parseFloat(price) : price;
		return `€${numPrice.toFixed(2)}`;
	}

	/**
	 * @param {number} itemId
	 */
	async function handleRemoveItem(itemId) {
		removeItem(itemId);
		subtotal = cartItems.reduce((sum, item) => {
			const itemPrice = typeof item.price === 'string' ? parseFloat(item.price) : item.price;
			return sum + itemPrice * item.quantity;
		}, 0);
	}

	/**
	 * @param {CartItem} item
	 */
	function increaseQuantity(item) {
		addItem(item);
		subtotal = cartItems.reduce((sum, item) => {
			const itemPrice = typeof item.price === 'string' ? parseFloat(item.price) : item.price;
			return sum + itemPrice * item.quantity;
		}, 0);
	}

	/**
	 * @param {CartItem} item
	 */
	function decreaseQuantity(item) {
		cart.update((items) => {
			/** @type {CartItem[]} */
			const cartItems = items;
			/** @type {CartItem | undefined} */
			const existingItem = cartItems.find((i) => i.id === item.id);
			if (existingItem && existingItem.quantity > 1) {
				existingItem.quantity -= 1;
			} else {
				return cartItems.filter((i) => i.id !== item.id);
			}
			return [...cartItems];
		});
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

<div class="container p-2xl">
	<div class="grid grid-cols-1 md:grid-cols-2 gap-lg">
		<!-- Left Column: Shipping Information -->
		<div class="card">
			<h2 class="h2">Shipping Information</h2>
			<form class="form-group">
				<div class="form-group">
					<label for="firstName">First Name</label>
					<input
						type="text"
						id="firstName"
						bind:value={$userInfo.firstName}
						placeholder="Your First Name"
						class="input"
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
						class="input"
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
						class="input"
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
						class="input"
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
						class="input"
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
						class="input"
					/>
					{#if validationErrors.postalCode}
						<p class="error">{validationErrors.postalCode}</p>
					{/if}
				</div>

				<div class="form-group">
					<label for="country">Country</label>
					<select id="country" bind:value={$userInfo.country} class="input">
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
						<select class="input" bind:value={$userInfo.phoneCountryCode}>
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
							class="input flex-1"
						/>
					</div>
					{#if validationErrors.phone}
						<p class="error">{validationErrors.phone}</p>
					{/if}
				</div>
			</form>
		</div>

		<!-- Right Column: Cart Summary and Payment -->
		<div class="card">
			<h2 class="h2">Cart Summary</h2>

			<!-- Cart Items -->
			{#if cartItems.length === 0}
				<div class="flex flex-col items-center justify-center p-lg">
					<p>Your cart is empty</p>
					<button class="btn btn-primary mt-md" on:click={() => goto('/shop')}>
						Continue Shopping
					</button>
				</div>
			{:else}
				{#each cartItems as item}
					<div class="flex justify-between items-start p-md border-b border-secondary-bg">
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
									<h3 class="text-base font-semibold">{item.name}</h3>
									{#if item.variation}
										<p class="text-sm text-secondary">{item.variation.name}</p>
									{/if}
									<p>{formatPrice(item.price)}</p>
								</div>
								<div class="flex items-center gap-xs">
									<button class="btn btn-sm" on:click={() => decreaseQuantity(item)}>−</button>
									<span class="mx-3">{item.quantity}</span>
									<button class="btn btn-sm" on:click={() => increaseQuantity(item)}>+</button>
								</div>
							</div>
						</div>
						<div class="flex flex-col items-end justify-between">
							<span class="text-lg font-semibold">
								{formatPrice(item.quantity * (typeof item.price === 'string' ? parseFloat(item.price) : item.price))}
							</span>
							<button class="btn btn-sm btn-outline text-error" on:click={() => handleRemoveItem(item.id)}>
								Remove
							</button>
						</div>
					</div>
				{/each}

				<!-- Price Summary -->
				<div class="mt-lg space-y-sm border-t border-secondary-bg pt-md">
					<div class="flex justify-between">
						<span>Subtotal</span>
						<span>{formatPrice(subtotal)}</span>
					</div>
					<div class="flex justify-between">
						<span>Shipping</span>
						<span>{formatPrice(shippingCost)}</span>
					</div>
					<div class="flex justify-between font-bold">
						<span>Total</span>
						<span class="text-lg">{formatPrice(total)}</span>
					</div>
				</div>

				<!-- Payment Section -->
				<div class="mt-lg border-t border-secondary-bg pt-md">
					<h2 class="h2">Payment Details</h2>

					<div id="payment-request-button" class="mb-lg"></div>

					<div class="card">
						<div id="payment-element" class="mb-md"></div>
						{#if paymentError}
							<p class="error mb-sm">{paymentError}</p>
						{/if}
						<button class="btn btn-primary w-full" on:click={handlePayment}> Pay Now </button>
					</div>
				</div>
			{/if}
		</div>
	</div>
</div>

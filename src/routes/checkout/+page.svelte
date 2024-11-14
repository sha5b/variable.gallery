<script>
	import { onMount } from 'svelte';
	import { loadStripe } from '@stripe/stripe-js';
	import { userInfo } from '$lib/stores/userInfoStore';
	import { cart } from '$lib/stores/cartStore';
	import { get } from 'svelte/store';
	import { goto } from '$app/navigation';
	import { createForm } from 'svelte-forms-lib';
	import * as yup from 'yup';
	import { parsePhoneNumberFromString } from 'libphonenumber-js';

	export let data
	const { products } = data
	
	let stripe, elements, cardElement, paymentRequest, prButton;
	let amount;
	let shippingCost = 1000; // 10.00 in cents
	let currency = 'eur';
	let paymentSuccess = false;
	let paymentError = '';
	let selectedCountry = '';

	// Shipping costs by country (in cents)
	const shippingRates = {
		'GB': 1000, // UK: £10.00
		'DE': 1500, // Germany: €15.00
		'FR': 1500, // France: €15.00
		'US': 2500, // USA: $25.00
		'default': 2000 // Default international rate: €20.00
	};

	const { form, errors, handleChange, handleSubmit } = createForm({
		initialValues: {
			firstName: $userInfo.firstName || '',
			lastName: $userInfo.lastName || '',
			email: $userInfo.email || '',
			phone: $userInfo.phone || '',
			address: $userInfo.address || '',
			city: $userInfo.city || '',
			postalCode: $userInfo.postalCode || '',
			country: selectedCountry || ''
		},
		validationSchema: yup.object().shape({
			firstName: yup.string().required('First name is required'),
			lastName: yup.string().required('Last name is required'),
			email: yup.string().email('Invalid email').required('Email is required'),
			phone: yup.string()
				.required('Phone is required')
				.test('phone', 'Invalid phone number', value => {
					if (!value) return false;
					const phoneNumber = parsePhoneNumberFromString(value);
					return phoneNumber ? phoneNumber.isValid() : false;
				}),
			address: yup.string().required('Address is required'),
			city: yup.string().required('City is required'),
			postalCode: yup.string()
				.required('Postal code is required')
				.matches(/^[0-9]{4,6}$/, 'Invalid postal code'),
			country: yup.string().required('Country is required')
		}),
		onSubmit: values => {
			userInfo.set(values);
			handlePayment();
		}
	});

	onMount(async () => {
		stripe = await loadStripe(import.meta.env.VITE_STRIPE_PUBLISHABLE_KEY);
		elements = stripe.elements();
		cardElement = elements.create('card');
		cardElement.mount('#card-element');
	});

	$: cartItems = get(cart).map(item => {
		const matchingProduct = products.find(p => p.id === (item.parent_id || item.id));
		return {
			...item,
			displayName: matchingProduct?.name || item.name,
			price: parseFloat(item.price)
		};
	});

	$: {
		shippingCost = shippingRates[$form.country] || shippingRates.default;
		amount = Math.round(cartItems.reduce((sum, item) => {
			return sum + (item.quantity * (item.price * 100));
		}, 0) + shippingCost);
	}

	function formatPrice(price) {
		const numPrice = parseFloat(price);
		return !isNaN(numPrice) ? numPrice.toFixed(2) : '0.00';
	}

	function goToProduct(productId) {
		goto(`/shop/${productId}`);
	}

	async function handlePayment() {
		try {
			const response = await fetch('/checkout', {
				method: 'POST',
				headers: { 'Content-Type': 'application/json' },
				body: JSON.stringify({
					amount,
					currency,
					cartItems,
					userInfo: $form
				})
			});

			const { clientSecret } = await response.json();

			const result = await stripe.confirmCardPayment(clientSecret, {
				payment_method: {
					card: cardElement,
					billing_details: {
						name: `${$form.firstName} ${$form.lastName}`,
						email: $form.email,
						phone: $form.phone,
						address: {
							line1: $form.address,
							city: $form.city,
							postal_code: $form.postalCode,
							country: $form.country
						}
					}
				}
			});

			if (result.error) {
				paymentError = result.error.message;
			} else {
				paymentSuccess = true;
				goto('/order-confirmation');
			}
		} catch (error) {
			console.error('Payment error:', error);
			paymentError = 'An error occurred during payment processing';
		}
	}
</script>

<div class="checkout-wrapper">
	<!-- Left Column: Shipping Information -->
	<div class="shipping-container">
		<h2 class="text-xlarge font-bold mb-lg">Shipping Information</h2>
		<form class="shipping-form">
			<div class="form-row">
				<div class="form-group">
					<label for="firstName">First Name</label>
					<input
						id="firstName"
						type="text"
						bind:value={$form.firstName}
						placeholder="Your First Name"
						class="input-field"
					/>
				</div>
				<div class="form-group">
					<label for="lastName">Last Name</label>
					<input
						id="lastName"
						type="text"
						bind:value={$form.lastName}
						placeholder="Your Last Name"
						class="input-field"
					/>
				</div>
			</div>

			<div class="form-row">
				<div class="form-group">
					<label for="email">Email</label>
					<input
						id="email"
						type="email"
						bind:value={$form.email}
						placeholder="Your Email"
						class="input-field"
					/>
				</div>
				<div class="form-group">
					<label for="phone">Phone</label>
					<input
						id="phone"
						type="tel"
						bind:value={$form.phone}
						placeholder="Your Phone"
						class="input-field"
					/>
				</div>
			</div>

			<div class="form-row">
				<div class="form-group">
					<label for="address">Address</label>
					<input
						id="address"
						type="text"
						bind:value={$form.address}
						placeholder="Your Address"
						class="input-field"
					/>
				</div>
				<div class="form-group">
					<label for="city">City</label>
					<input
						id="city"
						type="text"
						bind:value={$form.city}
						placeholder="Your City"
						class="input-field"
					/>
				</div>
			</div>

			<div class="form-row">
				<div class="form-group">
					<label for="postalCode">Postal Code</label>
					<input
						id="postalCode"
						type="text"
						bind:value={$form.postalCode}
						placeholder="Your Postal Code"
						class="input-field"
					/>
				</div>
				<div class="form-group">
					<label for="country">Country</label>
					<select 
						id="country"
						bind:value={$form.country}
						class="input-field"
					>
						<option value="">Select a country</option>
						<option value="GB">United Kingdom</option>
						<option value="DE">Germany</option>
						<option value="FR">France</option>
						<option value="US">United States</option>
						<option value="other">Other</option>
					</select>
				</div>
			</div>
		</form>
	</div>

	<!-- Right Column: Order Summary -->
	<div class="order-summary">
		<h2 class="text-xlarge font-bold mb-lg">Order Summary</h2>
		
		{#each cartItems as item}
			<div class="order-item">
				<img 
					src={item.images[0]?.src || '/placeholder.jpg'} 
					alt={item.displayName}
					class="product-image"
				/>
				<div class="item-details">
					<h3 class="item-name">{item.displayName}</h3>
					<p class="quantity">Quantity: {item.quantity}</p>
					<p class="price">€{formatPrice(item.price)}</p>
				</div>
			</div>
		{/each}

		<div class="totals">
			<div class="subtotal">
				<span>Subtotal</span>
				<span>€{formatPrice(amount/100 - shippingCost/100)}</span>
			</div>
			<div class="shipping">
				<span>Shipping</span>
				<span>€{formatPrice(shippingCost/100)}</span>
			</div>
			<div class="total">
				<span>Total</span>
				<span>€{formatPrice(amount/100)}</span>
			</div>
		</div>

		<div id="card-element" class="mt-md" />
		<button type="button" class="pay-now-button">
			Pay Now
		</button>
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

	.form-row {
		display: flex;
		gap: var(--spacing-md);
		margin-bottom: var(--spacing-md);
	}

	.form-group {
		flex: 1;
	}

	label {
		display: block;
		margin-bottom: var(--spacing-xs);
		color: var(--text-color);
	}

	.input-field {
		width: 100%;
		padding: var(--spacing-sm);
		border: 1px solid var(--border-color);
		border-radius: 4px;
	}

	.order-item {
		display: flex;
		gap: var(--spacing-md);
		padding: var(--spacing-sm) 0;
		border-bottom: 1px solid var(--border-color);
	}

	.product-image {
		width: 80px;
		height: 80px;
		object-fit: cover;
	}

	.item-details {
		flex: 1;
	}

	.totals {
		margin-top: var(--spacing-lg);
	}

	.subtotal, .shipping, .total {
		display: flex;
		justify-content: space-between;
		margin-bottom: var(--spacing-sm);
	}

	.total {
		font-weight: bold;
		border-top: 1px solid var(--border-color);
		padding-top: var(--spacing-md);
		margin-top: var(--spacing-md);
	}

	.pay-now-button {
		width: 100%;
		background-color: var(--primary-color);
		color: white;
		padding: var(--spacing-sm);
		border-radius: 4px;
		margin-top: var(--spacing-md);
	}

	@media (max-width: 768px) {
		.checkout-wrapper {
			grid-template-columns: 1fr;
		}

		.form-row {
			flex-direction: column;
		}
	}
</style>

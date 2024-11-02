<script>
	import { onMount } from 'svelte';
	import { fetchWooCommerceData } from '$lib/api';
	import { userInfo } from '$lib/stores/userInfoStore';
    import { get } from 'svelte/store'; // Import get to access store value

	let orderData = null;
	let paymentStatusMessage = 'Checking payment status...';

	onMount(async () => {
		let orderId = get(userInfo).orderId || sessionStorage.getItem('orderId'); // Get from store or sessionStorage

		if (orderId) {
			try {
				const response = await fetchWooCommerceData(`orders/${orderId}`);
				orderData = response;

				if (orderData.status === 'completed' || orderData.status === 'processing') {
					paymentStatusMessage = 'Payment was successful!';
				} else {
					paymentStatusMessage = 'Payment is pending. Please check back later.';
				}
			} catch (error) {
				console.error('Error fetching order data:', error);
				paymentStatusMessage = 'There was an error fetching the order details.';
			}
		} else {
			console.warn('Order ID not found.');
			paymentStatusMessage = 'Order ID not available. Please contact support.';
		}
	});
</script>

{#if orderData}
	<div class="order-confirmation-container mx-auto my-10 max-w-4xl p-8 bg-white">
		<h1 class="text-4xl font-heading font-bold mb-6 text-primary-color">Thank you for your order!</h1>
		<p class="text-xl mb-2 font-body">Order ID: <strong>{orderData.id}</strong></p>
		<p class="text-xl mb-2 font-body">Status: <strong class="capitalize">{orderData.status}</strong></p>
		<p
			class="mt-4 text-lg font-semibold font-body {orderData.status === 'completed' ||
			orderData.status === 'processing'
				? 'text-green-600'
				: 'text-red-600'}"
		>
			{paymentStatusMessage}
		</p>

		<h2 class="text-2xl font-heading mt-8 mb-4 text-secondary-color">Order Summary</h2>
		<ul class="order-summary-list">
			{#each orderData.line_items as item}
				<li class="mb-6 flex items-start border-b border-gray-200 pb-4">
					<img
						src={item.image?.src || '/placeholder.jpg'}
						alt={item.name}
						class="product-image-large mr-6"
					/>
					<div>
						<p class="text-lg font-semibold font-body text-primary-color">{item.name}</p>
						<p class="text-sm text-gray-600 font-body">Quantity: {item.quantity}</p>
						<p class="text-sm text-gray-600 font-body">Price: ${(item.price / 100).toFixed(2)}</p>
					</div>
				</li>
			{/each}
		</ul>
	</div>
{:else}
	<div class="mt-6 text-center">
		<p>Loading order details...</p>
	</div>
{/if}

<style>
	.order-confirmation-container {
		max-width: 800px;
		margin: 2rem auto;
		padding: 2rem;
		border-radius: 8px;
		background-color: var(--bg-light-color);
	}
	.text-green-600 {
		color: var(--success-color);
	}
	.text-red-600 {
		color: var(--error-color);
	}
	.order-summary-list {
		list-style: none;
		padding: 0;
		margin: 0;
	}
	.product-image-large {
		width: 64px;
		height: 64px;
		object-fit: cover;
	}
	.font-heading {
		font-family: var(--font-primary);
	}
	.font-body {
		font-family: var(--font-secondary);
	}
	.text-primary-color {
		color: var(--primary-color);
	}
	.text-secondary-color {
		color: var(--secondary-color);
	}
</style>

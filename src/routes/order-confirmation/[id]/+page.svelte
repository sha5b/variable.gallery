<script>
	import { onMount } from 'svelte';
	import { page } from '$app/stores';
	import { fetchWooCommerceData } from '$lib/api';
	import { userInfo } from '$lib/stores/userInfoStore';
    import { cart } from '$lib/stores/cartStore';
    import { get } from 'svelte/store'; // Import get to access store value
    import { defaultSEO, generateMetaTags } from '$lib/utils/seo';

	let orderData = null;
	let paymentStatusMessage = 'Checking payment status...';

	// Get the order ID from the URL parameter
	$: orderId = $page.params.id;

	// Create order confirmation-specific SEO
	const pageSEO = {
		...defaultSEO,
		title: 'Order Confirmation | variable.gallery',
		description: 'Thank you for your purchase! View your order details and payment status on this page.',
		keywords: [
			...defaultSEO.keywords,
			'order confirmation',
			'purchase details',
			'payment status',
			'digital art order'
		],
		openGraph: {
			...defaultSEO.openGraph,
			title: 'Order Confirmation | variable.gallery',
			description: 'Thank you for your purchase! View your order details and payment status on this page.',
			url: 'https://variable.gallery/order-confirmation'
		}
	};
	$: metaTags = generateMetaTags(pageSEO);

	function formatPrice(price) {
		return `€${(price / 1).toFixed(2)}`;
	}

	// Add this function at the top of your script
	async function createWooCommerceOrder(orderData) {
		const response = await fetchWooCommerceData('orders', {
			method: 'POST',
			body: JSON.stringify({
				payment_method: 'stripe',
				payment_method_title: 'Credit Card (Stripe)',
				set_paid: true,
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
					city: orderData.city,
					postcode: orderData.postalCode,
					country: orderData.country
				},
				line_items: orderData.items.map(item => ({
					product_id: item.id,
					quantity: item.quantity
				}))
			})
		});

		if (!response.id) {
			throw new Error('Failed to create WooCommerce order');
		}

		return response;
	}

	onMount(async () => {
		const orderId = $page.params.id;
		console.log('Order ID from params:', orderId);

		if (!orderId) {
			goto('/order-error');
			return;
		}

		try {
			const urlParams = new URLSearchParams(window.location.search);
			const redirectStatus = urlParams.get('redirect_status');

			if (redirectStatus === 'succeeded') {
				// Get the stored order data
				const orderDataString = sessionStorage.getItem('pendingOrderData');
				if (!orderDataString) {
					throw new Error('No order data found');
				}

				const pendingOrder = JSON.parse(orderDataString);
				const wooCommerceResponse = await createWooCommerceOrder(pendingOrder);

				if (wooCommerceResponse && wooCommerceResponse.id) {
					// Clear stored data and cart after successful order creation
					sessionStorage.removeItem('pendingOrderData');
					cart.set([]);
					paymentStatusMessage = 'Payment was successful!';
					orderData = wooCommerceResponse;
				}
			} else {
				paymentStatusMessage = 'Payment was not successful. Please try again.';
				goto('/order-error');
			}
		} catch (error) {
			console.error('Error:', error);
			goto('/order-error');
		}
	});
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

<div class="px-page">
	{#if orderData}
		<div class="order-container">
			<div class="bg-background rounded-lg">
				<h1 class="text-xlarge font-heading text-primary mb-lg">Thank you for your order!</h1>
				
				<!-- Order Details -->
				<div class="detail-row clean">
					<span class="detail-label">Order ID</span>
					<span class="detail-value">{orderData.id}</span>
				</div>
				
				<div class="detail-row clean">
					<span class="detail-label">Status</span>
					<span class="detail-value capitalize">{orderData.status}</span>
				</div>
				
				<div class="detail-row clean">
					<span class="detail-label">Payment Status</span>
					<span class="detail-value {orderData.status === 'completed' || orderData.status === 'processing' ? 'text-success' : 'text-error'}">
						{paymentStatusMessage}
					</span>
				</div>

				<!-- Order Summary -->
				<h2 class="text-large font-heading text-primary mt-xl mb-lg">Order Summary</h2>
				<div class="order-items space-y-md">
					{#each orderData.line_items as item}
						<div class="detail-row clean">
							<div class="flex gap-md">
								<img
									src={item.image?.src || '/placeholder.jpg'}
									alt={item.name}
									class="w-20 h-20 object-cover"
								/>
								<div>
									<h3 class="text-base font-heading text-primary">{item.name}</h3>
									<p class="text-sm text-secondary">Quantity: {item.quantity}</p>
									<p class="text-base">{formatPrice(item.price)}</p>
								</div>
							</div>
						</div>
					{/each}
				</div>
			</div>
		</div>
	{:else if paymentStatusMessage.includes('not successful')}
		<div class="error-container bg-background rounded-lg">
			<h1 class="text-xlarge font-heading text-primary mb-lg">Payment Failed</h1>
			<p class="text-error mb-md">{paymentStatusMessage}</p>
			<p class="mb-xl">The order could not be created because the payment was not successful.</p>
			<a href="/checkout" class="btn-primary">
				Return to Checkout
			</a>
		</div>
	{:else}
		<div class="flex justify-center items-center min-h-[400px]">
			<p class="text-secondary">Loading order details...</p>
		</div>
	{/if}
</div>

<style>
	.order-container {
		max-width: var(--max-width-lg);
		margin: 0 auto;
	}

	.detail-row {
		display: flex;
		justify-content: space-between;
		align-items: flex-start;
		padding: var(--spacing-md) 0;
		border-bottom: 1px solid var(--border-color);
	}

	.detail-row.clean {
		border-bottom: 1px solid var(--secondary-bg-color);
	}

	.detail-label {
		color: var(--secondary-color);
	}

	.text-success {
		color: var(--success-color);
	}

	.text-error {
		color: var(--error-color);
	}

	.error-container {
		max-width: var(--max-width-md);
		margin: 2rem auto;
		padding: var(--spacing-xl);
		text-align: center;
	}
</style>


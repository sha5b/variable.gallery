<script>
	import { onMount } from 'svelte';
	import { page } from '$app/stores';
	import { userInfo } from '$lib/stores/userInfoStore';
    import { cart } from '$lib/stores/cartStore';
    import { get } from 'svelte/store';
    import { defaultSEO, generateMetaTags } from '$lib/utils/seo';
	import { goto } from '$app/navigation';
	import { formatPrice, createWooCommerceOrder } from '$lib/utils/checkoutUtils';
	import { fetchWooCommerceData } from '$lib/api';

	/**
	 * @typedef {Object} OrderLineItem
	 * @property {string} name
	 * @property {number} quantity
	 * @property {number|string} price
	 * @property {{src: string}=} image
	 */

	/**
	 * @typedef {Object} Order
	 * @property {string} id
	 * @property {string} status
	 * @property {OrderLineItem[]} line_items
	 */

	/** @type {Order|null} */
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

	/**
	 * @param {string} orderId
	 */
	async function loadOrderDetails(orderId) {
		console.log('Loading order details:', orderId);
		try {
			const response = await fetchWooCommerceData(`orders/${orderId}`);
			if (!response || !response.id) {
				throw new Error('Failed to fetch order details');
			}
			orderData = response;
			console.log('Order details loaded:', orderData);
			paymentStatusMessage = 'Payment was successful!';
			cart.set([]); // Clear cart after successful order
		} catch (/** @type {unknown} */ error) {
			console.error('Error loading order details:', error);
			paymentStatusMessage = 'An error occurred while loading your order.';
			if (error instanceof Error) {
				throw error;
			}
			throw new Error('Unknown error occurred');
		}
	}

	async function handleRedirectPayment() {
		console.log('Processing redirect payment...');
		const urlParams = new URLSearchParams(window.location.search);
		const redirectStatus = urlParams.get('redirect_status');
		const paymentIntentId = urlParams.get('payment_intent');
		console.log('Payment status:', redirectStatus);
		console.log('Payment intent ID:', paymentIntentId);

		if (redirectStatus === 'succeeded' && paymentIntentId) {
			console.log('Payment successful, retrieving order data...');
			const pendingOrderData = sessionStorage.getItem('pendingOrderData');
			
			if (!pendingOrderData) {
				console.error('No pending order data found in session storage');
				throw new Error('No pending order data found');
			}

			const orderData = JSON.parse(pendingOrderData);
			console.log('Creating WooCommerce order with data:', orderData);
			
			const wooOrder = await createWooCommerceOrder(orderData);
			console.log('WooCommerce order created:', wooOrder);
			
			// Clear session storage
			sessionStorage.removeItem('pendingOrderData');

			// Redirect to the actual order confirmation page
			console.log('Redirecting to order confirmation:', wooOrder.id);
			goto(`/order-confirmation/${wooOrder.id}`);
		} else {
			console.error('Payment not successful:', redirectStatus);
			throw new Error('Payment was not successful');
		}
	}

	onMount(async () => {
		const orderId = $page.params.id;
		console.log('Order confirmation page loaded with ID:', orderId);

		try {
			if (orderId === 'create') {
				await handleRedirectPayment();
			} else if (orderId) {
				await loadOrderDetails(orderId);
			}
		} catch (/** @type {unknown} */ error) {
			console.error('Error:', error);
			paymentStatusMessage = error instanceof Error ? error.message : 'An error occurred while processing your order.';
			if (orderId === 'create') {
				setTimeout(() => {
					console.log('Redirecting back to checkout...');
					goto('/checkout');
				}, 3000);
			}
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

<div class="page-container">
	<div class="content-section">
		{#if orderData}
			<div class="container container-lg">
				<div class="space-y-lg p-xl bg-background">
					<h1 class="text-3xl font-normal uppercase">Thank you for your order!</h1>
					
					<!-- Order Details -->
					<section class="space-y-md">
						<h2 class="text-xl font-normal uppercase">Order Details</h2>
						<div class="grid grid-cols-1 gap-md">
							<div class="flex justify-between items-center p-md">
								<span class="text-secondary uppercase">Order ID</span>
								<span>{orderData.id}</span>
							</div>
							
							<div class="flex justify-between items-center p-md">
								<span class="text-secondary uppercase">Status</span>
								<span class="uppercase">{orderData.status}</span>
							</div>
							
							<div class="flex justify-between items-center p-md">
								<span class="text-secondary uppercase">Payment Status</span>
								<span class="{orderData.status === 'completed' || orderData.status === 'processing' ? 'text-success' : 'text-error'}">
									{paymentStatusMessage}
								</span>
							</div>
						</div>
					</section>

					<!-- Order Summary -->
					<section class="space-y-md">
						<h2 class="text-xl font-normal uppercase">Order Summary</h2>
						<div class="space-y-md">
							{#each orderData.line_items as item}
								<div class="flex justify-between items-start p-md">
									<div class="flex gap-md">
										<img
											src={item.image?.src || '/placeholder.jpg'}
											alt={item.name}
											class="h-24 w-24 object-cover"
										/>
										<div class="flex flex-col justify-between">
											<div class="space-y-xs">
												<h3 class="text-base font-semibold">{item.name}</h3>
												<p class="text-sm text-secondary">Quantity: {item.quantity}</p>
												<p class="text-base">{formatPrice(Number(item.price))}</p>
											</div>
										</div>
									</div>
									<span class="text-lg font-semibold">{formatPrice(item.quantity * Number(item.price))}</span>
								</div>
							{/each}
						</div>
					</section>
				</div>
			</div>
		{:else if paymentStatusMessage.includes('not successful')}
			<div class="container container-md">
				<div class="p-xl text-center space-y-md bg-background">
					<h1 class="text-3xl font-normal uppercase">Payment Failed</h1>
					<p class="text-error">{paymentStatusMessage}</p>
					<p>The order could not be created because the payment was not successful.</p>
					<a href="/checkout" class="btn btn-primary">
						Return to Checkout
					</a>
				</div>
			</div>
		{:else}
			<div class="flex justify-center items-center min-h-[400px]">
				<p class="text-secondary">Loading order details...</p>
			</div>
		{/if}
	</div>
</div>

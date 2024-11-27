<script>
	import { onMount } from 'svelte';
	import { fetchWooCommerceData } from '$lib/api';
	import { userInfo } from '$lib/stores/userInfoStore';
    import { get } from 'svelte/store'; // Import get to access store value
    import { defaultSEO, generateMetaTags } from '$lib/utils/seo';

	let orderData = null;
	let paymentStatusMessage = 'Checking payment status...';

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
</style>

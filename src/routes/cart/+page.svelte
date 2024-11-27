<script>
	import { cart, addItem, removeItem } from '$lib/stores/cartStore';
	import { goto } from '$app/navigation';
	import { defaultSEO, generateMetaTags } from '$lib/utils/seo';

	let total = $cart.reduce((sum, item) => sum + item.quantity * item.price, 0);

	// Create cart-specific SEO
	const pageSEO = {
		...defaultSEO,
		title: 'Cart | variable.gallery',
		description: 'Review the items in your cart before proceeding to checkout. Ensure you have all the digital artworks and NFTs you wish to purchase.',
		keywords: [
			...defaultSEO.keywords,
			'cart',
			'shopping cart',
			'digital art cart',
			'NFT cart',
			'review purchase'
		],
		openGraph: {
			...defaultSEO.openGraph,
			title: 'Cart | variable.gallery',
			description: 'Review the items in your cart before proceeding to checkout. Ensure you have all the digital artworks and NFTs you wish to purchase.',
			url: 'https://variable.gallery/cart'
		}
	};

	$: metaTags = generateMetaTags(pageSEO);

	function increaseQuantity(item) {
		addItem(item);
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
	}

	function proceedToCheckout() {
		goto('/checkout');
	}

	function formatPrice(price) {
		return `€${(price / 1).toFixed(2)}`;
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

<div class="px-page">
	<div class="cart-container gap-md flex w-full flex-col md:flex-row">
		<!-- Cart Items Section -->
		<div class="cart-details space-y-md bg-background flex-col md:w-2/3">
			<h1 class="text-xlarge text-primary font-bold mb-4">Cart</h1>
			
			{#if $cart.length === 0}
				<p class="text-primary">Your cart is empty.</p>
			{:else}
				{#each $cart as item}
					<div class="detail-row clean">
						<div class="flex gap-md">
							<img src={item.images[0]?.src} alt={item.name} class="h-24 w-24 object-cover" />
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
							<span class="text-lg font-semibold text-primary">{formatPrice(item.quantity * item.price)}</span>
							<button class="remove-btn" on:click={() => removeItem(item.id)}>Remove</button>
						</div>
					</div>
				{/each}
			{/if}
		</div>

		<!-- Cart Summary Section -->
		<div class="cart-summary space-y-md bg-background flex-col md:w-1/3">
			<h2 class="text-large text-primary font-bold mb-4">Summary</h2>
			
			<div class="detail-row clean">
				<span class="detail-label">Subtotal</span>
				<span class="detail-value">{formatPrice(total)}</span>
			</div>

			<div class="detail-row clean">
				<span class="detail-label">Total</span>
				<span class="detail-value text-lg font-bold">{formatPrice(total)}</span>
			</div>

			<button 
				class="button-primary w-full mt-8" 
				on:click={proceedToCheckout}
				disabled={$cart.length === 0}
			>
				Proceed to Checkout
			</button>
		</div>
	</div>
</div>

<style>
	.cart-container {
		max-width: var(--max-width-lg);
		margin: 0 auto;
	}

	.detail-row {
		display: flex;
		justify-content: space-between;
		align-items: flex-start;
		padding: var(--spacing-md) 0;
		border-bottom: 1px solid var(--secondary-bg-color);
	}

	.quantity-btn {
		padding: var(--spacing-xs) var(--spacing-sm);
		border: 1px solid var(--border-color);
		background: var(--background-color);
		color: var(--text-color);
		min-width: 2rem;
		text-align: center;
	}

	.remove-btn {
		color: var(--error-color);
		font-size: 0.875rem;
		background: none;
		border: none;
		cursor: pointer;
		padding: var(--spacing-xs);
	}

	.button-primary {
		background-color: var(--primary-color);
		color: var(--background-color);
		padding: var(--spacing-sm) var(--spacing-md);
		border: none;
		cursor: pointer;
		font-weight: 500;
		transition: all 0.2s ease-in-out;
	}

	.button-primary:disabled {
		opacity: 0.5;
		cursor: not-allowed;
	}

	@media (max-width: 767px) {
		.cart-container {
			flex-direction: column;
		}

		.cart-details, .cart-summary {
			width: 100%;
		}
	}
</style>

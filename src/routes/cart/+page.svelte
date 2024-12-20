<script>
	import { cart, addItem, removeItem } from '$lib/stores/cartStore';
	import { goto } from '$app/navigation';
	import { defaultSEO, generateMetaTags } from '$lib/utils/seo';

	/**
	 * @typedef {Object} CartItem
	 * @property {number} id
	 * @property {string} name
	 * @property {number} price
	 * @property {number} quantity
	 * @property {Array<{src: string}>} images
	 * @property {{name: string}=} variation
	 */

	/**
	 * @typedef {Object} MetaTag
	 * @property {string=} name
	 * @property {string=} property
	 * @property {string} content
	 */

	/** @type {number} */
	let total = $cart.reduce(
		/** @param {number} sum @param {CartItem} item @returns {number} */
		(sum, item) => sum + item.quantity * item.price,
		0
	);

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

	/** @type {MetaTag[]} */
	$: metaTags = generateMetaTags(pageSEO);

	/**
	 * @param {CartItem} item
	 */
	function increaseQuantity(item) {
		addItem(item);
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
	}

	function proceedToCheckout() {
		goto('/checkout');
	}

	/**
	 * @param {number} price
	 * @returns {string}
	 */
	function formatPrice(price) {
		return `€${(price / 1).toFixed(2)}`;
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

<div class="container p-2xl">
	<div class="grid grid-cols-1 md:grid-cols-3 gap-lg">
		<!-- Cart Items Section -->
		<div class="card md:col-span-2">
			<h1 class="h1">Cart</h1>
			
			{#if $cart.length === 0}
				<p>Your cart is empty.</p>
			{:else}
				{#each $cart as item}
					<div class="flex justify-between items-start p-md border-b border-secondary-bg">
						<div class="flex gap-md">
							<img 
								src={item.images[0]?.src} 
								alt={item.name} 
								class="h-24 w-24 object-cover"
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
							<span class="text-lg font-semibold">{formatPrice(item.quantity * item.price)}</span>
							<button class="btn btn-sm btn-outline text-error" on:click={() => removeItem(item.id)}>
								Remove
							</button>
						</div>
					</div>
				{/each}
			{/if}
		</div>

		<!-- Cart Summary Section -->
		<div class="card">
			<h2 class="h2">Summary</h2>
			
			<div class="flex justify-between p-md border-b border-secondary-bg">
				<span>Subtotal</span>
				<span>{formatPrice(total)}</span>
			</div>

			<div class="flex justify-between p-md">
				<span class="font-bold">Total</span>
				<span class="text-lg font-bold">{formatPrice(total)}</span>
			</div>

			<button 
				class="btn btn-primary w-full mt-lg" 
				on:click={proceedToCheckout}
				disabled={$cart.length === 0}
			>
				Proceed to Checkout
			</button>
		</div>
	</div>
</div>

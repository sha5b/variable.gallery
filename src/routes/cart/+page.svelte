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

<div class="page-container">
	<div class="content-section space-y-md">
		<section class="space-y-sm">
			<h1 class="text-3xl font-normal mb-6 uppercase">SHOPPING CART</h1>
			<p class="text-sm">
				Review your selected digital artworks and NFTs. Adjust quantities or remove items before proceeding to checkout.
			</p>
		</section>

		<div class="grid grid-cols-1 md:grid-cols-3 gap-lg">
			<!-- Cart Items Section -->
			<section class="md:col-span-2 space-y-md">
				<h2 class="text-xl font-normal uppercase mb-6">CART ITEMS</h2>
				
				{#if $cart.length === 0}
					<div class="flex flex-col items-center justify-center p-lg">
						<p>Your cart is empty.</p>
						<button class="w-full mt-8 bg-black text-white py-2 text-sm uppercase" on:click={() => goto('/shop')}>
							CONTINUE SHOPPING
						</button>
					</div>
				{:else}
					{#each $cart as item}
						<div class="flex justify-between items-start p-md">
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
										<button class="px-3 py-1 bg-black text-white text-sm" on:click={() => decreaseQuantity(item)}>−</button>
										<span class="mx-3 text-sm">{item.quantity}</span>
										<button class="px-3 py-1 bg-black text-white text-sm" on:click={() => increaseQuantity(item)}>+</button>
									</div>
								</div>
							</div>
							<div class="flex flex-col items-end justify-between">
								<span class="text-lg font-semibold">{formatPrice(item.quantity * item.price)}</span>
								<button class="px-3 py-1 bg-black text-white text-sm uppercase" on:click={() => removeItem(item.id)}>
									REMOVE
								</button>
							</div>
						</div>
					{/each}
				{/if}
			</section>

			<!-- Cart Summary Section -->
			<section class="space-y-md">
				<h2 class="text-xl font-normal uppercase mb-6">ORDER SUMMARY</h2>
				
				<div class="space-y-sm">
					<div class="flex justify-between p-md">
						<span class="uppercase">SUBTOTAL</span>
						<span>{formatPrice(total)}</span>
					</div>

					<div class="flex justify-between p-md">
						<span class="uppercase">TOTAL</span>
						<span class="text-lg">{formatPrice(total)}</span>
					</div>
				</div>

				<button 
					class="w-full mt-8 bg-black text-white py-2 text-sm uppercase" 
					on:click={proceedToCheckout}
					disabled={$cart.length === 0}
				>
					PROCEED TO CHECKOUT
				</button>
			</section>
		</div>
	</div>
</div>

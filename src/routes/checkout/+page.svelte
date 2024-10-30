<script>
    import { cart } from '$lib/stores/cartStore';
    import { goto } from '$app/navigation';
    import { fetchWooCommerceData } from '$lib/api';
    import { userInfo } from '$lib/stores/userInfoStore'; // Correct import for userInfo

    let savePaymentInfo = false;
    let addOrderNote = false;
    let errors = {}; // Track validation errors for each field

    console.log("Cart data:", $cart); // Debugging log for cart data

    // Validate fields function
    function validateFields() {
        errors = {}; // Reset errors

        if (!userInfo.email || !validateEmail(userInfo.email)) errors.email = 'Valid email address is required.';
        if (!userInfo.firstName) errors.firstName = 'First name is required.';
        if (!userInfo.lastName) errors.lastName = 'Last name is required.';
        if (!userInfo.address) errors.address = 'Address is required.';
        if (!userInfo.postalCode) errors.postalCode = 'Postal code is required.';
        if (!userInfo.city) errors.city = 'City is required.';
        if (!userInfo.phone) errors.phone = 'Phone number is required.';

        return Object.keys(errors).length === 0;  // Returns true if no errors
    }

    async function placeOrder() {
        if (!validateFields()) {
            alert("Please fill in all required fields.");
            return;
        }

        const lineItems = $cart.map((item) => ({
            product_id: item.id,
            quantity: item.quantity
        }));

        const orderData = {
            payment_method: 'woocommerce_payments',
            payment_method_title: 'Credit Card (WooPayments)',
            set_paid: false,
            billing: {
                first_name: userInfo.firstName,
                last_name: userInfo.lastName,
                address_1: userInfo.address,
                address_2: userInfo.apartment,
                city: userInfo.city,
                postcode: userInfo.postalCode,
                country: userInfo.country,
                email: userInfo.email,
                phone: userInfo.phone
            },
            line_items: lineItems,
            customer_note: addOrderNote ? 'Customer added a note' : ''
        };

        console.log("Order data being sent:", orderData); // Debugging log for order data

        try {
            const response = await fetchWooCommerceData('orders', {
                method: 'POST',
                body: JSON.stringify(orderData)
            });

            if (response && response.id) {
                if (savePaymentInfo) userInfo.set(userInfo); // Save info if requested
                goto(`/order-confirmation/${response.id}`);
            } else {
                console.error('Order creation failed:', response);
                alert('Order creation failed. Please check WooCommerce logs.');
            }
        } catch (error) {
            console.error('Error creating order:', error);
            alert('Error creating order. Please try again.');
        }
    }

    function validateEmail(email) {
        const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        return emailRegex.test(email);
    }

    let total = $cart.reduce((sum, item) => sum + item.quantity * item.price, 0);
    function formatPrice(price) {
        return `€${(price / 1).toFixed(2)}`;
    }
</script>

<div class="checkout-container mx-auto my-10 grid max-w-6xl grid-cols-1 gap-8 p-6 md:grid-cols-3">
    <!-- Left Column: Contact and Billing Information -->
    <div class="col-span-2 space-y-6">
        <h1 class="text-4xl font-bold">Checkout</h1>

        <!-- Contact Information -->
        <div>
            <h2 class="text-lg font-semibold">Contact information</h2>
            <input
                type="email"
                bind:value={userInfo.email}
                placeholder="Email address"
                class="mb-4 w-full rounded border p-2"
                class:border-red-500={errors.email}
            />
            {#if errors.email}<p class="text-red-500 text-sm">{errors.email}</p>{/if}
        </div>

        <!-- Billing Address -->
        <div>
            <h2 class="text-lg font-semibold">Billing address</h2>

            <select bind:value={userInfo.country} class="mb-4 w-full rounded border p-2">
                <option value="Austria">Austria</option>
                <option value="Germany">Germany</option>
                <option value="Switzerland">Switzerland</option>
            </select>

            <div class="grid grid-cols-2 gap-4">
                <input
                    type="text"
                    bind:value={userInfo.firstName}
                    placeholder="First name"
                    class="w-full rounded border p-2"
                    class:border-red-500={errors.firstName}
                />
                {#if errors.firstName}<p class="text-red-500 text-sm">{errors.firstName}</p>{/if}

                <input
                    type="text"
                    bind:value={userInfo.lastName}
                    placeholder="Last name"
                    class="w-full rounded border p-2"
                    class:border-red-500={errors.lastName}
                />
                {#if errors.lastName}<p class="text-red-500 text-sm">{errors.lastName}</p>{/if}
            </div>

            <input
                type="text"
                bind:value={userInfo.address}
                placeholder="Address"
                class="my-4 w-full rounded border p-2"
                class:border-red-500={errors.address}
            />
            {#if errors.address}<p class="text-red-500 text-sm">{errors.address}</p>{/if}

            <input
                type="text"
                bind:value={userInfo.postalCode}
                placeholder="Postal code"
                class="w-full rounded border p-2"
                class:border-red-500={errors.postalCode}
            />
            {#if errors.postalCode}<p class="text-red-500 text-sm">{errors.postalCode}</p>{/if}

            <input
                type="text"
                bind:value={userInfo.city}
                placeholder="City"
                class="w-full rounded border p-2"
                class:border-red-500={errors.city}
            />
            {#if errors.city}<p class="text-red-500 text-sm">{errors.city}</p>{/if}

            <input
                type="tel"
                bind:value={userInfo.phone}
                placeholder="Phone (optional)"
                class="my-4 w-full rounded border p-2"
                class:border-red-500={errors.phone}
            />
            {#if errors.phone}<p class="text-red-500 text-sm">{errors.phone}</p>{/if}
        </div>
    </div>

    <!-- Right Column: Order Summary -->
    <div class="rounded-lg bg-gray-100 p-6">
        <h2 class="mb-6 text-2xl font-bold">Order summary</h2>

        <!-- Display Cart Items -->
        {#each $cart as item}
            <div class="mb-4 flex justify-between">
                <div class="flex items-center">
                    <img src={item.images[0]?.src} alt={item.name} class="mr-4 h-16 w-16 rounded-md object-cover" />
                    <div>
                        <p class="font-semibold">{item.name}</p>
                        <p class="text-gray-600">{formatPrice(item.price)}</p>
                    </div>
                </div>
                <p class="font-semibold">{formatPrice(item.quantity * item.price)}</p>
            </div>
        {/each}

        <div class="flex justify-between text-lg font-semibold">
            <span>Subtotal</span>
            <span>{formatPrice(total)}</span>
        </div>

        <button
            on:click={placeOrder}
            class="mt-6 w-full rounded bg-black py-3 font-semibold text-white transition hover:bg-gray-800"
        >
            Place Order
        </button>
    </div>
</div>

<style>
    .checkout-container { max-width: 1200px; }
</style>

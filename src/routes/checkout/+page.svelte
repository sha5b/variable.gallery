<script>
    import { onMount } from 'svelte';
    import { cart } from '$lib/stores/cartStore';
    import { userInfo } from '$lib/stores/userInfoStore';
    import { handleCheckout } from '$lib/utils/checkoutHelpers';

    let cartItems = [];
    let user = {
        firstName: '',
        lastName: '',
        email: '',
        address: '',
        city: '',
        zip: ''
    };
    let paymentMethod = 'credit_card';
    let cardDetails = {
        card_number: '',
        expiration_month: '',
        expiration_year: '',
        cvv: ''
    };
    let errors = {};

    onMount(() => {
        cart.subscribe(value => {
            cartItems = value;
        });
        userInfo.subscribe(value => {
            user = value;
        });
    });

    function validateFields() {
        errors = {};
        if (!cardDetails.card_number) errors.card_number = 'Card number is required';
        if (!cardDetails.expiration_month) errors.expiration_month = 'Expiration month is required';
        if (!cardDetails.expiration_year) errors.expiration_year = 'Expiration year is required';
        if (!cardDetails.cvv) errors.cvv = 'CVV is required';
        return Object.keys(errors).length === 0;
    }

    async function initiateCheckout() {
        if (!validateFields()) return;

        const orderData = {
            payment_method: paymentMethod,
            payment_method_title: paymentMethod === 'paypal' ? 'PayPal' : 'Credit Card',
            set_paid: false,
            billing: {
                first_name: user.firstName,
                last_name: user.lastName,
                email: user.email,
                address_1: user.address,
                city: user.city,
                postcode: user.zip
            },
            line_items: cartItems.map(item => ({
                product_id: item.id,
                quantity: item.quantity
            }))
        };

        await handleCheckout(orderData, paymentMethod);
    }
</script>

<style>
    .checkout-container { max-width: 800px; margin: auto; padding: var(--spacing-md); }
    .form-group { margin-bottom: var(--spacing-md); }
    .input { width: 100%; padding: var(--spacing-sm); border: 1px solid var(--secondary-bg-color); border-radius: 4px; }
    .input.error { border-color: var(--error-color); }
    .error-message { color: var(--error-color); font-size: var(--font-size-small); margin-top: var(--spacing-xs); }
    .checkout-button { background-color: var(--primary-color); color: var(--background-color); padding: var(--spacing-sm) var(--spacing-md); border-radius: 4px; cursor: pointer; }
</style>

<div class="checkout-container">
    <div class="cart-summary">
        <h2>Order Summary</h2>
        {#each cartItems as item}
            <div class="cart-item">
                <span>{item.name} (x{item.quantity})</span>
                <span>${item.price * item.quantity}</span>
            </div>
        {/each}
        <hr />
        <p><strong>Total: ${cartItems.reduce((total, item) => total + item.price * item.quantity, 0)}</strong></p>
    </div>

    <div class="order-details">
        <h2>Billing Information</h2>
        <label class="form-group">
            First Name:
            <input type="text" class="input" bind:value={user.firstName} required />
        </label>
        <label class="form-group">
            Last Name:
            <input type="text" class="input" bind:value={user.lastName} required />
        </label>
        <label class="form-group">
            Email:
            <input type="email" class="input" bind:value={user.email} required />
        </label>
        <label class="form-group">
            Address:
            <input type="text" class="input" bind:value={user.address} required />
        </label>
        <label class="form-group">
            City:
            <input type="text" class="input" bind:value={user.city} required />
        </label>
        <label class="form-group">
            ZIP Code:
            <input type="text" class="input" bind:value={user.zip} required />
        </label>
    </div>

    <div class="payment-info">
        <h2>Card Details</h2>
        <label class="form-group">
            Card Number:
            <input type="text" class="input {errors.card_number ? 'error' : ''}" bind:value={cardDetails.card_number} placeholder="1234 5678 9012 3456" />
            {#if errors.card_number}<div class="error-message">{errors.card_number}</div>{/if}
        </label>
        <label class="form-group">
            Expiration Month:
            <input type="text" class="input {errors.expiration_month ? 'error' : ''}" bind:value={cardDetails.expiration_month} placeholder="MM" />
            {#if errors.expiration_month}<div class="error-message">{errors.expiration_month}</div>{/if}
        </label>
        <label class="form-group">
            Expiration Year:
            <input type="text" class="input {errors.expiration_year ? 'error' : ''}" bind:value={cardDetails.expiration_year} placeholder="YYYY" />
            {#if errors.expiration_year}<div class="error-message">{errors.expiration_year}</div>{/if}
        </label>
        <label class="form-group">
            CVV:
            <input type="text" class="input {errors.cvv ? 'error' : ''}" bind:value={cardDetails.cvv} placeholder="123" />
            {#if errors.cvv}<div class="error-message">{errors.cvv}</div>{/if}
        </label>
    </div>

    <button class="checkout-button" on:click={initiateCheckout}>Pay Now</button>
</div>

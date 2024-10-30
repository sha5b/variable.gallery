<script>
    import { onMount } from 'svelte';
    import { cart } from '$lib/stores/cartStore';
    import { createStripePaymentIntent } from '$lib/utils/checkoutHelpers';

    let cartItems = [];
    let totalAmount = 0;
    let clientSecret = null;
    let stripe = null;
    let elements = null;

    // Fetch cart items and initialize Stripe on mount
    onMount(async () => {
        cart.subscribe(items => { 
            cartItems = items; 
            totalAmount = cartItems.reduce((acc, item) => acc + item.price * item.quantity, 0) * 100; // Convert to cents
        });

        // Create PaymentIntent and initialize Stripe
        clientSecret = await createStripePaymentIntent(totalAmount);
        
        if (clientSecret) {
            stripe = Stripe('pk_test_51QFZNGL5hydQy59EOqqmhh9qhazgrVZIxBk8htdG99O4UuszPcNbKP9JsBUnjYXAlF057pEOeKHl5OIfIjxTviUL009puKHWap');
            elements = stripe.elements();
            const paymentElement = elements.create('payment');
            paymentElement.mount('#payment-element');
            console.log('Stripe and Elements initialized successfully');
        } else {
            console.error("Failed to initialize Stripe Elements due to missing clientSecret.");
        }
    });

    async function handleSubmit(event) {
        event.preventDefault();
        if (!stripe || !elements) {
            console.error("Stripe or Elements not initialized");
            return;
        }

        const { error } = await stripe.confirmPayment({
            elements,
            confirmParams: {
                return_url: '/order-confirmation/' // Replace with your success URL
            }
        });

        if (error) {
            console.error('Payment error:', error.message);
        }
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

    <form id="payment-form" on:submit={handleSubmit}>
        <div id="payment-element"></div>
        <button class="checkout-button">Pay Now</button>
    </form>
</div>

<script>
    import { onMount } from 'svelte';
    import { loadStripe } from '@stripe/stripe-js';

    let stripe, elements, cardElement;
    let amount = 1000; // Example amount in cents
    let currency = 'usd';
    let paymentSuccess = false;
    let paymentError = '';

    onMount(async () => {
        try {
            stripe = await loadStripe(import.meta.env.VITE_STRIPE_PUBLISHABLE_KEY);
            if (!stripe) throw new Error('Stripe failed to initialize.');

            elements = stripe.elements();
            cardElement = elements.create('card', {
                style: {
                    base: {
                        color: 'var(--text-color)',
                        fontFamily: 'var(--font-primary)',
                        fontSize: '16px',
                        '::placeholder': { color: 'var(--secondary-color)' },
                    }
                }
            });
            cardElement.mount('#card-element');
        } catch (error) {
            console.error('Initialization error:', error);
            paymentError = "Failed to initialize payment request. Please try again.";
        }
    });

    async function handlePayment() {
        paymentError = ''; // Reset error state
        console.log('Initiating payment...');

        try {
            // Step 1: Create a PaymentIntent by calling the server
            const response = await fetch('/checkout', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ amount, currency })
            });

            const result = await response.json();
            console.log('PaymentIntent response:', result);

            if (!result.success) {
                throw new Error(result.error || 'PaymentIntent creation failed');
            }

            const clientSecret = result.clientSecret;
            console.log('Received clientSecret:', clientSecret);

            // Step 2: Confirm the PaymentIntent with the collected card details
            const confirmation = await stripe.confirmCardPayment(clientSecret, {
                payment_method: {
                    card: cardElement,
                    billing_details: {
                        name: 'Customer Name',
                        email: 'customer@example.com'
                    }
                }
            });

            console.log('Payment confirmation response:', confirmation);

            if (confirmation.error) {
                console.error('Payment confirmation error:', confirmation.error.message);
                paymentError = confirmation.error.message;
            } else if (confirmation.paymentIntent && confirmation.paymentIntent.status === 'succeeded') {
                console.log('Payment successful!');
                paymentSuccess = true;
            } else {
                paymentError = 'Payment did not complete. Please try again.';
            }
        } catch (error) {
            console.error('Error during payment process:', error);
            paymentError = error.message || 'An error occurred during the payment process. Please try again.';
        }
    }
</script>

<h2 class="text-center font-heading text-xl margin-md text-primary-color">Checkout</h2>

<div class="container flex-center">
    {#if paymentSuccess}
        <p class="text-lg text-accent-color font-heading">Payment successful! Thank you for your purchase.</p>
    {:else}
        <form on:submit|preventDefault={handlePayment} class="w-full max-w-md bg-secondary-bg-color p-lg rounded-lg shadow-md">
            <label for="card-element" class="block font-heading text-base margin-md text-secondary-color">
                Credit or Debit Card
            </label>
            <div id="card-element" class="p-md border border-secondary-color rounded-sm margin-md"></div>

            {#if paymentError}
                <p class="error text-error-color text-sm margin-sm">{paymentError}</p>
            {/if}

            <button type="submit" class="button-primary w-full margin-md text-center text-lg">
                Pay Now
            </button>
        </form>
    {/if}
</div>

<style>
    .error {
        color: var(--error-color);
    }
</style>

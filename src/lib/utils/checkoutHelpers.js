import { fetchWooCommerceData, fetchStripeData } from '$lib/api';

// Create Order in WooCommerce
export async function createOrder(orderData) {
    try {
        const order = await fetchWooCommerceData('orders', {
            method: 'POST',
            body: JSON.stringify(orderData)
        });
        return order;
    } catch (error) {
        console.error('Order creation failed:', error);
        throw new Error(error.message || 'Error creating order');
    }
}

export async function createStripePaymentIntent(amount, currency = 'usd') {
    try {
        const response = await fetchStripeData('payment_intents', {
            method: 'POST',
            body: JSON.stringify({
                amount: Math.round(amount * 100), // Stripe expects the amount in cents
                currency,
                automatic_payment_methods: { enabled: true }
            })
        });
        if (!response.ok) {
            const errorData = await response.json();
            console.error('Error creating PaymentIntent:', errorData.error.message);
            throw new Error('Failed to create PaymentIntent');
        }
        const { client_secret: clientSecret } = await response.json();
        return clientSecret;
    } catch (error) {
        console.error('Error creating PaymentIntent:', error);
        throw error;
    }
}
// Capture Payment with WooCommerce
async function captureStripePayment(orderId, paymentIntentId) {
    try {
        const response = await fetchWooCommerceData(`wc_stripe/orders/${orderId}/capture_terminal_payment`, {
            method: 'POST',
            body: JSON.stringify({ payment_intent_id: paymentIntentId })
        });
        return response;
    } catch (error) {
        console.error('Error capturing Stripe payment:', error);
        throw new Error('Payment capture failed');
    }
}

// Cancel PaymentIntent if payment fails
async function cancelStripePaymentIntent(paymentIntentId) {
    try {
        await fetchStripeData(`payment_intents/${paymentIntentId}/cancel`, {
            method: 'POST'
        });
    } catch (error) {
        console.error('Error canceling PaymentIntent:', error);
    }
}

// Main Checkout Handler
export async function handleCheckout(orderData, amount) {
    let paymentIntentId;
    try {
        // Step 1: Create WooCommerce order
        
        const order = await createOrder(orderData);
        const orderId = order.id;

        // Step 2: Create a Stripe PaymentIntent with the order's total amount
        paymentIntentId = await createStripePaymentIntent(order.total);
        // const paymentIntentId = await createStripePaymentIntent(amount, 'usd', order.customer_id);
        // Step 3: Capture the PaymentIntent in WooCommerce
        const paymentCapture = await captureStripePayment(orderId, paymentIntentId);
        if (!paymentCapture.success) {
            await deleteOrder(orderId);
            await cancelStripePaymentIntent(paymentIntentId);
            throw new Error('Payment failed. Order has been canceled.');
        }
    } catch (error) {
        console.error('Checkout error:', error);
        if (paymentIntentId) await cancelStripePaymentIntent(paymentIntentId);
        throw error;
    }
}

// Delete WooCommerce Order if Payment Fails
export async function deleteOrder(orderId) {
    try {
        await fetchWooCommerceData(`orders/${orderId}`, { method: 'DELETE' });
        console.log(`Order ${orderId} deleted due to failed payment.`);
    } catch (error) {
        console.error('Error deleting order:', error);
        throw new Error(error.message || 'Error deleting order');
    }
}

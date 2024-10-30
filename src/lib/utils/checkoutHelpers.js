
import { fetchWooCommerceData } from '$lib/api';

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


// Function to create a payment intent with a static customer_id
export async function createPaymentIntent(orderId, paymentMethod, name, email) {
    try {
        const customer_id = generateCustomerId(name, email);

        const intentData = { 
            order_id: orderId, 
            payment_method: paymentMethod, 
            customer_id  // Use the generated unique customer ID
        };

        const intent = await fetchWooCommerceData('payments/payment_intents', {
            method: 'POST',
            body: JSON.stringify(intentData)
        });

        return intent;
    } catch (error) {
        console.error('Error creating payment intent:', error);
        throw new Error(`Payment intent creation failed: ${error.message}`);
    }
}

// Function to check the payment authorization status
export async function checkPaymentAuthorization(paymentIntentId) {
    try {
        const authorization = await fetchWooCommerceData(`payments/authorizations/${paymentIntentId}`);
        return authorization.status === 'succeeded';
    } catch (error) {
        console.error('Error checking payment authorization:', error);
        throw new Error(`Payment authorization failed: ${error.message}`);
    }
}

// Main checkout handler
export async function handleCheckout(orderData, paymentMethod) {
    try {
        const order = await createOrder(orderData);
        const orderId = order.id;

        const paymentIntent = await createPaymentIntent(orderId, paymentMethod);
        const paymentIntentId = paymentIntent.id;

        const paymentConfirmed = await checkPaymentAuthorization(paymentIntentId);
        if (!paymentConfirmed) {
            await deleteOrder(orderId);
            throw new Error('Payment failed. Order has been canceled.');
        }
    } catch (error) {
        console.error('Checkout process encountered an error:', error);
        throw error;  // Pass error up to display in UI
    }
}

// Helper function to create guest customer
function generateCustomerId(name, email) {
    return btoa(`${name}-${email}`).replace(/=/g, ''); // Base64 encoding without padding
}
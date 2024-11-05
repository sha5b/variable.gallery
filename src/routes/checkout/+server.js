import { json } from '@sveltejs/kit';
import { createPaymentIntent } from '$lib/api';

export async function POST({ request }) {
    try {
        const { amount, currency } = await request.json();

        // Validate required parameters
        if (!amount || !currency) {
            console.error('Missing required parameters:', { amount, currency });
            return json({ success: false, error: 'Missing required parameters: amount and/or currency' });
        }

        // Call the createPaymentIntent helper function
        const response = await createPaymentIntent(amount, currency);

        // Check if client_secret was successfully retrieved
        if (!response.client_secret) {
            console.error('Failed to retrieve client_secret from Stripe:', response);
            return json({ success: false, error: 'Failed to retrieve client_secret from Stripe' });
        }

        // Return the clientSecret in the response
        return json({ success: true, clientSecret: response.client_secret });
    } catch (error) {
        console.error('Error creating PaymentIntent:', error);
        return json({ success: false, error: 'Failed to create PaymentIntent', details: error.message });
    }
}

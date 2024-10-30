// +server.js
import { json } from '@sveltejs/kit';
import { fetchStripeData } from '$lib/api';

export async function POST({ request }) {
    try {
        const { amount, currency } = await request.json();

        if (!amount || !currency) {
            console.error('Missing required parameters:', { amount, currency });
            return json({ success: false, error: 'Missing required parameters: amount and/or currency' });
        }

        console.log('Creating PaymentIntent with:', { amount, currency });

        const response = await fetchStripeData('payment_intents', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({
                amount,
                currency,
            })
        });

        if (!response.client_secret) {
            console.error('Failed to retrieve client_secret from Stripe:', response);
            return json({ success: false, error: 'Failed to retrieve client_secret from Stripe' });
        }

        console.log('PaymentIntent created successfully:', response);
        return json({ success: true, clientSecret: response.client_secret });
    } catch (error) {
        console.error('PaymentIntent creation error:', error);
        return json({ success: false, error: 'Failed to create PaymentIntent', details: error.message });
    }
}

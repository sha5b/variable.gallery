import { json } from '@sveltejs/kit';
import Stripe from 'stripe';

export async function POST({ request }) {
    const stripe = new Stripe(import.meta.env.VITE_STRIPE_SECRET_KEY);
    
    try {
        const { amount, currency } = await request.json();

        if (!amount || !currency) {
            return json({ 
                success: false, 
                error: 'Missing required parameters: amount and/or currency' 
            }, { status: 400 });
        }

        const paymentIntent = await stripe.paymentIntents.create({
            amount,
            currency,
            payment_method_types: ['card', 'paypal', 'wechat_pay', 'eps']
        });

        return json({ 
            success: true, 
            clientSecret: paymentIntent.client_secret 
        });
    } catch (error) {
        console.error('Stripe Error:', error);
        return json({ 
            success: false, 
            error: error.message 
        }, { status: 500 });
    }
}
import { json } from '@sveltejs/kit';
import { fetchWooCommerceData } from '$lib/api';

export async function POST({ request }) {
    const orderDetails = await request.json();

    try {
        // Fetch cart nonce for authorization
        const cartData = await fetchWooCommerceData('cart');
        const nonce = cartData.nonce;

        // Add each product from `cartStore` to WooCommerce backend cart
        for (const item of orderDetails.cart) {
            await fetchWooCommerceData('cart/add-item', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                    'X-WC-Store-API-Nonce': nonce
                },
                body: JSON.stringify({ id: item.id, quantity: item.quantity })
            });
        }

        // Proceed with Checkout
        const checkoutData = await fetchWooCommerceData('checkout', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
                'X-WC-Store-API-Nonce': nonce
            },
            body: JSON.stringify({
                billing_address: orderDetails.billing,
                shipping_address: orderDetails.shipping,
                payment_method: orderDetails.payment_method
            })
        });

        return json({ success: true, orderId: checkoutData.id });
    } catch (error) {
        return json({ success: false, error: error.message });
    }
}

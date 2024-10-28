// src/lib/utils/checkoutHelpers.js

import { fetchWooCommerceData } from '$lib/api';
import { userInfo } from '$lib/stores/userInfoStore';
import { get } from 'svelte/store';
import { cart } from '$lib/stores/cartStore';

// Validate input fields
export function validateFields() {
    const errors = {};

    if (!userInfo.email || !validateEmail(userInfo.email)) errors.email = 'Valid email address is required.';
    if (!userInfo.firstName) errors.firstName = 'First name is required.';
    if (!userInfo.lastName) errors.lastName = 'Last name is required.';
    if (!userInfo.address) errors.address = 'Address is required.';
    if (!userInfo.postalCode) errors.postalCode = 'Postal code is required.';
    if (!userInfo.city) errors.city = 'City is required.';

    return {
        isValid: Object.keys(errors).length === 0,
        errors
    };
}

// Validate email format
function validateEmail(email) {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return emailRegex.test(email);
}

// Format price to display in Euros
export function formatPrice(price) {
    return `€${(price / 1).toFixed(2)}`;
}

// Initiate payment session and process payment
export async function initiatePayment(totalAmount) {
    try {
        const sessionResponse = await fetchWooCommerceData('payments/woopay/session', {
            method: 'POST',
            body: JSON.stringify({ email: userInfo.email })
        });

        if (sessionResponse && sessionResponse.session_id) {
            const paymentResponse = await fetchWooCommerceData('payments/woopay', {
                method: 'POST',
                body: JSON.stringify({
                    session_id: sessionResponse.session_id,
                    amount: totalAmount * 100,
                    currency: 'EUR',
                    payment_method: 'woocommerce_payments',
                    billing: {
                        first_name: userInfo.firstName,
                        last_name: userInfo.lastName,
                        address_1: userInfo.address,
                        city: userInfo.city,
                        postcode: userInfo.postalCode,
                        country: userInfo.country,
                        email: userInfo.email,
                        phone: userInfo.phone
                    }
                })
            });

            return paymentResponse.status === 'success';
        } else {
            alert('Failed to create payment session.');
            return false;
        }
    } catch (error) {
        alert('Error during payment process.');
        console.error(error);
        return false;
    }
}

// Create an order after successful payment
export async function placeOrder(addOrderNote, savePaymentInfo) {
    const items = get(cart).map(item => ({
        product_id: item.id,
        quantity: item.quantity
    }));

    const orderData = {
        payment_method: 'woocommerce_payments',
        payment_method_title: 'Credit Card (WooPayments)',
        set_paid: true,
        billing: {
            first_name: userInfo.firstName,
            last_name: userInfo.lastName,
            address_1: userInfo.address,
            city: userInfo.city,
            postcode: userInfo.postalCode,
            country: userInfo.country,
            email: userInfo.email,
            phone: userInfo.phone
        },
        line_items: items,
        customer_note: addOrderNote ? 'Customer added a note' : ''
    };

    try {
        const response = await fetchWooCommerceData('orders', {
            method: 'POST',
            body: JSON.stringify(orderData)
        });

        if (response && response.id) {
            if (savePaymentInfo) userInfo.set(userInfo);
            return response;
        } else {
            alert('Order creation failed.');
            return null;
        }
    } catch (error) {
        alert('Error creating order.');
        console.error(error);
        return null;
    }
}

import { fetchWooCommerceData } from '$lib/api';
import { userInfo } from '$lib/stores/userInfoStore';
import { cart } from '$lib/stores/cartStore';
import { get } from 'svelte/store';

// Function to create an order in WooCommerce
export async function createOrder(paymentMethod = 'credit_card', addOrderNote = false) {
    const items = get(cart).map(item => ({
        product_id: item.id,
        quantity: item.quantity
    }));

    const orderData = {
        payment_method: paymentMethod === 'bacs' ? 'bacs' : 'credit_card',
        payment_method_title: paymentMethod === 'bacs' ? 'Direct Bank Transfer' : 'Credit Card',
        set_paid: false, // Payment will be captured after authorization
        billing: getBillingInfo(),
        line_items: items,
        customer_note: addOrderNote ? 'Customer added a note' : ''
    };

    try {
        const response = await fetchWooCommerceData('orders', {
            method: 'POST',
            body: JSON.stringify(orderData)
        });
        console.log("Order Data Sent:", orderData);
        console.log("Order Created Response:", response);

        if (response && response.id) {
            return response.id; // Return the order ID for payment handling
        } else {
            console.error("Order creation failed:", response);
            return null;
        }
    } catch (error) {
        console.error("Error creating order:", error);
        return null;
    }
}

// Function to create a payment authorization intent for the order
export async function createPaymentAuthorization(orderId, totalAmount) {
    const data = {
        amount: totalAmount * 100, // Convert to cents
        currency: 'EUR',
        payment_method_types: ['card'],
        capture_method: 'automatic', // Set to automatic capture if immediate payment is preferred
        order_id: orderId
    };

    try {
        console.log("Payment Authorization Data Sent:", data);
        const response = await fetchWooCommerceData('payments/authorizations', {  // Correct endpoint for WooCommerce Payments
            method: 'POST',
            body: JSON.stringify(data)
        });
        console.log("Payment Authorization Response:", response);

        if (response && response.status === 'requires_payment_method') {
            return response.id; // Payment intent ID needed to confirm the payment
        } else {
            console.error("Payment authorization creation failed:", response);
            return null;
        }
    } catch (error) {
        console.error("Error creating payment authorization:", error);
        return null;
    }
}

// Function to confirm the payment authorization with card details
export async function confirmPaymentAuthorization(paymentAuthorizationId, cardDetails) {
    const data = {
        payment_method_data: {
            type: 'card',
            card: {
                number: cardDetails.card_number.replace(/\s+/g, ''), // Remove any spaces in the card number
                exp_month: cardDetails.expiration_month.padStart(2, '0'), // Ensure 2-digit format for month
                exp_year: cardDetails.expiration_year.length === 2 ? `20${cardDetails.expiration_year}` : cardDetails.expiration_year,
                cvv: cardDetails.cvv
            }
        }
    };

    try {
        console.log("Confirm Payment Authorization Data Sent:", data);
        const response = await fetchWooCommerceData(`payments/authorizations/${paymentAuthorizationId}/confirm`, {  // Confirm authorization
            method: 'POST',
            body: JSON.stringify(data)
        });
        console.log("Confirm Payment Authorization Response:", response);

        return response.status === 'succeeded';
    } catch (error) {
        console.error("Error confirming payment authorization:", error);
        return false;
    }
}

// Function to delete an order in WooCommerce if payment fails
async function deleteOrder(orderId) {
    try {
        const response = await fetchWooCommerceData(`orders/${orderId}`, {
            method: 'DELETE',
            headers: {
                'Content-Type': 'application/json'
            }
        });
        console.log("Order Deleted Response for order ID:", orderId, response);
    } catch (error) {
        console.error("Error deleting order ID:", orderId, error);
    }
}

// Helper function to get billing information from userInfo
function getBillingInfo() {
    const billingInfo = {
        first_name: userInfo.firstName,
        last_name: userInfo.lastName,
        address_1: userInfo.address,
        city: userInfo.city,
        postcode: userInfo.postalCode,
        country: userInfo.country,
        email: userInfo.email,
        phone: userInfo.phone
    };
    console.log("Billing Info:", billingInfo);
    return billingInfo;
}

// Function to validate basic card details format
function validateCardDetails(cardDetails) {
    const cardNumberRegex = /^\d{13,19}$/; // 13 to 19 digits for most cards
    const cvvRegex = /^\d{3,4}$/; // 3 digits for most, 4 for AmEx

    return (
        cardNumberRegex.test(cardDetails.card_number.replace(/\s+/g, '')) &&
        parseInt(cardDetails.expiration_month) >= 1 &&
        parseInt(cardDetails.expiration_month) <= 12 &&
        cardDetails.expiration_year.length >= 2 &&
        cvvRegex.test(cardDetails.cvv)
    );
}

// Optional email validation helper
function validateEmail(email) {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return emailRegex.test(email);
}

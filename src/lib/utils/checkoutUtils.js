/**
 * @typedef {Object} CartItem
 * @property {number} id
 * @property {string} name
 * @property {number|string} price
 * @property {number} quantity
 * @property {Array<{src: string}>} images
 * @property {{name: string}=} variation
 */

/**
 * @typedef {Object} UserInfo
 * @property {string} firstName
 * @property {string} lastName
 * @property {string} email
 * @property {string} phone
 * @property {string} phoneCountryCode
 * @property {string} address
 * @property {string} apartment
 * @property {string} city
 * @property {string} postalCode
 * @property {string} country
 * @property {null} orderId
 */

/**
 * @typedef {Object} ValidationErrors
 * @property {string=} firstName
 * @property {string=} lastName
 * @property {string=} email
 * @property {string=} phone
 * @property {string=} address
 * @property {string=} city
 * @property {string=} postalCode
 * @property {string=} country
 */

import { fetchWooCommerceData } from '$lib/api';

/**
 * Validates user information form data
 * @param {UserInfo} user - User information to validate
 * @returns {{ isValid: boolean, errors: ValidationErrors }} Validation result and any errors
 */
export function validateCheckoutForm(user) {
    /** @type {ValidationErrors} */
    const errors = {};

    if (!user.firstName) errors.firstName = 'First name is required.';
    if (!user.lastName) errors.lastName = 'Last name is required.';
    if (!user.email || !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(user.email))
        errors.email = 'Valid email is required.';
    if (!user.address) errors.address = 'Address is required.';
    if (!user.city) errors.city = 'City is required.';
    if (!user.postalCode || user.postalCode.length < 3)
        errors.postalCode = 'Valid postal code required (minimum 3 characters)';
    if (!user.phone || !/^\d{10,15}$/.test(user.phone))
        errors.phone = 'Valid phone number is required.';

    return {
        isValid: Object.keys(errors).length === 0,
        errors
    };
}

/**
 * Formats a price number or string to EUR currency format
 * @param {number|string} price - Price to format
 * @returns {string} Formatted price string
 */
export function formatPrice(price) {
    const numPrice = typeof price === 'string' ? parseFloat(price) : price;
    return `€${numPrice.toFixed(2)}`;
}

/**
 * Calculates cart totals including subtotal and shipping
 * @param {CartItem[]} cartItems - Array of cart items
 * @returns {{ subtotal: number, shippingCost: number, total: number }} Cart totals
 */
export function calculateCartTotals(cartItems) {
    const subtotal = cartItems.reduce((sum, item) => {
        const itemPrice = typeof item.price === 'string' ? parseFloat(item.price) : item.price;
        return sum + itemPrice * item.quantity;
    }, 0);

    const shippingCost = 15;
    const total = subtotal + shippingCost;

    return {
        subtotal,
        shippingCost,
        total
    };
}

/**
 * Creates a WooCommerce order
 * @param {UserInfo & { items: CartItem[] }} orderData - Order data including user info and cart items
 * @returns {Promise<any>} Created WooCommerce order
 */
export async function createWooCommerceOrder(orderData) {
    const response = await fetchWooCommerceData('orders', {
        method: 'POST',
        body: JSON.stringify({
            payment_method: 'stripe',
            payment_method_title: 'Credit Card (Stripe)',
            set_paid: true,
            status: 'processing',
            billing: {
                first_name: orderData.firstName,
                last_name: orderData.lastName,
                address_1: orderData.address,
                city: orderData.city,
                postcode: orderData.postalCode,
                country: orderData.country,
                email: orderData.email,
                phone: orderData.phone || ''
            },
            shipping: {
                first_name: orderData.firstName,
                last_name: orderData.lastName,
                address_1: orderData.address,
                city: orderData.city,
                postcode: orderData.postalCode,
                country: orderData.country
            },
            line_items: orderData.items.map((item) => ({
                product_id: item.id,
                quantity: item.quantity
            }))
        })
    });

    if (!response || !response.id) {
        throw new Error('Failed to create order - no order ID received');
    }

    return response;
}

/**
 * Handles successful order completion
 * @param {string} orderId - WooCommerce order ID
 * @returns {Promise<any>} Order data
 */
export async function handleOrderSuccess(orderId) {
    try {
        const response = await fetchWooCommerceData(`orders/${orderId}`);
        if (response && response.id) {
            // Clear session storage
            sessionStorage.removeItem('pendingOrderData');
            sessionStorage.removeItem('wooOrderId');
            return response;
        }
        throw new Error('Failed to fetch order details');
    } catch (error) {
        console.error('Error handling order success:', error);
        throw error;
    }
}

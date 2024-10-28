<script>
    import { onMount } from 'svelte';
    import { page } from '$app/stores';
    import { fetchWooCommerceData } from '$lib/api';

    let orderData = null;
    let { orderId } = $page.params; // Access orderId from URL params
    let paymentStatusMessage = ''; // Message to display payment status

    onMount(async () => {
        if (orderId) {
            try {
                orderData = await fetchWooCommerceData(`orders/${orderId}`);
                console.log("Order Data:", orderData);
                
                // Check the order status for payment success or failure
                if (orderData.status === 'completed' || orderData.status === 'processing') {
                    paymentStatusMessage = 'Payment was successful!';
                } else if (orderData.status === 'failed') {
                    paymentStatusMessage = 'Payment failed. Please contact support.';
                } else {
                    paymentStatusMessage = 'Payment is pending. Please check back later.';
                }
            } catch (error) {
                console.error('Failed to fetch order data:', error);
                paymentStatusMessage = 'There was an error fetching the order details.';
            }
        }
    });
</script>

{#if orderData}
<div class="order-confirmation-container mx-auto my-10 max-w-4xl p-6 bg-gray-50 rounded shadow">
    <h1 class="text-3xl font-bold mb-4">Thank you for your order!</h1>
    <p class="text-lg">Order ID: <strong>{orderData.id}</strong></p>
    <p class="text-lg">Status: <strong>{orderData.status}</strong></p>
    <p class="text-lg font-semibold mt-4 text-green-600">{paymentStatusMessage}</p>
    
    <h2 class="text-2xl mt-6 mb-2">Order Summary</h2>
    <ul>
        {#each orderData.line_items as item}
        <li class="mb-4">
            <div class="font-semibold">{item.name}</div>
            <div>Quantity: {item.quantity}</div>
            <div>Price: €{(item.price / 1).toFixed(2)}</div>
        </li>
        {/each}
    </ul>
    
    <h2 class="text-2xl mt-6 mb-2">Billing Details</h2>
    <p>{orderData.billing.first_name} {orderData.billing.last_name}</p>
    <p>{orderData.billing.address_1}, {orderData.billing.city}, {orderData.billing.postcode}</p>
    <p>{orderData.billing.country}</p>
    <p>Email: {orderData.billing.email}</p>
    <p>Phone: {orderData.billing.phone}</p>
    
    <h2 class="text-2xl mt-6 mb-2">Total</h2>
    <p class="text-xl font-bold">€{(orderData.total / 1).toFixed(2)}</p>
</div>
{:else}
<p>Loading order details...</p>
{/if}

<style>
    .order-confirmation-container {
        max-width: 600px;
        margin: 2rem auto;
        text-align: center;
    }
    .text-green-600 {
        color: green;
    }
    .text-red-600 {
        color: red;
    }
</style>

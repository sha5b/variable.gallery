<script>
    import UserInformation from './UserInformation.svelte';
    import PaymentSection from './PaymentSection.svelte';
    import OrderSummary from './OrderSummary.svelte';
    import { validateFields, initiatePayment, placeOrder } from '$lib/utils/checkoutHelpers';
    import { goto } from '$app/navigation';

    let savePaymentInfo = false;
    let errors = {};
    let addOrderNote = false;

    async function handleSubmit() {
        const { isValid, errors: validationErrors } = validateFields();
        errors = validationErrors;

        if (!isValid) {
            alert("Please fill in all required fields.");
            return;
        }

        const paymentSuccessful = await initiatePayment();
        if (!paymentSuccessful) return;

        const orderCreated = await placeOrder(addOrderNote, savePaymentInfo);
        if (orderCreated) {
            goto(`/order-confirmation/${orderCreated.id}`);
        } else {
            alert("Order creation failed. Please try again.");
        }
    }
</script>

<div class="checkout-container md:px-8 my-10">
    <div class="grid grid-cols-1 md:grid-cols-3 gap-8">
        <!-- Left Column: User Information and Payment Section -->
        <div class="space-y-8 md:col-span-2">
            <h1 class="text-4xl font-bold mb-4">Checkout</h1>
            <UserInformation {errors} />
            <PaymentSection bind:savePaymentInfo />
        </div>
        
        <!-- Right Column: Order Summary and Place Order Button -->
        <div>
            <OrderSummary />
            <button on:click={handleSubmit} class="place-order-button w-full mt-6">
                Place Order
            </button>
        </div>
    </div>
</div>

<style>
    .checkout-container {
        max-width: 100%;
    }

    .place-order-button {
        background-color: #333;
        color: white;
        font-weight: bold;
        padding: 0.75rem;
        border-radius: 8px;
        cursor: pointer;
        transition: background-color 0.3s ease;
    }

    .place-order-button:hover {
        background-color: #555;
    }

    /* Responsive input field width */
    input, select, textarea {
        width: 100%;
        padding: 0.75rem;
        border: 1px solid #ccc;
        border-radius: 8px;
        background-color: #f9f9f9;
    }
</style>

<script>
    export let savePaymentInfo = false;
</script>

<div class="payment-section">
    <h2 class="text-lg font-semibold mb-4">Payment Options</h2>
    <div class="flex flex-col gap-4 mb-4">
        <input type="tel" pattern="\d*" placeholder="Card Number" class="input-field" maxlength="16" />
        <div class="flex flex-col md:flex-row gap-4">
            <input type="text" placeholder="Expiration Date (MM/YY)" class="input-field" maxlength="5" />
            <input type="tel" pattern="\d*" placeholder="CVV" class="input-field" maxlength="3" />
        </div>
    </div>
    <div class="flex items-center">
        <input type="checkbox" bind:checked={savePaymentInfo} class="mr-2" />
        <label>Save payment information for future purchases.</label>
    </div>
</div>

<style>
    .payment-section {
        border: 1px solid #e0e0e0;
        padding: 1rem;
        border-radius: 8px;
        background-color: #fafafa;
    }

    .input-field {
        padding: 0.75rem;
        border: 1px solid #ddd;
        border-radius: 6px;
        background-color: #fff;
        width: 100%;
    }
</style>

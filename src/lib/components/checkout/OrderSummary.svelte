<script>
    import { cart } from '$lib/stores/cartStore';
    let total = $cart.reduce((sum, item) => sum + item.quantity * item.price, 0);
</script>

<div class="order-summary">
    <h2 class="text-2xl font-bold mb-4">Order Summary</h2>
    {#each $cart as item}
        <div class="item flex items-center mb-4">
            <img src={item.images[0]?.src} alt={item.name} class="thumbnail mr-4" />
            <div>
                <p class="font-semibold">{item.name}</p>
                <p class="text-gray-600">{item.quantity} x €{item.price}</p>
            </div>
        </div>
    {/each}
    <div class="total flex justify-between text-lg font-semibold mt-4">
        <span>Total:</span>
        <span>€{total}</span>
    </div>
</div>

<style>
    .order-summary {
        padding: 1rem;
        background-color: #f7f7f7;
        border-radius: 8px;
        border: 1px solid #e0e0e0;
    }

    .thumbnail {
        width: 60px;
        height: 60px;
        object-fit: cover;
        border-radius: 4px;
    }

    .total {
        padding-top: 1rem;
        border-top: 1px solid #ddd;
    }
</style>

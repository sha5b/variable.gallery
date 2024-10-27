<script>
    import { page } from '$app/stores';
    import { onMount } from 'svelte';
  
    let orderId;
  
    $: page.subscribe((p) => {
      const urlParams = new URLSearchParams(p.url.search);
      orderId = urlParams.get('orderId');
    });
  
    onMount(() => {
      // Optionally, you can fetch order details here using `orderId`
    });
  </script>
  
  <div class="order-confirmation-container">
    <h1>Thank you for your order!</h1>
    <p>Your order ID is: <strong>{orderId}</strong></p>
    <p>We’re processing your order and will send updates to your email.</p>
  </div>
  
  <style>
    .order-confirmation-container {
      max-width: 600px;
      margin: 2rem auto;
      text-align: center;
    }
  </style>
  
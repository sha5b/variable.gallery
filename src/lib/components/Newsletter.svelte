<script>
    let email = '';
    let message = '';
  
    function handleSubscribe() {
      if (validateEmail(email)) {
        message = 'Thank you for subscribing!';
        email = '';
      } else {
        message = 'Please enter a valid email address.';
      }
    }
  
    function validateEmail(email) {
      const re = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
      return re.test(String(email).toLowerCase());
    }
  </script>
  
  <div class="newsletter-container bg-[var(--primary-color)] text-[var(--background-color)] w-full py-8">
    <div class="container md:flex md:items-center md:justify-between justify-between" >
      <div class="text-left max-w-lg">
        <h2 class="text-[var(--font-size-large)] font-semibold mb-2">Stay Updated</h2>
        <p class="text-[var(--background-color)] text-sm opacity-90 mb-4">
          Subscribe to our newsletter for the latest updates on new products, sales, and special offers.
        </p>
      </div>
  
      <div class="flex flex-col md:flex-row items-center gap-4 w-full md:w-auto">
        <input
          type="email"
          placeholder="Enter your email"
          bind:value={email}
          class="w-full md:flex-grow p-2 rounded-md text-[var(--text-color)] placeholder-opacity-50 border border-gray-300"
        />
        <button
          on:click={handleSubscribe}
          class="bg-[var(--secondary-color)] hover:bg-[var(--accent-color)] text-[var(--background-color)] font-semibold p-2 rounded-md transition duration-300"
        >
          Subscribe
        </button>
      </div>
    </div>
  
    <!-- {#if message}
      <p class="mt-4 text-center md:text-left text-xs text-yellow-300">{message}</p>
    {/if} -->
  </div>
  
  <style>
    .newsletter-container {

    }

  </style>
  
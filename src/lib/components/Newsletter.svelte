<script>
  let email = '';
  let message = '';
  let showTooltip = false;

  function handleSubscribe() {
    if (validateEmail(email)) {
      message = 'Thank you for subscribing!';
      email = '';
    } else {
      message = 'Please enter a valid email address.';
    }
    showTooltip = true;

    // Hide tooltip after 3 seconds
    setTimeout(() => {
      showTooltip = false;
      message = '';
    }, 3000);
  }

  function validateEmail(email) {
    const re = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return re.test(String(email).toLowerCase());
  }
</script>

<div class="newsletter-container bg-[var(--primary-color)] text-[var(--background-color)] w-full py-8 relative">
  <div class="flex md:flex md:items-center md:justify-between justify-between">
    <div class="text-left max-w-lg">
      <h2 class="text-[var(--font-size-large)] font-semibold mb-2">Stay Updated</h2>
      <p class="text-[var(--background-color)] text-sm opacity-90 mb-4">
        Subscribe to our newsletter for the latest updates on new products, sales, and special offers.
      </p>
    </div>

    <!-- Tooltip Message -->
    {#if showTooltip}
      <div class="tooltip">{message}</div>
    {/if}

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
</div>

<style>
  .newsletter-container {
    padding: var(--page-padding);
    text-align: center;
  }

  .tooltip {
    position: absolute;
    bottom: 100%;
    left: 50%;
    transform: translateX(-50%);
    background-color: var(--secondary-color);
    color: var(--background-color);
    padding: 0.5rem 1rem;
    border-radius: var(--spacing-xs);
    font-size: var(--font-size-small);
    white-space: nowrap;
    margin-bottom: 0.5rem;
    animation: fadeInOut 3s ease;
  }

  @keyframes fadeInOut {
    0%, 100% {
      opacity: 0;
    }
    10%, 90% {
      opacity: 1;
    }
  }

  /* Input and button styling */
  input[type="email"] {
    width: 100%;
    padding: var(--spacing-xs);
    border-radius: var(--spacing-xs);
    border: 1px solid #ccc;
    color: var(--text-color);
  }

  button {
    background-color: var(--secondary-color);
    color: var(--background-color);
    font-weight: bold;
    padding: var(--spacing-xs) var(--spacing-md);
    border-radius: var(--spacing-xs);
    transition: background-color 0.3s ease;
  }

  button:hover {
    background-color: var(--accent-color);
  }
</style>

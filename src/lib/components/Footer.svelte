<script>
  import ContactModal from '$lib/components/ContactModal.svelte';

  // Footer navigation links
  const links = [
    { label: 'About Us', href: '/about' },
    { label: 'Contact', href: 'contact' }, // Keep href for the link styling
  ];

  const socialLinks = [
    { icon: '🐦', label: 'Twitter', href: 'https://twitter.com' },
    { icon: '📘', label: 'Facebook', href: 'https://facebook.com' },
    { icon: '📸', label: 'Instagram', href: 'https://instagram.com' },
    { icon: '👔', label: 'LinkedIn', href: 'https://linkedin.com' },
  ];

  const currentYear = new Date().getFullYear();

  // State to control modal visibility
  let isModalOpen = false;

  // Function to open the modal
  function openModal() {
    isModalOpen = true;
  }

  // Function to close the modal
  function closeModal() {
    isModalOpen = false;
  }
</script>

<footer class="w-full bg-gray-800 text-gray-200 p-8">
  <div class="container mx-auto grid md:grid-cols-2 gap-6 text-sm">
    <!-- Footer Navigation Links -->
    <div class="footer-links space-y-4">
      <h2 class="text-xl font-bold">Quick Links</h2>
      <ul class="space-y-2">
        {#each links as { label, href }}
          <li>
            {#if label === 'Contact'}
              <!-- Trigger modal when clicking "Contact" -->
              <a href={href} on:click|preventDefault={openModal} class="hover:text-gray-400 transition">{label}</a>
            {:else}
              <a href={href} class="hover:text-gray-400 transition">{label}</a>
            {/if}
          </li>
        {/each}
      </ul>
    </div>

    <!-- Social Media Links -->
    <div class="footer-social space-y-4">
      <h2 class="text-xl font-bold">Connect with Us</h2>
      <ul class="flex space-x-4">
        {#each socialLinks as { icon, label, href }}
          <li>
            <a href={href} class="hover:text-gray-400 transition" target="_blank" rel="noopener noreferrer" aria-label={label}>
              <span class="text-2xl">{icon}</span>
            </a>
          </li>
        {/each}
      </ul>
    </div>
  </div>

  <!-- Divider -->
  <div class="my-4 border-t border-gray-700"></div>

  <!-- Copyright Section -->
  <div class="text-center text-sm">
    <p>&copy; {currentYear} Your Company. All rights reserved.</p>
  </div>

  <!-- Contact Modal Component -->
  <ContactModal bind:open={isModalOpen} on:close={closeModal} />
</footer>

<style>
  .footer-links, .footer-social {
    padding: 1rem 0;
  }
</style>

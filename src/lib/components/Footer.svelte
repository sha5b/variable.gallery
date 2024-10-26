<script>
  import ContactModal from '$lib/components/ContactModal.svelte';

  const links = [
    { label: 'About Us', href: '/about' },
    { label: 'Contact', href: 'contact' },
  ];

  const socialLinks = [
    { label: 'Instagram', href: 'https://www.instagram.com/shahabned/' },
    { label: 'Email', href: 'mailto:ned.tabulov@gmail.com' },
  ];

  let isModalOpen = false;

  function openModal() {
    isModalOpen = true;
  }

  function closeModal() {
    isModalOpen = false;
  }
</script>

<footer class="footer-container w-full bg-[var(--primary-color)] text-gray-100">
  <div class="container flex flex-col md:flex-row gap-8">
    
    <!-- Quick Links Section aligned to the left -->
    <div class="footer-links md:w-1/2 md:text-left text-left">
      <h2 class="text-[var(--font-size-large)] font-bold mb-2">Quick Links</h2>
      <ul class="space-y-1">
        {#each links as { label, href }}
          <li>
            <a href={href} class="hover:text-[var(--accent-color)] transition" on:click|preventDefault={label === 'Contact' ? openModal : null}>
              {label}
            </a>
          </li>
        {/each}
      </ul>
    </div>

    <!-- Social Media Links aligned to the center-right -->
    <div class="footer-social md:w-1/2 text-left md:text-left md:ml-auto">
      <h2 class="text-[var(--font-size-large)] font-bold mb-2">Connect with Us</h2>
      <ul class="space-y-1">
        {#each socialLinks as { label, href }}
          <li><a href={href} target="_blank" rel="noopener noreferrer" class="hover:text-[var(--accent-color)] transition">{label}</a></li>
        {/each}
      </ul>
    </div>
  </div>

  <!-- Copyright Section -->
  <div class="container text-xs mt-4 md:mt-8 text-left">
    <p>&copy; {new Date().getFullYear()} Your Company. All rights reserved.</p>
  </div>

  <!-- Contact Modal Component -->
  <ContactModal open={isModalOpen} on:close={closeModal} />
</footer>

<style>
  .footer-container {
    padding-top: calc(var(--page-padding) / 2);
    padding-bottom: calc(var(--page-padding) / 2);
  }

  @media (min-width: 768px) {
    .footer-container {
      padding-top: calc(var(--page-padding-md) / 2);
      padding-bottom: calc(var(--page-padding-md) / 2);
    }
  }
</style>

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

<footer class="footer-container bg-[var(--primary-color)] text-[var(--background-color)]">
  <div class="container flex flex-col md:flex-row gap-[var(--spacing-md)]">
    <!-- Quick Links Section -->
    <div class="footer-links md:w-1/2 text-left">
      <h2 class="text-[var(--font-size-large)] font-bold mb-[var(--spacing-sm)]">Quick Links</h2>
      <ul class="space-y-[var(--spacing-xs)]">
        {#each links as { label, href }}
          <li>
            <a href={href} class="hover:text-[var(--accent-color)] transition" on:click|preventDefault={label === 'Contact' ? openModal : null}>
              {label}
            </a>
          </li>
        {/each}
      </ul>
    </div>

    <!-- Social Media Links -->
    <div class="footer-social md:w-1/2 text-left md:ml-auto">
      <h2 class="text-[var(--font-size-large)] font-bold mb-[var(--spacing-sm)]">Connect with Us</h2>
      <ul class="space-y-[var(--spacing-xs)]">
        {#each socialLinks as { label, href }}
          <li><a href={href} target="_blank" rel="noopener noreferrer" class="hover:text-[var(--accent-color)] transition">{label}</a></li>
        {/each}
      </ul>
    </div>
  </div>

  <!-- Copyright Section -->
  <div class="container text-[var(--font-size-small)] mt-[var(--spacing-md)] text-left">
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

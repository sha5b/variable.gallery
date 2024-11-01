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

<footer class="footer-container bg-primary text-background px-page py-lg">
  <div class="container flex flex-col md:flex-row gap-md justify-start">
    <!-- Quick Links Section -->
    <div class="footer-links flex-shrink-0 text-left">
      <h2 class="text-large font-bold">Quick Links</h2>
      <ul class="space-y-xs">
        {#each links as { label, href }}
          <li>
            <a href={href} class="hover:text-accent transition-default" on:click|preventDefault={label === 'Contact' ? openModal : null}>
              {label}
            </a>
          </li>
        {/each}
      </ul>
    </div>

    <!-- Social Media Links -->
    <div class="footer-social flex-shrink-0 text-left">
      <h2 class="text-large font-bold">Connect with Us</h2>
      <ul class="space-y-xs">
        {#each socialLinks as { label, href }}
          <li>
            <a href={href} target="_blank" rel="noopener noreferrer" class="hover:text-accent transition-default">
              {label}
            </a>
          </li>
        {/each}
      </ul>
    </div>
  </div>

  <!-- Copyright Section -->
  <div class="container text-small mt-md text-center">
    <p>&copy; {new Date().getFullYear()} Your Company. All rights reserved.</p>
  </div>

  <!-- Contact Modal Component -->
  <ContactModal open={isModalOpen} on:close={closeModal} />
</footer>

<style>
  .footer-container {
    background-color: var(--primary-color);
    color: var(--background-color);
    padding: var(--page-padding) var(--spacing-lg);
  }

  .container {
    max-width: 1200px;
    margin: 0 auto;
    display: flex;
    gap: var(--spacing-md);
  }

  .footer-links,
  .footer-social {
    align-self: flex-start;
    text-align: left;
  }

  .footer-links ul,
  .footer-social ul {
    list-style: none;
    padding: 0;
  }

  a {
    color: var(--background-color);
    text-decoration: none;
    transition: color 0.3s ease;
  }

  a:hover {
    color: var(--accent-color);
  }

  .footer-container .container:last-child {
    text-align: center;
    margin-top: var(--spacing-md);
  }
</style>

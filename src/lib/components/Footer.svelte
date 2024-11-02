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
  <div class="container flex flex-col md:flex-row justify-between items-start gap-md">
    <div class="footer-links-social flex flex-col md:flex-row gap-lg">
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

    <!-- Logo aligned to the right -->
    <div class="footer-logo">
      <img src="/Logo.svg" alt="Company Logo" class="logo-image" />
    </div>
  </div>

  <!-- Copyright Section -->
  <div class="footer-bottom text-small mt-md text-left px-page">
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
    max-width: 100%;
    display: flex;
    gap: var(--spacing-lg);
    justify-content: space-between; /* Align items to left and right */
  }

  .footer-links,
  .footer-social,
  .footer-bottom {
    text-align: left;
  }

  .footer-logo {
    display: flex;
    justify-content: flex-end; /* Aligns the logo to the right */
    align-items: center;
  }

  .logo-image {
    width: 160px; /* Adjust size as needed */
    height: auto;
    filter: invert(1) brightness(2); /* Changes the logo to white */
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

  .footer-bottom {
    text-align: left; /* Align text to the left */
    margin-top: var(--spacing-md);
    width: 100%; /* Ensure it takes full width */
  }
</style>

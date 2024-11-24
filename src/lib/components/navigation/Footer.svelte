<script>
  import ContactModal from '$lib/components/modal/ContactModal.svelte';

  const links = [
    { label: 'About Us', href: '/about' },
    { label: 'FAQ', href: '/faq' },
    { label: 'Privacy Policy', href: '/privacy-policy' },
    { label: 'Terms and Conditions', href: '/terms-and-conditions' },
    { label: 'Impressum', href: '/impressum' },
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

<footer class="footer-container bg-primary text-background px-page py-lg border-t border-secondary-bg">
  <div class="flex flex-col md:flex-row justify-between items-start gap-md">
    <div class="footer-links-social flex flex-col md:flex-row gap-lg">
      <!-- Quick Links Section -->
      <div class="footer-links flex-shrink-0 text-left">
        <h2 class="text-large font-heading font-bold mb-sm">Quick Links</h2>
        <ul class="space-y-xs">
          {#each links as { label, href }}
          <li>
            {#if label === 'Contact'}
              <!-- 'Contact' link: prevent default and open modal -->
              <a
                href={href}
                class="hover:text-accent transition-default"
                on:click|preventDefault={openModal}
              >
                {label}
              </a>
            {:else}
              <!-- Other links: no event handler, allow default navigation -->
              <a href={href} class="hover:text-accent transition-default">
                {label}
              </a>
            {/if}
          </li>
        {/each}
        </ul>
      </div>

      <!-- Social Media Links -->
      <div class="footer-social flex-shrink-0 text-left mt-md md:mt-0">
        <h2 class="text-large font-heading font-bold mb-sm">Connect with Us</h2>
        <ul class="space-y-xs">
          {#each socialLinks as { label, href }}
            <li>
              <a
              href={href}
              class="hover:text-accent transition-default"
              on:click|preventDefault={label === 'Contact' ? openModal : null}
            >
              {label}
            </a>
            </li>
          {/each}
        </ul>
      </div>
    </div>
  </div>

  <!-- Horizontal Divider -->
  <hr class="my-md border-secondary-bg">

  <!-- Bottom Section -->
  <div class="footer-bottom text-small mt-md text-center md:text-left">
    <p>&copy; {new Date().getFullYear()} Your Company. All rights reserved.</p>
  </div>

  <!-- Contact Modal Component -->
  <ContactModal open={isModalOpen} on:close={closeModal} />
</footer>

<style>
  .footer-container {
    background-color: var(--primary-color);
    color: var(--background-color);
  }

  .container {
    max-width: 100%;
    display: flex;
    gap: var(--spacing-lg);
    justify-content: space-between;
  }

  .footer-links, .footer-social, .footer-bottom {
    text-align: left;
  }

  .footer-links ul, .footer-social ul {
    list-style: none;
    padding: 0;
  }

  h2 {
    margin-bottom: var(--spacing-xs);
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
    margin-top: var(--spacing-md);
    width: 100%;
  }

  hr {
    border-color: var(--secondary-bg-color);
  }

  /* Extra styling for spacing and alignment on mobile */
  @media (max-width: 767px) {
    .footer-links-social {
      gap: var(--spacing-md);
    }

    .footer-bottom {
      text-align: center;
    }
  }
</style>

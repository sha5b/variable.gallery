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

<footer class="footer-container">
  <div class="footer-content">
    <div class="footer-links-social">
      <!-- Quick Links Section -->
      <div class="footer-links">
        <h2>Quick Links</h2>
        <ul class="space-y-xs">
          {#each links as { label, href }}
          <li>
            {#if label === 'Contact'}
              <!-- 'Contact' link: prevent default and open modal -->
              <a
                href={href}
                on:click|preventDefault={openModal}
              >
                {label}
              </a>
            {:else}
              <!-- Other links: no event handler, allow default navigation -->
              <a href={href}>
                {label}
              </a>
            {/if}
          </li>
        {/each}
        </ul>
      </div>

      <!-- Social Media Links -->
      <div class="footer-social">
        <h2>Connect with Us</h2>
        <ul class="space-y-xs">
          {#each socialLinks as { label, href }}
            <li>
              <a
              href={href}
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
  <hr>

  <!-- Bottom Section -->
  <div class="footer-bottom">
    <p>&copy; {new Date().getFullYear()} Your Company. All rights reserved.</p>
  </div>

  <!-- Contact Modal Component -->
  <ContactModal open={isModalOpen} on:close={closeModal} />
</footer>

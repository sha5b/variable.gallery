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
    padding: var(--page-padding);
    text-align: center;
  }

  .container {
    display: flex;
    flex-direction: column;
    gap: var(--spacing-md);
    padding: 0;
  }

  /* Adjust layout for desktop screens */
  @media (min-width: 768px) {
    .footer-container {
      padding: var(--page-padding-md);
    }

    .container {
      flex-direction: row;
      text-align: left;
    }

    .footer-links,
    .footer-social {
      width: 50%;
    }

    .footer-social {
      margin-left: auto;
    }
  }

  /* Additional style for footer items */
  .footer-links ul,
  .footer-social ul {
    padding: 0;
    list-style: none;
  }

  .footer-links h2,
  .footer-social h2 {
    font-size: var(--font-size-large);
    font-weight: bold;
    margin-bottom: var(--spacing-sm);
  }

  .footer-links li,
  .footer-social li {
    margin-bottom: var(--spacing-xs);
  }

  .footer-links a,
  .footer-social a {
    color: var(--background-color);
    transition: color 0.3s;
  }

  .footer-links a:hover,
  .footer-social a:hover {
    color: var(--accent-color);
  }

  /* Center-align copyright text */
  .footer-container .container:last-child {
    text-align: center;
    margin-top: var(--spacing-md);
  }
</style>

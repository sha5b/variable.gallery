<!-- TermsAndConditions.svelte -->
<script>
    // No additional script needed unless you have interactive elements
  </script>
  
  <div class="terms-page px-page text-text-color">
    <h1 class="text-xlarge font-heading margin-md text-primary-color text-left">
      Terms and Conditions
    </h1>
  
    <div class="terms-content">
      <div class="terms-section">
        <h2 class="text-large font-heading text-primary-color margin-md">
          Use of Website
        </h2>
        <p class="text-base margin-sm">
          All content on our website, including images and text, is owned by us or our artists. You may not use our content without permission.
        </p>
      </div>
  
      <div class="terms-section">
        <h2 class="text-large font-heading text-primary-color margin-md">
          Sales Policy
        </h2>
        <p class="text-base margin-sm">
          All sales are final. Due to the digital and custom nature of our products, we do not offer refunds or returns. If you have any issues with your purchase, please contact our support team.
        </p>
      </div>
  
      <div class="terms-section">
        <h2 class="text-large font-heading text-primary-color margin-md">
          Changes to Terms
        </h2>
        <p class="text-base margin-sm">
          We may update these terms from time to time. Any changes will be posted on this page. Please check back periodically for updates.
        </p>
      </div>
  
      <div class="terms-section">
        <h2 class="text-large font-heading text-primary-color margin-md">
          Contact
        </h2>
        <p class="text-base margin-sm">
          If you have questions about these terms, reach out to us at <a href="mailto:support@yourgallery.com">support@yourgallery.com</a>.
        </p>
      </div>
    </div>
  </div>
  
  <style>
    /* Use your existing global CSS styles from app.css */
  
    /* Terms and Conditions Page Styles */
    .terms-page {
      max-width: 100%;
      margin: 0 auto;
      padding-top: var(--spacing-lg);
      padding-bottom: var(--spacing-lg);
    }
  
    .terms-page h1 {
      margin-bottom: var(--spacing-lg);
    }
  
    .terms-content {
      display: flex;
      flex-wrap: wrap;
      gap: var(--spacing-lg);
    }
  
    .terms-section {
      flex: 1 1 calc(50% - var(--spacing-lg));
      box-sizing: border-box;
    }
  
    /* Adjust margin for odd items to align properly */
    .terms-section:nth-child(odd) {
      margin-right: var(--spacing-lg);
    }
  
    /* Remove margin-right for even items */
    .terms-section:nth-child(even) {
      margin-right: 0;
    }
  
    /* Responsive Adjustments */
    @media (max-width: 767px) {
      .terms-content {
        flex-direction: column;
      }
      .terms-section {
        flex: 1 1 100%;
        margin-right: 0;
      }
    }
  
    .terms-section h2 {
      margin-top: 0;
    }
  
    .terms-section p {
      margin-top: var(--spacing-sm);
    }
  
    /* Link styling */
    .terms-page a {
      color: var(--accent-color);
      text-decoration: none;
    }
  
    .terms-page a:hover {
      text-decoration: underline;
    }
  </style>
  
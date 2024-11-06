<!-- PrivacyPolicy.svelte -->
<script>
    // No additional script needed unless you have interactive elements
  </script>
  
  <div class="policy-page px-page text-text-color">
    <h1 class="text-xlarge font-heading margin-md text-primary-color text-left">
      Privacy Policy
    </h1>
  
    <div class="policy-content">
      <div class="policy-section">
        <h2 class="text-large font-heading text-primary-color margin-md">
          Introduction
        </h2>
        <p class="text-base margin-sm">
          We value your privacy and are committed to protecting your personal information. This Privacy Policy explains what information we collect and how we use it.
        </p>
      </div>
  
      <div class="policy-section">
        <h2 class="text-large font-heading text-primary-color margin-md">
          Information We Collect
        </h2>
        <p class="text-base margin-sm">
          We may collect personal information when you register, make a purchase, or interact with our site, including your name, email, and payment information.
        </p>
      </div>
  
      <div class="policy-section">
        <h2 class="text-large font-heading text-primary-color margin-md">
          How We Use Your Information
        </h2>
        <p class="text-base margin-sm">
          Your information helps us to process orders, provide customer support, and improve our services. We will never share your personal information without your consent, except as required by law.
        </p>
      </div>
  
      <div class="policy-section">
        <h2 class="text-large font-heading text-primary-color margin-md">
          Data Security
        </h2>
        <p class="text-base margin-sm">
          We implement a variety of security measures to maintain the safety of your personal information when you place an order or enter, submit, or access your personal information.
        </p>
      </div>
  
      <div class="policy-section">
        <h2 class="text-large font-heading text-primary-color margin-md">
          Cookies and Tracking Technologies
        </h2>
        <p class="text-base margin-sm">
          We use cookies and similar tracking technologies to enhance your experience, analyze site performance, and deliver personalized content.
        </p>
      </div>
  
      <div class="policy-section">
        <h2 class="text-large font-heading text-primary-color margin-md">
          Third-Party Services
        </h2>
        <p class="text-base margin-sm">
          We may employ third-party companies and individuals to facilitate our services. These third parties have access to your personal information only to perform these tasks on our behalf.
        </p>
      </div>
  
      <div class="policy-section">
        <h2 class="text-large font-heading text-primary-color margin-md">
          Your Rights
        </h2>
        <p class="text-base margin-sm">
          You have the right to access, correct, or delete your personal information held by us. Please contact us to exercise these rights.
        </p>
      </div>
  
      <div class="policy-section">
        <h2 class="text-large font-heading text-primary-color margin-md">
          Changes to This Policy
        </h2>
        <p class="text-base margin-sm">
          We may update our Privacy Policy from time to time. Any changes will be posted on this page with an updated revision date.
        </p>
      </div>
  
      <div class="policy-section">
        <h2 class="text-large font-heading text-primary-color margin-md">
          Contact Us
        </h2>
        <p class="text-base margin-sm">
          If you have any questions about our Privacy Policy, please contact us at <a href="mailto:support@yourgallery.com">support@yourgallery.com</a>.
        </p>
      </div>
    </div>
  </div>
  
  <style>
    /* Use your existing global CSS styles from app.css */
  
    /* Privacy Policy Page Styles */
    .policy-page {
      max-width: 100%;
      margin: 0 auto;
      padding-top: var(--spacing-lg);
      padding-bottom: var(--spacing-lg);
    }
  
    .policy-page h1 {
      margin-bottom: var(--spacing-lg);
    }
  
    .policy-content {
      display: flex;
      flex-wrap: wrap;
      gap: var(--spacing-lg);
    }
  
    .policy-section {
      flex: 1 1 calc(50% - var(--spacing-lg));
      box-sizing: border-box;
    }
  
    /* Adjust margin for odd items to align properly */
    .policy-section:nth-child(odd) {
      margin-right: var(--spacing-lg);
    }
  
    /* Remove margin-right for even items */
    .policy-section:nth-child(even) {
      margin-right: 0;
    }
  
    /* Responsive Adjustments */
    @media (max-width: 767px) {
      .policy-content {
        flex-direction: column;
      }
      .policy-section {
        flex: 1 1 100%;
        margin-right: 0;
      }
    }
  
    .policy-section h2 {
      margin-top: 0;
    }
  
    .policy-section p {
      margin-top: var(--spacing-sm);
    }
  
    /* Link styling */
    .policy-page a {
      color: var(--accent-color);
      text-decoration: none;
    }
  
    .policy-page a:hover {
      text-decoration: underline;
    }
  </style>
  
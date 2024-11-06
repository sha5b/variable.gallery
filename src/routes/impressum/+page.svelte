<!-- Impressum.svelte -->
<script>
    // No additional script needed unless you have interactive elements
  </script>
  
  <div class="impressum-page px-page text-text-color">
    <h1 class="text-xlarge font-heading margin-md text-primary-color text-left">
      Impressum
    </h1>
    
    <div class="impressum-content">
      <div class="impressum-section">
        <h2 class="text-large font-heading text-primary-color margin-md">
          Gallery Name
        </h2>
        <p class="text-base margin-sm">variable.gallerie</p>
      </div>
  
      <div class="impressum-section">
        <h2 class="text-large font-heading text-primary-color margin-md">
          Address
        </h2>
        <p class="text-base margin-sm">
          The gallery is on a satellite orbiting the moon.<br>
          "Gallerie für provisorische Kunst und diverse Ausstellungen."
        </p>
      </div>
  
      <div class="impressum-section">
        <h2 class="text-large font-heading text-primary-color margin-md">
          Contact
        </h2>
        <p class="text-base margin-sm">
          Email: <a href="mailto:support@variable.gallery">support@variable.gallery</a>
        </p>
      </div>
    </div>
  </div>
  
  <style>
    /* Use your existing global CSS styles from app.css */
  
    /* Impressum Page Styles */
    .impressum-page {
      max-width: 100%;
      margin: 0 auto;
      padding-top: var(--spacing-lg);
      padding-bottom: var(--spacing-lg);
    }
  
    .impressum-content {
      display: flex;
      flex-wrap: wrap;
      gap: var(--spacing-lg);
    }
  
    .impressum-section {
      flex: 1 1 calc(50% - var(--spacing-lg));
      box-sizing: border-box;
    }
  
    /* Adjust margin for odd items to align properly */
    .impressum-section:nth-child(odd) {
      margin-right: var(--spacing-lg);
    }
  
    /* Remove margin-right for even items */
    .impressum-section:nth-child(even) {
      margin-right: 0;
    }
  
    /* Responsive Adjustments */
    @media (max-width: 767px) {
      .impressum-content {
        flex-direction: column;
      }
      .impressum-section {
        flex: 1 1 100%;
        margin-right: 0;
      }
    }
  
    .impressum-section h2 {
      margin-top: 0;
    }
  
    .impressum-section p {
      margin-top: var(--spacing-sm);
    }
  
    /* Link styling */
    .impressum-page a {
      color: var(--accent-color);
      text-decoration: none;
    }
  
    .impressum-page a:hover {
      text-decoration: underline;
    }
  </style>
  
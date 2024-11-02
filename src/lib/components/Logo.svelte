<script>
    export let altText = "Company Logo";
  </script>
  
  <div class="logo-container">
    <img src="/Logo.svg" alt={altText} class="logo-image" />
  </div>
  
  <style>
    .logo-container {
      display: flex;
      align-items: center;
      justify-content: flex-start; /* Aligns logo to the left */
      width: 100vw;
      height: 100vh;
      padding-left: 2rem; /* Adds some padding from the left edge */
    }
  
    .logo-image {
      max-width: 60%; /* Makes the logo larger */
      max-height: 60%;
      height: auto;
      width: auto;
    }
  </style>
  
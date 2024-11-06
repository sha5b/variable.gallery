<!-- FAQPage.svelte -->
<script>
    import { slide } from 'svelte/transition';
  
    let faqs = [
      {
        question: "What types of artworks can I buy?",
        answer:
          "You can buy original artworks, editions, and download digital goods.",
        isOpen: false,
      },
      {
        question: "Is shipping included for original works?",
        answer:
          "Shipping is excluded for original works; this will be arranged with the artist after the purchase is conducted.",
        isOpen: false,
      },
      {
        question: "What is this gallery about?",
        answer:
          "It is a solely digital gallery for exploring and distributing new concepts of exhibiting in the digital world, connecting artists together, and also providing the backend structure for sales.",
        isOpen: false,
      },
      {
        question: "Who is behind this gallery?",
        answer:
          "A community of young artists and creatives is behind this, founded by Shahab Nedaei.",
        isOpen: false,
      },
      // Add more FAQs as needed
    ];
  
    function toggleFAQ(index) {
      faqs = faqs.map((faq, i) => ({
        ...faq,
        isOpen: i === index ? !faq.isOpen : faq.isOpen,
      }));
    }
  </script>
  
  <div class="faq-page px-page text-text-color">
    <h1 class="text-xlarge font-heading margin-md text-primary-color">
      Frequently Asked Questions
    </h1>
    <div class="faq-container">
      <!-- Left Column -->
      <div class="faq-list">
        {#each faqs as { question, answer, isOpen }, index}
          <div class="faq-item bg-secondary-bg rounded padding-md">
            <button
              class="faq-question flex-between align-center text-left"
              on:click={() => toggleFAQ(index)}
              aria-expanded={isOpen}
              aria-controls={`faq-answer-${index}`}
              id={`faq-question-${index}`}
            >
              <h2 class="text-large font-heading margin-none">{question}</h2>
              <span class="text-large">{isOpen ? '−' : '+'}</span>
            </button>
            {#if isOpen}
              <p
                class="text-base margin-sm"
                id={`faq-answer-${index}`}
                aria-labelledby={`faq-question-${index}`}
                transition:slide
              >
                {answer}
              </p>
            {/if}
          </div>
        {/each}
      </div>
      <!-- Right Column (Placeholder) -->
      <div class="faq-placeholder">
        <!-- Placeholder content -->
        <p>This is a placeholder for additional content.</p>
      </div>
    </div>
  </div>
  
  <style>
    /* Use your existing global CSS styles from app.css */
  
    /* FAQ Page Styles */
    .faq-page {
      max-width: 100%;
      margin: 0 auto;
      padding-top: var(--spacing-lg);
      padding-bottom: var(--spacing-lg);
    }
  
    .faq-container {
      display: flex;
      flex-direction: column;
      gap: var(--spacing-md);
    }
  
    @media (min-width: 768px) {
      .faq-container {
        flex-direction: row;
        gap: var(--spacing-lg);
      }
      .faq-list,
      .faq-placeholder {
        flex: 1;
      }
    }
  
    .faq-list {
      display: flex;
      flex-direction: column;
      gap: var(--spacing-md);
    }
  
    .faq-item {
      width: 100%;
      transition: background-color 0.3s ease, box-shadow 0.3s ease;
    }
  
    .faq-item:hover {
      background-color: var(--secondary-color);
      box-shadow: 0 4px 6px rgba(0, 0, 0, 0.1);
    }
  
    .faq-item:hover h2,
    .faq-item:hover p,
    .faq-item:hover span {
      color: var(--background-color);
    }
  
    /* Button Styles for FAQ Questions */
    .faq-question {
      width: 100%;
      background: none;
      border: none;
      padding: 0;
      cursor: pointer;
      display: flex;
      justify-content: space-between;
      align-items: center;
      text-align: left;
    }
  
    .faq-question h2 {
      flex: 1;
      margin-right: var(--spacing-sm);
      text-align: left;
    }
  
    .faq-question span {
      flex-shrink: 0;
    }
  
    .faq-question:focus {
      outline: 2px solid var(--accent-color);
    }
  
    .faq-item p {
      margin-top: var(--spacing-sm);
    }
  
    /* Placeholder Styles */
    .faq-placeholder {
      background-color: var(--secondary-bg-color);
      padding: var(--spacing-md);
      border-radius: var(--spacing-sm);
      display: flex;
      justify-content: center;
      align-items: center;
      /* Additional styling */
      text-align: center;
      color: var(--text-color);
      font-size: var(--font-size-large);
    }
  
    /* Responsive Adjustments */
    @media (max-width: 767px) {
      .faq-container {
        flex-direction: column;
      }
      .faq-placeholder {
        display: none; /* Hide placeholder on small screens */
      }
      .faq-question h2 {
        font-size: var(--font-size-large);
      }
      .faq-question span {
        font-size: var(--font-size-large);
      }
    }
  </style>
  
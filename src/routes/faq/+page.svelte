<!-- FAQPage.svelte -->
<script>
    import { defaultSEO, generateMetaTags } from '$lib/utils/seo';
    import LegalInfoDropdown from '$lib/components/base/LegalInfoDropdown.svelte';
  
    // Create FAQ-specific SEO
    const pageSEO = {
        ...defaultSEO,
        title: 'FAQ | variable.gallery',
        description: 'Find answers to common questions about our digital art gallery, NFTs, shipping, authenticity certificates, and payment options.',
        keywords: [
            ...defaultSEO.keywords,
            'FAQ',
            'frequently asked questions',
            'digital art help',
            'NFT questions',
            'art shipping',
            'payment options',
            'authenticity certificates'
        ],
        openGraph: {
            ...defaultSEO.openGraph,
            title: 'FAQ | variable.gallery',
            description: 'Find answers to common questions about our digital art gallery, NFTs, shipping, authenticity certificates, and payment options.',
            url: 'https://variable.gallery/faq'
        }
    };

    $: metaTags = generateMetaTags(pageSEO);

    let faqs = [
        {
            question: "What types of artworks can I purchase?",
            answer: "Our lunar gallery offers a diverse range of digital and physical art forms: digital originals, limited editions, AI-generated works, quantum-encrypted NFTs, holographic installations, 3D-printed sculptures, time-dilated exhibitions, and space-synchronized installations. All pieces are transmitted directly from our lunar orbital station.",
            isOpen: false
        },
        {
            question: "How does the artist revenue sharing work?",
            answer: "Our innovative revenue model allocates funds as follows: 75% goes directly to the artist, 10% enters our Universal Artist Pool (distributed monthly among all participating artists based on engagement metrics), and 15% supports our lunar infrastructure maintenance, quantum transmission networks, and platform development.",
            isOpen: false
        },
        {
            question: "How are artists selected for the gallery?",
            answer: "Artists are selected through a combination of our AI curator algorithm and human panel review. We look for creators who push the boundaries of digital-physical art fusion and space-time manipulation. Applications are reviewed quarterly during the lunar perigee.",
            isOpen: false
        },
        {
            question: "How does shipping work for physical pieces?",
            answer: "Physical artworks (prints, 3D sculptures) are manufactured at our Earth-based facilities using quantum-transmitted specifications. Shipping costs vary by location and are calculated at checkout. Original works are arranged directly with the artist after purchase confirmation.",
            isOpen: false
        },
        {
            question: "What about digital delivery?",
            answer: "Digital works are transmitted instantly through our quantum-encrypted channels. NFTs are minted on our lunar blockchain, and holographic installations require our proprietary viewer (provided free with purchase).",
            isOpen: false
        }
    ];

    let technicalFaqs = [
        {
            question: "Do you offer authenticity certificates?",
            answer: "All works come with a quantum-encrypted certificate of authenticity, timestamped using lunar orbital parameters. NFTs are verified through our proprietary space-time blockchain.",
            isOpen: false
        },
        {
            question: "What happens if there's a transmission error?",
            answer: "Our quantum entanglement network ensures 99.99% transmission accuracy. In rare cases of solar interference, our backup systems will automatically retransmit within one lunar cycle.",
            isOpen: false
        },
        {
            question: "Can I resell my purchased artworks?",
            answer: "Yes, our lunar marketplace supports secondary sales. Digital works include smart contracts that ensure artist royalties (5%) on all future transactions. Physical pieces can be resold with original quantum certificates.",
            isOpen: false
        },
        {
            question: "How do you handle returns?",
            answer: "Digital works are non-refundable once transmitted. Physical pieces can be returned within one lunar cycle (27.3 Earth days) if they don't match their quantum signature specifications.",
            isOpen: false
        },
        {
            question: "Do you offer payment plans?",
            answer: "Yes, we offer lunar-cycle payment plans (27.3 days) for purchases over 1,000€. We accept major Earth currencies, cryptocurrencies, and space mining credits.",
            isOpen: false
        }
    ];
</script>

<svelte:head>
    <title>{pageSEO.title}</title>
    {#each metaTags as tag}
        {#if tag.name}
            <meta name={tag.name} content={tag.content}>
        {:else if tag.property}
            <meta property={tag.property} content={tag.content}>
        {/if}
    {/each}
    <!-- Add FAQ structured data -->
    <script type="application/ld+json">
        {
            "@context": "https://schema.org",
            "@type": "FAQPage",
            "mainEntity": [
                ...faqs,
                ...technicalFaqs
            ].map(faq => ({
                "@type": "Question",
                "name": faq.question,
                "acceptedAnswer": {
                    "@type": "Answer",
                    "text": faq.answer
                }
            }))
        }
    </script>
</svelte:head>

<div class="about-container w-full px-page md:px-page-md pt-[var(--spacing-xl)]">
    <div class="flex flex-col md:flex-row gap-lg items-start">
        <!-- Left Column -->
        <div class="w-full md:w-1/2 space-y-md">
            <section class="space-y-sm">
                <h1 class="text-xlarge font-bold text-[var(--text-color)]">Frequently Asked Questions</h1>
                <p class="text-base text-[var(--text-color)]">
                    Find answers to common questions about our lunar art gallery, digital exhibitions, and space-time curated collections.
                </p>
            </section>

            <!-- General Questions -->
            {#each faqs as faq}
                <LegalInfoDropdown 
                    title={faq.question} 
                    content={`<p class="text-base margin-sm">${faq.answer}</p>`} 
                />
            {/each}
        </div>

        <!-- Right Column -->
        <div class="w-full md:w-1/2 space-y-md">
            <section class="space-y-sm">
                <h2 class="text-large font-semibold text-[var(--text-color)]">Technical & Payment</h2>
                <p class="text-base text-[var(--text-color)]">
                    Information about our quantum transmission systems, payment options, and space-time adjusted services.
                </p>
            </section>

            <!-- Technical Questions -->
            {#each technicalFaqs as faq}
                <LegalInfoDropdown 
                    title={faq.question} 
                    content={`<p class="text-base margin-sm">${faq.answer}</p>`} 
                />
            {/each}
        </div>
    </div>
</div>

<style>
    .about-container {
        padding-top: var(--spacing-xl);
        padding-bottom: var(--spacing-xl);
        line-height: 1.75;
    }
</style>
  
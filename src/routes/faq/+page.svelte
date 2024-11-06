<script>
    let faqs = [
        { question: "What types of artwork do you sell?", answer: "We offer NFTs, downloadables, keys, videos, prints, original artworks (oil, acrylics, etc.), and 3D prints." },
        { question: "How does the procedural exhibition work?", answer: "Our exhibitions are held in a procedurally generated world that we curate specially for each show. Each exhibit offers a unique experience." },
        { question: "Can I purchase artwork from the exhibitions?", answer: "Yes, all exhibited artworks are available for purchase. Simply click on an artwork during the exhibition to learn more." },
        { question: "Do you accept returns?", answer: "Due to the digital and custom nature of our products, all sales are final." },
        { question: "How do I access purchased downloads?", answer: "After purchase, you'll receive an email with a link to download your files or access keys." },
    ];
</script>

<div class="faq-page px-page text-text-color">
    <h1 class="text-xlarge font-heading margin-md">Frequently Asked Questions</h1>
    <ul class="space-y-md">
        {#each faqs as { question, answer }}
            <li>
                <h2 class="text-large font-heading text-primary-color">{question}</h2>
                <p class="text-base margin-sm">{answer}</p>
            </li>
        {/each}
    </ul>
</div>

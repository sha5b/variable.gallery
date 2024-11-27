<!-- TermsAndConditions.svelte -->
<script>
    import { defaultSEO, generateMetaTags } from '$lib/utils/seo';

    let companyInfo = {
        name: "variable.gallerie",
        email: "space@variable.gallery",
        location: "Lunar Orbit Station V.G-23"
    };

    // Create page-specific SEO by extending defaultSEO
    const pageSEO = {
        ...defaultSEO,
        title: 'Terms and Conditions | variable.gallery',
        description: 'Terms and conditions for variable.gallery digital art platform. Learn about our policies, user agreements, and operational guidelines.',
        keywords: [
            ...defaultSEO.keywords,
            'terms of service',
            'user agreement',
            'legal terms',
            'digital art terms',
            'gallery policies'
        ],
        openGraph: {
            ...defaultSEO.openGraph,
            title: 'Terms and Conditions | variable.gallery',
            description: 'Terms and conditions for variable.gallery digital art platform. Learn about our policies, user agreements, and operational guidelines.',
            url: 'https://variable.gallery/terms-and-conditions'
        }
    };

    $: metaTags = generateMetaTags(pageSEO);
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
</svelte:head>

<div class="about-container w-full px-page md:px-page-md pt-[var(--spacing-xl)]">
    <div class="flex flex-col md:flex-row gap-lg items-start">
        <!-- Left Column -->
        <div class="w-full md:w-1/2 space-y-md">
            <section class="space-y-sm">
                <h1 class="text-xlarge font-bold text-[var(--text-color)]">Terms and Conditions</h1>
                <p class="text-base text-[var(--text-color)]">
                    Operating from lunar orbit requires unique terms that account for both terrestrial and extra-terrestrial considerations.
                </p>
            </section>

            <section class="space-y-sm">
                <h2 class="text-large font-semibold text-[var(--text-color)]">Orbital Platform Usage</h2>
                <p class="text-base text-[var(--text-color)]">
                    All content transmitted through our quantum networks is protected by space-time copyright laws. Users agree to:
                </p>
                <ul class="list-disc pl-4 mt-2 text-[var(--text-color)]">
                    <li>Respect relativistic transmission protocols</li>
                    <li>Maintain quantum encryption standards</li>
                    <li>Acknowledge lunar phase scheduling</li>
                    <li>Accept space-time dilation effects</li>
                </ul>
            </section>

            <section class="space-y-sm">
                <h2 class="text-large font-semibold text-[var(--text-color)]">Transaction Policies</h2>
                <p class="text-base text-[var(--text-color)]">
                    Our quantum-secured marketplace operates under:
                </p>
                <ul class="list-disc pl-4 mt-2 text-[var(--text-color)]">
                    <li>Lunar blockchain verification</li>
                    <li>Time-dilated payment processing</li>
                    <li>Multi-planetary escrow systems</li>
                    <li>Space-synchronized delivery protocols</li>
                </ul>
            </section>
        </div>

        <!-- Right Column -->
        <div class="w-full md:w-1/2 space-y-md">
            <section class="space-y-sm">
                <h2 class="text-large font-semibold text-[var(--text-color)]">Liability Limitations</h2>
                <p class="text-base text-[var(--text-color)]">
                    We account for various space-time anomalies:
                </p>
                <ul class="list-disc pl-4 mt-2 text-[var(--text-color)]">
                    <li>Solar radiation interference</li>
                    <li>Gravitational time dilation</li>
                    <li>Quantum entanglement disruptions</li>
                    <li>Lunar orbit perturbations</li>
                </ul>
            </section>

            <section class="space-y-sm">
                <h2 class="text-large font-semibold text-[var(--text-color)]">Terms Updates</h2>
                <p class="text-base text-[var(--text-color)]">
                    Terms are updated according to lunar cycles. Changes are transmitted via quantum channels and archived in our lunar blockchain.
                </p>
            </section>

            <section class="space-y-sm">
                <h2 class="text-large font-semibold text-[var(--text-color)]">Contact</h2>
                <p class="text-base text-[var(--text-color)]">
                    For inquiries about our terms:
                </p>
                <p class="text-base text-[var(--text-color)]">
                    <a href={`mailto:${companyInfo.email}`} class="text-accent hover:underline">{companyInfo.email}</a><br>
                    {companyInfo.location}
                </p>
            </section>
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
  
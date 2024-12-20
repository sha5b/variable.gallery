<script>
    /**
     * @typedef {Object} CompanyInfo
     * @property {string} name
     * @property {string} email
     * @property {string} location
     * @property {string} established
     * @property {string} founder
     */

    /**
     * @typedef {Object} MetaTag
     * @property {string} [name]
     * @property {string} [property]
     * @property {string} content
     */
    import { defaultSEO, generateMetaTags } from '$lib/utils/seo';

    let companyInfo = {
        name: "variable.gallerie",
        email: "space@variable.gallery",
        location: "Lunar Orbit Station V.G-23",
        established: "2024",
        founder: "Shahab Nedaei"
    };

    // Create impressum-specific SEO
    const pageSEO = {
        ...defaultSEO,
        title: 'Impressum | variable.gallery',
        description: 'Legal information and company details for variable.gallery, a digital art platform specializing in NFTs and experimental media.',
        keywords: [
            ...defaultSEO.keywords,
            'impressum',
            'legal information',
            'company details',
            'digital art legal',
            'NFT legal'
        ],
        openGraph: {
            ...defaultSEO.openGraph,
            title: 'Impressum | variable.gallery',
            description: 'Legal information and company details for variable.gallery, a digital art platform specializing in NFTs and experimental media.',
            url: 'https://variable.gallery/impressum'
        }
    };

    /** @type {MetaTag[]} */
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

<div class="page-container">
    <div class="content-section flex flex-col md:flex-row gap-lg items-start">
        <!-- Left Column -->
        <div class="w-full md:w-1/2 space-y-md">
            <section class="space-y-sm">
                <h1 class="h1">Impressum</h1>
                <p>
                    Legal information for {companyInfo.name}, a virtual art gallery specializing in digital art, NFTs, and experimental media formats.
                </p>
            </section>

            <section class="space-y-sm">
                <h2 class="section-title">Gallery Information</h2>
                <ul class="list-disc pl-4 mt-2">
                    <li>Founder & Director: {companyInfo.founder}</li>
                    <li>Established: {companyInfo.established}</li>
                    <li>Registration: Digital Commerce Registry Berlin</li>
                    <li>VAT ID: DE123456789</li>
                    <li>Commercial Register: HRB 123456 B</li>
                </ul>
            </section>

            <section class="space-y-sm">
                <h2 class="section-title">Legal Entity</h2>
                <p>variable.gallerie GmbH</p>
                <ul class="list-disc pl-4 mt-2">
                    <li>Represented by: {companyInfo.founder}</li>
                    <li>Registered Office: Berlin, Germany</li>
                    <li>Digital Operations: Global</li>
                </ul>
            </section>
        </div>

        <!-- Right Column -->
        <div class="w-full md:w-1/2 space-y-md">
            <section class="space-y-sm">
                <h2 class="section-title">Contact Information</h2>
                <p>
                    For inquiries about digital art acquisitions, artist submissions, and technical support:
                </p>
                <ul class="list-disc pl-4 mt-2">
                    <li>General Inquiries: <a href="mailto:{companyInfo.email}" class="text-accent hover:underline">{companyInfo.email}</a></li>
                    <li>Artist Relations: <a href="mailto:space@variable.gallery" class="text-accent hover:underline">artists@variable.gallery</a></li>
                    <li>Technical Support: <a href="mailto:space@variable.gallery" class="text-accent hover:underline">space@variable.gallery</a></li>
                </ul>
            </section>

            <section class="space-y-sm">
                <h2 class="section-title">Responsible for Content</h2>
                <p>
                    According to § 55 Abs. 2 RStV:
                </p>
                <p class="text-base text-[var(--text-color)]">
                    {companyInfo.founder}<br>
                    variable.gallerie GmbH<br>
                    Berlin, Germany
                </p>
            </section>

            <section class="space-y-sm">
                <h2 class="section-title">Platform Features</h2>
                <ul class="list-disc pl-4 mt-2">
                    <li>Digital Art Sales & Distribution</li>
                    <li>NFT Minting & Trading</li>
                    <li>Virtual Exhibitions</li>
                    <li>Print-on-Demand Services</li>
                    <li>3D Printing Coordination</li>
                </ul>
            </section>
        </div>
    </div>
</div>

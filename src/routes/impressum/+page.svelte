<!-- Impressum.svelte -->
<script>
    let companyInfo = {
        name: "variable.gallerie",
        email: "support@variable.gallery",
        location: "Lunar Orbit Station V.G-23",
        established: "2024",
        founder: "Shahab Nedaei"
    };
</script>

<div class="about-container w-full px-page md:px-page-md pt-[var(--spacing-xl)]">
    <div class="flex flex-col md:flex-row gap-lg items-start">
        <!-- Left Column -->
        <div class="w-full md:w-1/2 space-y-md">
            <section class="space-y-sm">
                <h1 class="text-xlarge font-bold text-[var(--text-color)]">Impressum</h1>
                <p class="text-base text-[var(--text-color)]">
                    Legal information for {companyInfo.name}, a virtual art gallery specializing in digital art, NFTs, and experimental media formats.
                </p>
            </section>

            <section class="space-y-sm">
                <h2 class="text-large font-semibold text-[var(--text-color)]">Gallery Information</h2>
                <ul class="list-disc pl-4 mt-2 text-[var(--text-color)]">
                    <li>Founder & Director: {companyInfo.founder}</li>
                    <li>Established: {companyInfo.established}</li>
                    <li>Registration: Digital Commerce Registry Berlin</li>
                    <li>VAT ID: DE123456789</li>
                    <li>Commercial Register: HRB 123456 B</li>
                </ul>
            </section>

            <section class="space-y-sm">
                <h2 class="text-large font-semibold text-[var(--text-color)]">Legal Entity</h2>
                <p class="text-base text-[var(--text-color)]">variable.gallerie GmbH</p>
                <ul class="list-disc pl-4 mt-2 text-[var(--text-color)]">
                    <li>Represented by: {companyInfo.founder}</li>
                    <li>Registered Office: Berlin, Germany</li>
                    <li>Digital Operations: Global</li>
                </ul>
            </section>
        </div>

        <!-- Right Column -->
        <div class="w-full md:w-1/2 space-y-md">
            <section class="space-y-sm">
                <h2 class="text-large font-semibold text-[var(--text-color)]">Contact Information</h2>
                <p class="text-base text-[var(--text-color)]">
                    For inquiries about digital art acquisitions, artist submissions, and technical support:
                </p>
                <ul class="list-disc pl-4 mt-2 text-[var(--text-color)]">
                    <li>General Inquiries: <a href="mailto:{companyInfo.email}" class="text-accent hover:underline">{companyInfo.email}</a></li>
                    <li>Artist Relations: <a href="mailto:artists@variable.gallery" class="text-accent hover:underline">artists@variable.gallery</a></li>
                    <li>Technical Support: <a href="mailto:support@variable.gallery" class="text-accent hover:underline">support@variable.gallery</a></li>
                </ul>
            </section>

            <section class="space-y-sm">
                <h2 class="text-large font-semibold text-[var(--text-color)]">Responsible for Content</h2>
                <p class="text-base text-[var(--text-color)]">
                    According to § 55 Abs. 2 RStV:
                </p>
                <p class="text-base text-[var(--text-color)]">
                    {companyInfo.founder}<br>
                    variable.gallerie GmbH<br>
                    Berlin, Germany
                </p>
            </section>

            <section class="space-y-sm">
                <h2 class="text-large font-semibold text-[var(--text-color)]">Platform Features</h2>
                <ul class="list-disc pl-4 mt-2 text-[var(--text-color)]">
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

<style>
    .about-container {
        padding-top: var(--spacing-xl);
        padding-bottom: var(--spacing-xl);
        line-height: 1.75;
    }
</style>
  
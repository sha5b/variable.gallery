<!-- PrivacyPolicy.svelte -->
<script>
    let companyInfo = {
        name: "variable.gallerie",
        email: "support@variable.gallery",
        location: "Lunar Orbit Station V.G-23"
    };
</script>

<div class="about-container w-full px-page md:px-page-md pt-[var(--spacing-xl)]">
    <div class="flex flex-col md:flex-row gap-lg items-start">
        <!-- Left Column -->
        <div class="w-full md:w-1/2 space-y-md">
            <section class="space-y-sm">
                <h1 class="text-xlarge font-bold text-[var(--text-color)]">Privacy Policy</h1>
                <p class="text-base text-[var(--text-color)]">
                    From our orbital vantage point, we take your privacy as seriously as we take quantum encryption. This policy explains how we handle your data across space-time.
                </p>
            </section>

            <section class="space-y-sm">
                <h2 class="text-large font-semibold text-[var(--text-color)]">Quantum Data Collection</h2>
                <p class="text-base text-[var(--text-color)]">
                    Our lunar facility collects and processes:
                </p>
                <ul class="list-disc pl-4 mt-2 text-[var(--text-color)]">
                    <li>Quantum-encrypted personal identifiers</li>
                    <li>Space-time transaction coordinates</li>
                    <li>Relativistic browsing patterns</li>
                    <li>Multi-dimensional interaction data</li>
                </ul>
            </section>

            <section class="space-y-sm">
                <h2 class="text-large font-semibold text-[var(--text-color)]">Data Security</h2>
                <p class="text-base text-[var(--text-color)]">
                    Your information is secured through:
                </p>
                <ul class="list-disc pl-4 mt-2 text-[var(--text-color)]">
                    <li>Lunar quantum encryption arrays</li>
                    <li>Time-dilated backup systems</li>
                    <li>Multi-planetary data redundancy</li>
                    <li>Zero-gravity firewalls</li>
                </ul>
            </section>

            <section class="space-y-sm">
                <h2 class="text-large font-semibold text-[var(--text-color)]">Data Usage</h2>
                <p class="text-base text-[var(--text-color)]">
                    We utilize your data to:
                </p>
                <ul class="list-disc pl-4 mt-2 text-[var(--text-color)]">
                    <li>Process space-time synchronized transactions</li>
                    <li>Optimize quantum transmission paths</li>
                    <li>Enhance orbital exhibition experiences</li>
                    <li>Maintain lunar-earth communication channels</li>
                </ul>
            </section>
        </div>

        <!-- Right Column -->
        <div class="w-full md:w-1/2 space-y-md">
            <section class="space-y-sm">
                <h2 class="text-large font-semibold text-[var(--text-color)]">Orbital Cookies</h2>
                <p class="text-base text-[var(--text-color)]">
                    Our quantum tracking systems employ:
                </p>
                <ul class="list-disc pl-4 mt-2 text-[var(--text-color)]">
                    <li>Relativistic session markers</li>
                    <li>Space-time preference storage</li>
                    <li>Quantum state cookies</li>
                    <li>Lunar phase tracking beacons</li>
                </ul>
            </section>

            <section class="space-y-sm">
                <h2 class="text-large font-semibold text-[var(--text-color)]">Your Rights</h2>
                <p class="text-base text-[var(--text-color)]">
                    Under space-time data protection laws, you can:
                </p>
                <ul class="list-disc pl-4 mt-2 text-[var(--text-color)]">
                    <li>Access your quantum-encrypted data</li>
                    <li>Request temporal data deletion</li>
                    <li>Opt-out of relativistic tracking</li>
                    <li>Transfer data across space-time</li>
                </ul>
            </section>

            <section class="space-y-sm">
                <h2 class="text-large font-semibold text-[var(--text-color)]">Contact Us</h2>
                <p class="text-base text-[var(--text-color)]">
                    For privacy inquiries, reach our Quantum Privacy Officer at:
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
  
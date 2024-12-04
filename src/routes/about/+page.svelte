<!-- About.svelte -->
<script>
	import LegalInfoDropdown from '$lib/components/base/LegalInfoDropdown.svelte';
	import { defaultSEO, generateMetaTags } from '$lib/utils/seo';
  
	let companyInfo = {
		name: "variable.gallery",
		email: "space@variable.gallery",
		location: "Lunar Orbit Station V.G-23",
		established: "2024",
		founder: "Shahab Nedaei"
	};

	// SEO Configuration
	const pageSEO = {
		...defaultSEO,
		title: 'Reimagining Art Distribution | variable.gallery',
		description: 'A revolutionary digital art platform operating from lunar orbit, transforming art distribution through technology, innovation, and experimental economic models.',
		keywords: [
			...defaultSEO.keywords,
			'digital art gallery',
			'lunar orbit art platform',
			'blockchain art',
			'innovative art distribution',
			'experimental art technology'
		],
		openGraph: {
			...defaultSEO.openGraph,
			title: 'About | variable.gallery',
			description: 'A revolutionary digital art platform operating from lunar orbit, transforming art distribution through technology, innovation, and experimental economic models.',
			url: 'https://variable.gallery/about'
		}
	};

	$: metaTags = generateMetaTags(pageSEO);
  
	// Detailed Content Sections
	const distributionModelContent = `
		<h3 class="text-large font-semibold">Art Distribution Ecosystem</h3>
		<p>Our innovative approach to art distribution:</p>
		<ul class="list-disc pl-4 mt-2">
			<li><strong>Digital Formats</strong>
				<ul class="pl-4">
					<li>NFTs</li>
					<li>Downloadable licenses</li>
					<li>Digital video works</li>
					<li>Image licenses</li>
					<li>3D model files</li>
				</ul>
			</li>
			<li><strong>Physical Reproduction</strong>
				<ul class="pl-4">
					<li>Localized dropshipping</li>
					<li>Global print service collaborations</li>
					<li>Artist-specific production networks</li>
					<li>Adaptive production strategies</li>
				</ul>
			</li>
			<li>Transparent, blockchain-verified transactions</li>
			<li>Flexible, artist-centric distribution model</li>
		</ul>
	`;
  
	const economicModelContent = `
		<h3 class="text-large font-semibold">Economic Structure</h3>
		<p>Our unique revenue model prioritizes artist sustainability:</p>
		<ul class="list-disc pl-4 mt-2">
			<li><strong>25% Total Commission Breakdown</strong>
				<ul class="pl-4">
					<li>10%: Artist Redistribution Fund
						<ul class="pl-4">
							<li>Micro-grants for emerging artists</li>
							<li>Community support initiatives</li>
						</ul>
					</li>
					<li>15%: Infrastructure & Operational Development
						<ul class="pl-4">
							<li>Technological upgrades</li>
							<li>Platform maintenance</li>
							<li>Experimental feature development</li>
						</ul>
					</li>
				</ul>
			</li>
			<li>Direct artist-platform-customer ecosystem</li>
			<li>Transparent financial mechanisms</li>
		</ul>
	`;
  
	const philosophyContent = `
		<h3 class="text-large font-semibold">Experimental Approach</h3>
		<p>Our core philosophical principles:</p>
		<ul class="list-disc pl-4 mt-2">
			<li>Perpetual technological evolution</li>
			<li>Decentralized creative ecosystems</li>
			<li>Art without traditional boundaries</li>
			<li>Risk-taking as a fundamental value</li>
			<li>Dynamic, adaptive platform architecture</li>
			<li>Continuous experimental state</li>
		</ul>
	`;

	const transactionProtocolContent = `
		<h3 class="text-large font-semibold">Transaction & Delivery Protocol</h3>
		<p>Our unique approach to artwork transactions:</p>
		<ul class="list-disc pl-4 mt-2">
			<li>Full fund processing required before artwork delivery</li>
			<li>Shipping costs calculated per artwork uniqueness</li>
			<li>Direct artist-customer coordination for original pieces</li>
			<li>Flexible delivery mechanisms</li>
			<li>Transparent communication throughout process</li>
		</ul>
	`;
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
		<div class="w-full md:w-1/2 space-y-md">
			<section class="space-y-sm">
				<h1 class="text-xlarge font-bold text-[var(--text-color)]">About {companyInfo.name}</h1>
				<p class="text-base text-[var(--text-color)]">
					A revolutionary digital art platform operating from lunar orbit, transforming how art is created, experienced, and distributed through cutting-edge technology and innovative economic models.
				</p>
			</section>

			<LegalInfoDropdown title="Distribution Model" content={distributionModelContent} />
			<LegalInfoDropdown title="Economic Structure" content={economicModelContent} />
			<LegalInfoDropdown title="Our Philosophy" content={philosophyContent} />
			<LegalInfoDropdown title="Transaction Protocol" content={transactionProtocolContent} />
		</div>

		<div class="w-full md:w-1/2 space-y-md">
			<section class="space-y-sm">
				<h2 class="text-large font-semibold text-[var(--text-color)]">Orbital Platform</h2>
				<p class="text-base text-[var(--text-color)]">
					Hosted on a satellite orbiting the moon, our platform symbolizes artistic liberation from terrestrial constraints, creating unprecedented digital art experiences beyond traditional boundaries.
				</p>
			</section>

			<section class="space-y-sm">
				<h2 class="text-large font-semibold text-[var(--text-color)]">Contact Information</h2>
				<div class="space-y-xs text-base text-[var(--text-color)]">
					<p><strong>Location:</strong> {companyInfo.location}</p>
					<p><strong>Email:</strong> <a href={`mailto:${companyInfo.email}`} class="text-accent hover:underline">{companyInfo.email}</a></p>
					<p><strong>Established:</strong> {companyInfo.established}</p>
					<p><strong>Founder:</strong> {companyInfo.founder}</p>
				</div>
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
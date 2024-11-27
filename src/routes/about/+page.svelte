<!-- About.svelte -->
<script>
	import LegalInfoDropdown from '$lib/components/base/LegalInfoDropdown.svelte';
	import { defaultSEO, generateMetaTags } from '$lib/utils/seo';
  
	let companyInfo = {
		name: "variable.gallerie",
		email: "support@variable.gallery",
		location: "Lunar Orbit Station V.G-23",
		established: "2024"
	};

	// Create about-specific SEO
	const pageSEO = {
		...defaultSEO,
		title: 'About | variable.gallery',
		description: 'Learn about variable.gallery, humanity\'s first orbital art gallery. Discover our mission, technical infrastructure, and unique approach to digital art curation.',
		keywords: [
			...defaultSEO.keywords,
			'about variable gallery',
			'orbital art gallery',
			'digital art curation',
			'lunar art platform',
			'art technology',
			'space art gallery'
		],
		openGraph: {
			...defaultSEO.openGraph,
			title: 'About | variable.gallery',
			description: 'Learn about variable.gallery, humanity\'s first orbital art gallery. Discover our mission, technical infrastructure, and unique approach to digital art curation.',
			url: 'https://variable.gallery/about'
		}
	};

	$: metaTags = generateMetaTags(pageSEO);
  
	// Create separate sections for different content
	let sectionsOpen = {
		history: false,
		technical: false,
		mission: false
	};
  
	const legalInfoContent = `
		<h3 class="text-large font-semibold">Lunar Jurisdiction</h3>
		<p>Operating from lunar orbit places us in a unique legal framework. Our operations are governed by:</p>
		<ul class="list-disc pl-4 mt-2">
			<li>The Outer Space Treaty of 1967</li>
			<li>International Space Station Commercial Code</li>
			<li>Lunar Commerce Regulations of 2023</li>
			<li>Digital Art Space Rights Convention</li>
		</ul>

		<h3 class="text-large font-semibold mt-4">Privacy in Space</h3>
		<p>Your data is protected by quantum encryption and stored in our lunar facility. All transmissions are secured through:</p>
		<ul class="list-disc pl-4 mt-2">
			<li>Quantum-encrypted channels</li>
			<li>Relativistic time-stamping</li>
			<li>Multi-planetary backup systems</li>
		</ul>

		<h3 class="text-large font-semibold mt-4">Digital Rights Management</h3>
		<p>All artworks are protected under both terrestrial and extra-terrestrial copyright laws. Our lunar blockchain ensures:</p>
		<ul class="list-disc pl-4 mt-2">
			<li>Immutable ownership records</li>
			<li>Space-time verified transactions</li>
			<li>Quantum-resistant security</li>
		</ul>

		<h3 class="text-large font-semibold mt-4">Terms of Service</h3>
		<p>By using our orbital platform, you agree to our space-time adjusted terms. All exhibitions and transactions are subject to:</p>
		<ul class="list-disc pl-4 mt-2">
			<li>Relativistic time dilation effects</li>
			<li>Lunar phase scheduling</li>
			<li>Orbital trajectory adjustments</li>
			<li>Space weather conditions</li>
		</ul>
	`;
  
	const technicalContent = `
		<h3 class="text-large font-semibold">Orbital Infrastructure</h3>
		<p>Our lunar-orbiting facility represents the pinnacle of art curation technology. Operating from Lunar Orbit Station V.G-23, we utilize:</p>
		<ul class="list-disc pl-4 mt-2">
			<li>Quantum-encrypted storage arrays powered by lunar solar panels</li>
			<li>Zero-latency transmission systems utilizing quantum entanglement</li>
			<li>AI curators running on lunar-based quantum computers</li>
			<li>Holographic projection capabilities for Earth-based viewing</li>
			<li>Gravitational time dilation for unique temporal exhibitions</li>
			<li>Space-time fabric manipulation for 4D art installations</li>
		</ul>

		<h3 class="text-large font-semibold mt-4">Exhibition Technology</h3>
		<p>Our virtual exhibitions leverage the unique properties of lunar orbit to create unprecedented artistic experiences:</p>
		<ul class="list-disc pl-4 mt-2">
			<li>Relativistic time-shifted viewing experiences</li>
			<li>Zero-gravity digital sculpture gardens</li>
			<li>Earth-rise synchronized installations</li>
			<li>Lunar phase-reactive exhibitions</li>
		</ul>
	`;
  
	const missionContent = `
		<h3 class="text-large font-semibold">Our Vision</h3>
		<p>From our vantage point 384,400 kilometers above Earth, we see art differently. Our mission encompasses:</p>
		<ul class="list-disc pl-4 mt-2">
			<li>Creating exhibitions that transcend terrestrial limitations</li>
			<li>Utilizing lunar orbit's unique properties for new art forms</li>
			<li>Bridging the gap between Earth-bound and space-based creativity</li>
			<li>Pioneering new forms of digital art curation</li>
			<li>Supporting artists in exploring space-time as a medium</li>
		</ul>

		<h3 class="text-large font-semibold mt-4">Future Initiatives</h3>
		<p>Our upcoming projects include:</p>
		<ul class="list-disc pl-4 mt-2">
			<li>Expansion to Mars orbit galleries</li>
			<li>Deep space art transmission networks</li>
			<li>Quantum-entangled exhibition spaces</li>
			<li>Solar wind-powered digital installations</li>
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
	<!-- Main Content -->
	<div class="flex flex-col md:flex-row gap-lg items-start">
		<!-- Left Column -->
		<div class="w-full md:w-1/2 space-y-md">
			<section class="space-y-sm">
				<h1 class="text-xlarge font-bold text-[var(--text-color)]">About {companyInfo.name}</h1>
				<p class="text-base text-[var(--text-color)]">
					Welcome to humanity's first orbital art gallery! Located on a satellite orbiting the moon, {companyInfo.name} represents a revolutionary approach to digital art curation and distribution. Founded by Shahab Nedaei, we operate at the intersection of art, technology, and space exploration.
				</p>
			</section>

			<!-- Technical Details -->
			<LegalInfoDropdown title="Technical Infrastructure" content={technicalContent} />

			<!-- Mission & Vision -->
			<LegalInfoDropdown title="Mission & Vision" content={missionContent} />

			<!-- Legal Information -->
			<LegalInfoDropdown title="Legal Information" content={legalInfoContent} />
		</div>

		<!-- Right Column -->
		<div class="w-full md:w-1/2 space-y-md">
			<section class="space-y-sm">
				<h2 class="text-large font-semibold text-[var(--text-color)]">Our Orbital Platform</h2>
				<p class="text-base text-[var(--text-color)]">
					Operating from Lunar Orbit Station V.G-23, our gallery leverages the unique perspective of space to create unprecedented digital art experiences. Our satellite serves as both a technological hub and a symbolic bridge between Earth-bound creativity and the infinite possibilities of space.
				</p>
			</section>

			<section class="space-y-sm">
				<h2 class="text-large font-semibold text-[var(--text-color)]">Contact Information</h2>
				<div class="space-y-xs text-base text-[var(--text-color)]">
					<p><strong>Location:</strong> {companyInfo.location}</p>
					<p><strong>Email:</strong> <a href={`mailto:${companyInfo.email}`} class="text-accent hover:underline">{companyInfo.email}</a></p>
					<p><strong>Established:</strong> {companyInfo.established}</p>
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
  
<script>
	import { slide } from 'svelte/transition';
	import Header from '$lib/components/Header.svelte';
	import { MetaTags } from 'svelte-meta-tags';

	let companyInfo = {
		name: 'variable.gallerie',
		email: 'support@variable.gallery'
	};

	let sections = {
		operations: false,
		prints: false,
		originals: false,
		digital: false,
		threeD: false,
		shipping: false,
		virtualWorlds: false,
		pandemic: false,
		newParadigm: false
	};

	function toggleSection(section) {
		sections[section] = !sections[section];
	}
</script>

<MetaTags
	title="About variable.gallerie - Digital Art Gallery & NFT Marketplace"
	description="Discover variable.gallerie, a pioneering digital art gallery connecting artists and collectors. Explore our curated collection of digital art, NFTs, prints, and 3D artworks."
	openGraph={{
		title: 'About variable.gallerie - Digital Art Gallery & NFT Marketplace',
		description:
			'A community-driven digital gallery exploring new concepts of exhibiting in the digital world. Connect with artists, collect unique pieces, and explore innovative digital art.',
		images: [{ url: '/images/og-about.jpg' }]
	}}
/>

<div class="about-page px-page">
	<Header />

	<div class="about-content  md:px-page-md">
		<div class="content-wrapper">
			<!-- Introduction Section -->
			<section class="about-section">
				<h1 class="text-xlarge font-heading text-primary-color mb-md font-bold">
					About {companyInfo.name}
				</h1>
				<p class="text-text-color text-base leading-relaxed">
					Welcome to {companyInfo.name}! We are a solely digital gallery exploring new concepts of
					exhibiting in the digital world, connecting artists together, and providing the backend
					structure for sales. A community of young artists and creatives is behind this, founded by
					Shahab Nedaei.
				</p>
			</section>

			<!-- Sections Grid -->
			<div class="sections-grid">
				<!-- Gallery Operations -->
				<div class="section-container">
					<button class="section-button" on:click={() => toggleSection('operations')}>
						<span class="section-title">Gallery Operations</span>
						<span class="section-toggle">{sections.operations ? '−' : '+'}</span>
					</button>

					{#if sections.operations}
						<div class="section-content" transition:slide>
							<ul class="pl-lg space-y-sm list-disc">
								<li>
									Artist suggestions are curated through our existing gallery artists, ensuring a
									high-quality, community-driven selection process that maintains our artistic
									standards
								</li>
								<li>
									The gallery operates on a transparent 75/25 split model, with artists receiving
									75% of all sales, promoting fair compensation in the digital art space
								</li>
								<li>
									Our secure payment processing system handles multiple currencies and crypto
									payments, with instant artist payouts and detailed transaction tracking
								</li>
								<li>
									Monthly virtual exhibitions feature guest curators from leading art institutions,
									providing fresh perspectives and professional curation
								</li>
								<li>
									Artists participate in our collaborative selection process, fostering a supportive
									community and ensuring diverse representation
								</li>
								<li>
									Regular artist workshops and networking events help build connections within the
									digital art community
								</li>
							</ul>
						</div>
					{/if}
				</div>

				<!-- Print Editions -->
				<div class="section-container">
					<button class="section-button" on:click={() => toggleSection('prints')}>
						<span class="section-title">Print Editions</span>
						<span class="section-toggle">{sections.prints ? '−' : '+'}</span>
					</button>

					{#if sections.prints}
						<div class="section-content" transition:slide>
							<ul class="pl-lg space-y-sm list-disc">
								<li>
									All prints are produced using archival-quality Hahnemühle paper and pigment-based
									inks, ensuring museum-grade quality and longevity
								</li>
								<li>
									Each piece includes a detailed certificate of authenticity with unique identifiers
									and blockchain verification
								</li>
								<li>
									Global shipping is included in the price, with careful packaging designed
									specifically for fine art transport
								</li>
								<li>
									Production and delivery timeline of 10-15 business days, with real-time tracking
									and insurance included
								</li>
								<li>
									Limited editions are hand-numbered and signed by the artist, with detailed
									documentation of the edition size
								</li>
								<li>
									Custom framing options available with acid-free matting and UV-protective glass
								</li>
							</ul>
						</div>
					{/if}
				</div>

				<!-- Original Artworks -->
				<div class="section-container">
					<button class="section-button" on:click={() => toggleSection('originals')}>
						<span class="section-title">Original Artworks</span>
						<span class="section-toggle">{sections.originals ? '−' : '+'}</span>
					</button>

					{#if sections.originals}
						<div class="section-content" transition:slide>
							<ul class="pl-lg space-y-sm list-disc">
								<li>Shipping arranged with artist</li>
								<li>Custom packaging for each piece</li>
								<li>Direct artist contact post-purchase</li>
								<li>Insurance included</li>
								<li>Authenticity guaranteed</li>
							</ul>
						</div>
					{/if}
				</div>

				<!-- Digital Art & NFTs -->
				<div class="section-container">
					<button class="section-button" on:click={() => toggleSection('digital')}>
						<span class="section-title">Digital Art & NFTs</span>
						<span class="section-toggle">{sections.digital ? '−' : '+'}</span>
					</button>

					{#if sections.digital}
						<div class="section-content" transition:slide>
							<ul class="pl-lg space-y-sm list-disc">
								<li>Instant downloads after purchase</li>
								<li>Blockchain verification for NFTs</li>
								<li>License keys for limited editions</li>
								<li>Clear usage rights specification</li>
								<li>Technical support available</li>
							</ul>
						</div>
					{/if}
				</div>

				<!-- 3D Artworks -->
				<div class="section-container">
					<button class="section-button" on:click={() => toggleSection('threeD')}>
						<span class="section-title">3D Artworks</span>
						<span class="section-toggle">{sections.threeD ? '−' : '+'}</span>
					</button>

					{#if sections.threeD}
						<div class="section-content" transition:slide>
							<ul class="pl-lg space-y-sm list-disc">
								<li>Standard 3D formats provided</li>
								<li>Preview renders included</li>
								<li>Production rights available</li>
								<li>Technical specifications included</li>
								<li>File compatibility support</li>
							</ul>
						</div>
					{/if}
				</div>

				<!-- Shipping & Returns -->
				<div class="section-container">
					<button class="section-button" on:click={() => toggleSection('shipping')}>
						<span class="section-title">Shipping & Returns</span>
						<span class="section-toggle">{sections.shipping ? '−' : '+'}</span>
					</button>

					{#if sections.shipping}
						<div class="section-content" transition:slide>
							<h3 class="mb-sm font-semibold">Shipping Policy</h3>
							<ul class="pl-lg space-y-sm mb-md list-disc">
								<li>Print Editions: Included in price, worldwide delivery</li>
								<li>Original Artworks: Arranged with artist after purchase</li>
								<li>Digital Works: Instant delivery</li>
								<li>All physical shipments are insured</li>
							</ul>

							<h3 class="mb-sm font-semibold">Returns & Refunds</h3>
							<ul class="pl-lg space-y-sm list-disc">
								<li>Digital items are non-refundable</li>
								<li>Print returns: 14 days if unopened</li>
								<li>Original artwork: Subject to artist agreement</li>
								<li>Return shipping: Buyer's responsibility</li>
							</ul>
						</div>
					{/if}
				</div>
			</div>

			<!-- After the Digital Evolution section and before Contact/Legal -->
			<section class="map-section my-xl">
				<div class="map-container">
					<div class="map-placeholder">
						<div class="map-overlay">
							<p class="text-base">Interactive Map Coming Soon</p>
							<span class="text-secondary text-sm">Explore our global artist community</span>
						</div>
					</div>
				</div>
			</section>

			<!-- Digital Evolution -->
			<section class="digital-evolution-section mt-xl">
				<h2 class="text-large font-heading text-primary-color mb-md font-semibold">
					The Evolution of Digital Art Spaces
				</h2>

				<div class="sections-grid">
					<!-- Virtual Worlds -->
					<div class="section-container">
						<button class="section-button" on:click={() => toggleSection('virtualWorlds')}>
							<span class="section-title">Virtual Worlds & Gaming</span>
							<span class="section-toggle">{sections.virtualWorlds ? '−' : '+'}</span>
						</button>

						{#if sections.virtualWorlds}
							<div class="section-content" transition:slide>
								<p class="mb-md">
									The concept of virtual art spaces emerged from early gaming environments, where
									players first experienced immersive digital worlds. Games like Second Life (2003)
									pioneered the idea of user-created virtual galleries, while platforms like
									Minecraft demonstrated how digital spaces could foster creativity and community.
								</p>
								<ul class="pl-lg space-y-sm list-disc">
									<li>Early virtual worlds established the foundation for digital social spaces</li>
									<li>Gaming platforms proved the viability of user-generated content</li>
									<li>3D environments showed new possibilities for artistic expression</li>
									<li>Community-driven spaces revealed the potential for digital curation</li>
								</ul>
							</div>
						{/if}
					</div>

					<!-- Pandemic Transformation -->
					<div class="section-container">
						<button class="section-button" on:click={() => toggleSection('pandemic')}>
							<span class="section-title">Digital Transformation</span>
							<span class="section-toggle">{sections.pandemic ? '−' : '+'}</span>
						</button>

						{#if sections.pandemic}
							<div class="section-content" transition:slide>
								<p class="mb-md">
									The global pandemic catalyzed a rapid shift toward digital art spaces. Traditional
									galleries rushed to create virtual exhibitions, often resulting in underwhelming
									3D reproductions of physical spaces that missed the true potential of digital
									mediums.
								</p>
								<ul class="pl-lg space-y-sm list-disc">
									<li>Virtual exhibitions became a necessity rather than an innovation</li>
									<li>Limited understanding led to direct translations of physical spaces</li>
									<li>Technical limitations exposed the need for new approaches</li>
									<li>Artists began questioning traditional exhibition formats</li>
								</ul>
							</div>
						{/if}
					</div>

					<!-- New Paradigm -->
					<div class="section-container">
						<button class="section-button" on:click={() => toggleSection('newParadigm')}>
							<span class="section-title">Rethinking Digital Space</span>
							<span class="section-toggle">{sections.newParadigm ? '−' : '+'}</span>
						</button>

						{#if sections.newParadigm}
							<div class="section-content" transition:slide>
								<p class="mb-md">
									Today, we're witnessing a fundamental shift in how we think about digital art
									spaces. Rather than mimicking physical galleries, we're exploring the unique
									possibilities of digital realms - spaces unconstrained by physical laws, time
									zones, or traditional viewing patterns.
								</p>
								<ul class="pl-lg space-y-sm list-disc">
									<li>Embracing non-linear navigation and dynamic curation</li>
									<li>Creating experiences that adapt to viewer interaction</li>
									<li>Utilizing data and algorithms for personalized exhibitions</li>
									<li>Building communities that transcend geographical boundaries</li>
									<li>Exploring new forms of artistic expression native to digital spaces</li>
								</ul>
							</div>
						{/if}
					</div>
				</div>
			</section>

			<!-- Contact -->
			<section class="contact-section">
				<h2 class="text-large font-heading text-primary-color mb-sm font-semibold">Contact</h2>
				<div class="space-y-xs">
					<p class="contact-info"><strong>Gallery:</strong> {companyInfo.name}</p>
					<p class="contact-info">
						<strong>Email:</strong>
						<a href={`mailto:${companyInfo.email}`}>{companyInfo.email}</a>
					</p>
				</div>
			</section>
		</div>
	</div>
</div>

<style>
	.about-page {
		max-width: 100%;
		margin: 0 auto;
		padding-top: var(--spacing-lg);
		padding-bottom: var(--spacing-lg);
	}

	.about-content {
		width: 100%;
	}

	.content-wrapper {
		max-width: 1920px;
		margin: 0 auto;
	}

	.sections-grid {
		display: flex;
		flex-wrap: wrap;
		gap: var(--spacing-lg);
		margin-top: var(--spacing-xl);
	}

	.section-container {
		flex: 1 1 calc(50% - var(--spacing-lg));
		min-width: 300px;
		border-top: 1px solid var(--border-color);
		padding-top: var(--spacing-md);
	}

	.section-button {
		width: 100%;
		display: flex;
		justify-content: space-between;
		align-items: center;
		padding: var(--spacing-md) 0;
		background: none;
		border: none;
		cursor: pointer;
		font-family: var(--font-heading);
		font-size: var(--font-size-large);
		font-weight: 600;
		color: var(--primary-color);
		transition: color 0.3s ease;
	}

	.section-button:hover {
		color: var(--accent-color);
	}

	.section-toggle {
		font-size: 1.5em;
		line-height: 1;
	}

	.section-content {
		padding: var(--spacing-md) 0;
		color: var(--text-color);
		line-height: 1.6;
	}

	.contact-section {
		border-top: 1px solid var(--border-color);
		padding-top: var(--spacing-xl);
	}

	.contact-info {
		color: var(--text-color);
	}

	a {
		color: var(--accent-color);
		text-decoration: none;
		transition: color 0.3s ease;
	}

	a:hover {
		text-decoration: underline;
	}

	@media (max-width: 767px) {
		.sections-grid {
			flex-direction: column;
		}

		.section-container {
			flex: 1 1 100%;
		}
	}

	.map-section {
		width: 100%;
		padding: var(--spacing-xl) 0;
		background-color: var(--background-color-secondary);
	}

	.map-container {
		width: 100%;
		max-width: 1920px;
		margin: 0 auto;
		padding: 0 var(--spacing-page);
	}

	.map-placeholder {
		width: 100%;
		height: 40vh;
		background-color: var(--background-color);
		border: 1px solid var(--border-color);
		position: relative;
		display: flex;
		align-items: center;
		justify-content: center;
		background-image: url("data:image/svg+xml,%3Csvg width='60' height='60' viewBox='0 0 60 60' xmlns='http://www.w3.org/2000/svg'%3E%3Cg fill='none' fill-rule='evenodd'%3E%3Cg fill='%239C92AC' fill-opacity='0.05'%3E%3Cpath d='M36 34v-4h-2v4h-4v2h4v4h2v-4h4v-2h-4zm0-30V0h-2v4h-4v2h4v4h2V6h4V4h-4zM6 34v-4H4v4H0v2h4v4h2v-4h4v-2H6zM6 4V0H4v4H0v2h4v4h2V6h4V4H6z'/%3E%3C/g%3E%3C/g%3E%3C/svg%3E");
	}

	.map-overlay {
		position: absolute;
		top: 50%;
		left: 50%;
		transform: translate(-50%, -50%);
		text-align: center;
		padding: var(--spacing-md);
		background-color: var(--background-color);
		border: 1px solid var(--border-color);
		border-radius: var(--rounded-md);
	}

	@media (max-width: 767px) {
		.map-placeholder {
			height: 30vh;
		}
	}
</style>

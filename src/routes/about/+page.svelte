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
		description: 'A revolutionary digital art platform operating from lunar orbit, redefining how art is experienced and distributed through technology, innovation, and experimental models.',
		keywords: [
			...defaultSEO.keywords,
			'digital art gallery',
			'lunar orbit art platform',
			'innovative art distribution',
			'experimental art technology',
			'art and space'
		],
		openGraph: {
			...defaultSEO.openGraph,
			title: 'About | variable.gallery',
			description: 'A revolutionary digital art platform operating from lunar orbit, redefining how art is experienced and distributed through technology, innovation, and experimental models.',
			url: 'https://variable.gallery/about'
		}
	};

	$: metaTags = generateMetaTags(pageSEO);

	// Content Sections
	const distributionModelContent = `
		<h3 class="text-large font-semibold">Art Distribution Ecosystem</h3>
		<p>Our platform redefines how art moves from creator to collector, offering a dual approach:</p>
		<ul class="list-disc pl-4 mt-2">
			<li><strong>Digital Formats:</strong> Enabling seamless global distribution:
				<ul class="pl-4">
					<li>High-resolution image licenses for commercial use</li>
					<li>3D printable files for sculptures and installations</li>
					<li>Immersive video works</li>
				</ul>
			</li>
			<li><strong>Physical Reproductions:</strong> Crafting tangible connections:
				<ul class="pl-4">
					<li>Collaborative print services for localized production</li>
					<li>Precision manufacturing for 3D-printed artworks</li>
					<li>Eco-friendly shipping strategies</li>
				</ul>
			</li>
			<li>Innovative models for commissioned works and custom art</li>
		</ul>
	`;

	const economicModelContent = `
		<h3 class="text-large font-semibold">Economic Structure</h3>
		<p>Our revenue-sharing system ensures both artistic freedom and sustainability:</p>
		<ul class="list-disc pl-4 mt-2">
			<li><strong>Transparent Revenue Allocation:</strong>
				<ul class="pl-4">
					<li>10% dedicated to the Artist Redistribution Fund</li>
					<li>15% reinvested into technological innovation</li>
				</ul>
			</li>
			<li>Direct customer-to-artist payment channels</li>
			<li>Zero hidden fees or opaque transaction costs</li>
			<li>Customizable pricing tools for artists</li>
		</ul>
	`;

	const philosophyContent = `
		<h3 class="text-large font-semibold">Experimental Approach</h3>
		<p>variable.gallery thrives on experimentation:</p>
		<ul class="list-disc pl-4 mt-2">
			<li>Breaking boundaries between physical and digital art</li>
			<li>Encouraging bold artistic risks</li>
			<li>Investing in research for sustainable art technology</li>
			<li>Fostering collaborations across disciplines</li>
		</ul>
	`;

	const transactionProtocolContent = `
		<h3 class="text-large font-semibold">Transaction & Delivery Protocol</h3>
		<p>We prioritize clarity and convenience in transactions:</p>
		<ul class="list-disc pl-4 mt-2">
			<li>Standardized pricing for print and 3D-printed reproductions</li>
			<li>Original artworks require custom shipment arrangements:
				<ul class="pl-4">
					<li>Costs calculated based on size, packaging, and insurance</li>
					<li>Flexible options for framing, crating, and delivery</li>
					<li>Direct artist-client coordination for one-of-a-kind pieces</li>
				</ul>
			</li>
			<li>End-to-end updates for shipment tracking</li>
		</ul>
	`;

	const modernArtDistributionContent = `
		<h2 class="text-large font-semibold">Exploring Modern Art Distribution Ecosystems: Bridging Digital and Physical Realms</h2>
		<p>The art world is undergoing a fascinating transformation, driven by technology, decentralization, and evolving business models. This shift is reshaping how art is created, distributed, and consumed, empowering artists and collectors to participate in an interconnected, sustainable ecosystem.</p>

		<h3>1. E-commerce and Print-on-Demand Platforms</h3>
		<p>E-commerce platforms like Shopify, Etsy, and TikTok Shop have become modern galleries for artists, enabling them to showcase and sell directly to global audiences without intermediaries. These platforms offer control over branding, customer interaction, and scalable sales opportunities. Meanwhile, print-on-demand services simplify production by handling printing, shipping, and logistics. Artists can experiment with designs without upfront costs, reducing financial risk and waste<sup>12</sup>, <sup>13</sup>.</p>
		<p><strong>Notable Example:</strong> Printful is a leading print-on-demand service that integrates seamlessly with e-commerce platforms, letting artists transform their work into sellable products, from T-shirts to custom canvases<sup>12</sup>.</p>

		<h3>2. Web3 and Decentralized Art Markets</h3>
		<p>The introduction of Web3 technologies, including blockchain and NFTs, has empowered artists to break away from traditional gatekeeping structures. Through decentralized communities, artists and collectors engage directly, often via peer-to-peer networks. Platforms like OpenSea and Artpoint help bridge digital and physical art, facilitating direct interaction and sales without middlemen<sup>13</sup>.</p>
		<p><strong>Legal Note:</strong> Artists using NFTs should understand intellectual property rights and ensure contracts are encoded into the blockchain to safeguard their work and royalties.</p>

		<h3>3. Sustainable Art Practices</h3>
		<p>Environmental consciousness is a growing priority. Print-on-demand and NFT marketplaces like Ethereum's Layer 2 solutions focus on minimizing ecological footprints. By producing art only when ordered, waste is significantly reduced, aligning with the values of modern consumers<sup>12</sup>, <sup>13</sup>.</p>

		<h3>4. The Role of Social Media</h3>
		<p>Social platforms like Instagram and TikTok are reshaping art discovery. Hashtags such as #ArtTok and #TikTokMadeMeBuyIt have transformed how collectors discover and purchase art, making social media integral to an artist’s strategy. Videos and live streams allow artists to demonstrate techniques and interact with fans, building loyal communities<sup>12</sup>.</p>

		<h3>5. Bridging Digital and Physical Formats</h3>
		<p>Canvas-on-demand models blend digital design with tangible art forms. Customers can order prints tailored to their specifications, while artists avoid the costs of inventory. This accessibility broadens the reach of both emerging and established artists<sup>12</sup>.</p>

		<h3>6. Ethical and Copyright Considerations</h3>
		<p>Artists must protect their intellectual property across digital platforms. Understanding copyright laws and implementing digital watermarks or blockchain-based ownership records are vital for safeguarding creations.</p>
		<p><strong>Resources:</strong></p>
		<ul class="list-disc pl-4">
			<li>The Creative Commons platform offers tools for artists to specify usage rights<sup>14</sup>.</li>
			<li>The Copyright Office provides guidance on registering works for additional protection<sup>15</sup>.</li>
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
					A visionary art platform stationed in lunar orbit, redefining the way art is distributed, experienced, and valued. Pioneering creative models and fostering artistic freedom, we empower creators and collectors alike.
				</p>
			</section>

			<LegalInfoDropdown title="Distribution Model" content={distributionModelContent} />
			<LegalInfoDropdown title="Economic Structure" content={economicModelContent} />
			<LegalInfoDropdown title="Our Philosophy" content={philosophyContent} />
			<LegalInfoDropdown title="Transaction Protocol" content={transactionProtocolContent} />
			<LegalInfoDropdown title="Modern Art Distribution Ecosystems" content={modernArtDistributionContent} />
		</div>

		<div class="w-full md:w-1/2 space-y-md">
			<section class="space-y-sm">
				<h2 class="text-large font-semibold text-[var(--text-color)]">Orbital Platform</h2>
				<p class="text-base text-[var(--text-color)]">
					Operating from a lunar satellite, our platform transcends earthly limitations, creating a bridge between the infinite possibilities of space and the timeless beauty of art.
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

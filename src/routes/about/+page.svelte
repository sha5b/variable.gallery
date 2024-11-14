<!-- About.svelte -->
<script>
	import LegalInfoDropdown from '$lib/components/base/LegalInfoDropdown.svelte';
  
	let companyInfo = {
	  name: "variable.gallerie",
	  email: "support@variable.gallery",
	};
  
	const legalInfoContent = `
	  <h3 class="text-large font-semibold">Privacy Policy</h3>
	  <p>Our Privacy Policy explains how we handle your data. We are committed to protecting your privacy and ensuring that your data is secure.</p>
  
	  <h3 class="text-large font-semibold mt-4">Terms of Service</h3>
	  <p>By using our website, you agree to follow our terms. Please read them carefully before accessing our services.</p>
  
	  <h3 class="text-large font-semibold mt-4">Refund Policy</h3>
	  <p>All sales are final. Due to the digital and custom nature of our products, we do not offer refunds or returns. If you have any issues with your purchase, please contact our support team.</p>
  
	  <h3 class="text-large font-semibold mt-4">Imprint</h3>
	  <p><strong>Company Name:</strong> ${companyInfo.name}</p>
	  <p><strong>Contact:</strong> ${companyInfo.email}</p>
	`;
  </script>
  
  <div class="about-container w-full px-page md:px-page-md pt-[var(--spacing-xl)]">
	<!-- Main Flex Container -->
	<div class="flex flex-col md:flex-row gap-lg items-start">
	  <!-- Left Column: Company Information and Legal Information -->
	  <div class="w-full md:w-1/2 space-y-md">
		<!-- Company Overview -->
		<section class="space-y-sm">
		  <h1 class="text-xlarge font-bold text-[var(--text-color)]">About {companyInfo.name}</h1>
		  <p class="text-base text-[var(--text-color)]">
			Welcome to {companyInfo.name}! We are a solely digital gallery for exploring and distributing new concepts of exhibiting in the digital world, connecting artists together, and providing the backend structure for sales. A community of young artists and creatives is behind this, founded by Shahab Nedaei.
		  </p>
		</section>
  
		<!-- Contact Information -->
		<section class="space-y-sm">
		  <h2 class="text-large font-semibold text-[var(--text-color)]">Contact Us</h2>
		  <div class="space-y-xs text-base text-[var(--text-color)]">
			<p><strong>Email:</strong> <a href={`mailto:${companyInfo.email}`} class="text-accent hover:underline">{companyInfo.email}</a></p>
		  </div>
		</section>
  
		<!-- Legal Information Dropdown -->
		<section class="space-y-sm">
		  <h2 class="text-large font-semibold text-[var(--text-color)]">Legal Information</h2>
		  <LegalInfoDropdown title="Legal Information" content={legalInfoContent} />
		</section>
	  </div>
  
	  <!-- Right Column: Our Vision and Founder -->
	  <div class="w-full md:w-1/2 space-y-md">
		<!-- Our Vision -->
		<section class="space-y-sm">
		  <h2 class="text-large font-semibold text-[var(--text-color)]">Our Vision</h2>
		  <p class="text-base text-[var(--text-color)]">
			At {companyInfo.name}, we aim to redefine the boundaries of art exhibitions by leveraging digital platforms. Our virtual gallery, located on a satellite orbiting the moon, provides a unique space for artists to showcase their work in innovative ways. We strive to connect artists and audiences from around the world, fostering a community of creativity and collaboration.
		  </p>
		</section>
  
		<!-- Meet the Founder -->
		<section class="space-y-sm">
		  <h2 class="text-large font-semibold text-[var(--text-color)]">Meet the Founder</h2>
		  <p class="text-base text-[var(--text-color)]">
			Shahab Nedaei, the visionary behind {companyInfo.name}, is dedicated to exploring new frontiers in the digital art world. With a passion for connecting artists and audiences, Shahab leads our community of young creatives in pushing the boundaries of traditional exhibitions.
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
  
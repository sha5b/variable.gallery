<script>
	import LegalInfoDropdown from '$lib/components/LegalInfoDropdown.svelte';

	let companyInfo = {
	  name: "Your Company Name",
	  address: "123 Main Street, City, Country",
	  phone: "+123 456 7890",
	  email: "info@yourcompany.com",
	  registrationNumber: "1234567890",
	  vatNumber: "VAT123456789"
	};

	const legalInfoContent = `
	  <h3 class="text-lg font-semibold">Privacy Policy</h3>
	  <p>This is our Privacy Policy, explaining how we handle your data. We are committed to protecting your privacy and ensuring that your data is secure.</p>

	  <h3 class="text-lg font-semibold mt-4">Terms of Service</h3>
	  <p>These are our Terms of Service. By using our website, you agree to follow these terms. Please read them carefully before accessing our services.</p>

	  <h3 class="text-lg font-semibold mt-4">Refund Policy</h3>
	  <p>This is our Refund Policy. We offer a full refund within 30 days if you are not satisfied with your purchase. Contact us for assistance with returns or refunds.</p>

	  <h3 class="text-lg font-semibold mt-4">Imprint</h3>
	  <p><strong>Company Name:</strong> ${companyInfo.name}</p>
	  <p><strong>Address:</strong> ${companyInfo.address}</p>
	  <p><strong>Contact:</strong> ${companyInfo.email}, ${companyInfo.phone}</p>
	  <p><strong>VAT Number:</strong> ${companyInfo.vatNumber}</p>
	`;

	const googleMapUrl = "https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d3151.835434509486!2d144.95373531531732!3d-37.81720997975154!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x6ad65d43f1f0d183%3A0x5045675218cee7e0!2sMelbourne%20VIC%2C%20Australia!5e0!3m2!1sen!2sus!4v1632945465837!5m2!1sen!2sus";
</script>

<div class="about-container w-full px-[var(--page-padding)] md:px-[var(--page-padding-md)] pt-[var(--spacing-xl)]">
	<!-- Main Flex Container to Arrange Items -->
	<div class="flex flex-col md:flex-row gap-[var(--spacing-lg)] items-start">
	  
	  <!-- Left Column: Company Information and Legal Information -->
	  <div class="w-full md:w-1/2 space-y-[var(--spacing-md)]">
		<!-- Company Overview -->
		<section class="space-y-[var(--spacing-sm)]">
		  <h1 class="text-[var(--font-size-xlarge)] font-bold text-[var(--text-color)]">About {companyInfo.name}</h1>
		  <p class="text-[var(--text-color)]">
			Welcome to {companyInfo.name}! We are dedicated to providing the best products and services for our customers.
			Our team works hard to meet your needs, and we are committed to offering exceptional support.
		  </p>
		</section>
	  
		<!-- Contact Information -->
		<section class="space-y-[var(--spacing-sm)]">
		  <h2 class="text-[var(--font-size-large)] font-semibold text-[var(--text-color)]">Contact Us</h2>
		  <div class="space-y-[var(--spacing-xs)] text-[var(--text-color)]">
			<p><strong>Address:</strong> {companyInfo.address}</p>
			<p><strong>Phone:</strong> {companyInfo.phone}</p>
			<p><strong>Email:</strong> <a href={`mailto:${companyInfo.email}`} class="text-[var(--accent-color)] hover:underline">{companyInfo.email}</a></p>
		  </div>
		</section>
	  
		<!-- Legal Information Dropdown -->
		<section class="space-y-[var(--spacing-sm)]">
		  <h2 class="text-[var(--font-size-large)] font-semibold text-[var(--text-color)]">Legal Information</h2>
		  <LegalInfoDropdown title="Legal Information" content={legalInfoContent} />
		</section>
	  </div>
  
	  <!-- Right Column: Map -->
	  <div class="w-full md:w-1/2">
		<section class="space-y-[var(--spacing-sm)]">
		  <h2 class="text-[var(--font-size-large)] font-semibold text-[var(--text-color)]">Our Location</h2>
		  <iframe
			src={googleMapUrl}
			width="100%"
			height="450"
			class="rounded-lg"
			allowfullscreen=""
			loading="lazy"
			style="border: none;"
		  ></iframe>
		</section>
	  </div>
  
	</div>
</div>

<style>
	.about-container {
		padding-top: 4rem;
		padding-bottom: 4rem;
		max-width: 100%; 
		line-height: 1.75;
	}
</style>

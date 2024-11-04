<div class="header-container flex h-full w-full flex-col items-start justify-end p-0">
	<h2 class="subheadline text-large md:text-xlarge m-0">gallerie fuer provisorische kunst und diverse austellungen.</h2>
	<h1 class="headline m-0 font-bold leading-none">variable.</h1>
</div>

<style>
	.header-container {
		height: 20vh;
		/* Background color, padding, etc., can be customized here if needed */
	}

	.subheadline {
		font-family: var(--font-primary);
		color: var(--text-color);
	}

	.headline {
		font-family: var(--font-heading);
		font-weight: 900;
		color: var(--primary-color);
		font-size: 6rem; /* Default for mobile */
	}

	@media (min-width: 768px) {
		.headline {
			font-size: 8rem;
		}
		.header-container {
			height: 20vh;
			/* Background color, padding, etc., can be customized here if needed */
		}
	}

	@media (min-width: 1024px) {
		.headline {
			font-size: 10rem;
		}
		.header-container {
			height: 30vh;
			/* Background color, padding, etc., can be customized here if needed */
		}
	}

	@media (min-width: 1280px) {
		.headline {
			font-size: 14rem;
		}
		.header-container {
			height: 30vh;
			/* Background color, padding, etc., can be customized here if needed */
		}
	}
</style>

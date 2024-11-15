<div class="header-container bg-background flex h-full w-full flex-col items-start justify-end">
	<h2 class="subheadline text-large md:text-xlarge m-0">gallerie fuer provisorische kunst und diverse austellungen.</h2>
	<h1 class="headline m-0">variable.</h1>
</div>

<style>
	/* Base container styling */
	.header-container {
		height: 30vh;
	}

	/* Typography */
	.subheadline {
		font-family: var(--font-primary);
		color: var(--text-color);
	}

	.headline {
		font-family: var(--font-heading);
		font-weight: 900;
		color: var(--primary-color);
		font-size: 6rem;
		line-height: 1;
	}

	/* Responsive adjustments */
	@media (min-width: 768px) {
		.headline {
			font-size: 8rem;
		}
	}

	@media (min-width: 1024px) {
		.headline {
			font-size: 10rem;
		}
		.header-container {
			height: 40vh;
		}
	}

	@media (min-width: 1280px) {
		.headline {
			font-size: 14rem;
		}
	}
</style>

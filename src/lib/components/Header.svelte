<div class="header-container bg-background flex w-full flex-col justify-end pt-32 md:pt-40 lg:pt-48">
	<div class="flex flex-col-reverse sm:flex-row gap-8 w-full">
		<div class="w-full sm:w-2/3 flex flex-col justify-end">
			<h2 class="subheadline m-0 max-w-[90%] md:max-w-[80%] mb-8">
				gallerie fuer provisorische kunst und diverse austellungen.
			</h2>
			<h1 class="headline m-0">variable.</h1>
		</div>
	</div>
</div>

<style>
	.header-container {
	}

	.subheadline {
		font-family: var(--font-primary);
		color: var(--text-color);
		font-size: 2rem;
		line-height: 2.25rem;
	}

	.headline {
		font-family: var(--font-heading);
		font-weight: 900;
		color: var(--primary-color);
		line-height: 0.85;
		width: 100%;
		font-size: clamp(4.5rem, 15vw, 20rem);
	}

	@media (min-width: 640px) {
		.subheadline {
			font-size: 2.5rem;
			line-height: 2.75rem;
		}
	}

	@media (min-width: 768px) {
		.subheadline {
			font-size: 3rem;
			line-height: 3.5rem;
		}
	}
</style>

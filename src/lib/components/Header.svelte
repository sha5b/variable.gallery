<script>
	export let minimal = false;
</script>

<div class="header-wrapper">
	<div class="header-container">
		<h2 class="subheadline">gallerie fuer provisorische kunst und diverse austellungen.</h2>
		<h1 class="headline font-heading">variable.</h1>
	</div>
</div>

<style>
	.header-wrapper {
		width: 100%;
		position: relative;
		min-height: 40vh;
		display: flex;
		align-items: flex-end;
		margin-bottom: var(--spacing-xl);
	}

	.header-container {
		width: 100%;
		padding: var(--spacing-lg) var(--spacing-page);
		display: flex;
		flex-direction: column;
		gap: var(--spacing-sm);
	}

	.subheadline {
		font-family: var(--font-primary);
		color: var(--text-color);
		font-size: var(--font-size-base);
		margin: 0;
	}

	.headline {
		color: var(--primary-color);
		font-size: clamp(4rem, 15vw, 14rem);
		line-height: 0.9;
		font-weight: 900;
		margin: 0;
		padding: 0;
	}

	@media (max-width: 767px) {
		.header-wrapper {
			min-height: 30vh;
		}
		
		.header-container {
			padding: var(--spacing-md) var(--spacing-page-sm);
		}
	}
</style>

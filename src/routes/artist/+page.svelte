<script>
	import ArtistSlider from '$lib/components/slider/ArtistSlider.svelte';
	export let data;

	let { artists, products } = data;

	console.log('Artists data:', artists);
	console.log('Products data:', products);
</script>

<div class="artist-page px-page space-y-lg">
	<div class="gap-lg grid md:grid-cols-2">
		{#each artists as artist}
			<section
				class="artist-section space-y-md bg-background p-md flex flex-col justify-between rounded-lg"
			>
				<div class="artist-info text-text-color space-y-sm">
					<h2 class="text-large font-heading text-text-color font-bold">{artist.title.rendered}</h2>
					<p>{artist.description}</p>
					<p>
						<a
							href={`/artist/${artist.slug}`}
							target="_blank"
							rel="noopener noreferrer"
							class="text-accent hover:underline">View Profile</a
						>
					</p>
				</div>
				<!-- Constrain 3D Sphere within a half-height container -->
				<div class="sphere-container-wrapper flex items-center justify-center overflow-hidden">
					<ArtistSlider {products} artistName={artist.title.rendered} />
				</div>
			</section>
		{/each}
	</div>
</div>

<style>
	.sphere-container-wrapper {
		height: 50vh;
	}
	.artist-page {
		height: 100%;
	}
</style>

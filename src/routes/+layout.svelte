<script>
	import '../app.css';
	import { navigating } from '$app/stores';
	import { fade } from 'svelte/transition';

	import Footer from '$lib/components/navigation/Footer.svelte';
	import Navbar from '$lib/components/navigation/Navbar.svelte';
	import CartSlider from '$lib/components/navigation/CartSlider.svelte';
	import Loading from '$lib/components/Loading.svelte';
	import { isCartSliderOpen, closeCartSlider } from '$lib/stores/cartStore';

	export let data;
	const { artists } = data;
	
	$: isOpen = $isCartSliderOpen;

	function closeCart() {
		closeCartSlider(); // Close the cart when clicking on the overlay
	}

	// Subscribe to navigation changes
	$: if ($navigating) {
		window.scrollTo({ top: 0, behavior: 'smooth' });
	}
</script>

<Loading isLoading={$navigating} />

<div class="site-wrapper">
	<Navbar {artists} />
	<main>
		<slot />
	</main>
	<Footer />
</div>

<CartSlider />

<style>
	.site-wrapper {
		width: 100%;
		max-width: 100vw;
		overflow-x: hidden;
		position: relative;
	}

	main {
		width: 100%;
		max-width: 100%;
		overflow-x: hidden;
	}
</style>

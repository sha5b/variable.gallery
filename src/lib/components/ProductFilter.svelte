<script>
	import { goto } from '$app/navigation';
	import { fly, fade } from 'svelte/transition';
	import { quintOut } from 'svelte/easing';
	import { getProductUrl, getProductImageUrl, handleImageLoad } from '$lib/utils/mediaUtils';
	import '$lib/styles/components/filter.css';

	/** @type {import('$lib/utils/types').Product[]} */
	export let products = [];
	/** @type {string|null} */
	let selectedTag = null;
	/** @type {string|null} */
	let selectedCategory = null;
	/** @type {string|null} */
	let selectedArtist = null;
	let minPrice = 0;
	let maxPrice = 1000;
	let currentPage = 1;
	let itemsPerPage = 12;
	let sortBy = 'newest';

	// Add this line - define the options array
	const itemsPerPageOptions = [12, 24, 48, 96];

	// Initialize price range from products
	const productPrices = products.map(product => parseFloat(product.price));
	const initialMinPrice = Math.min(...productPrices);
	const initialMaxPrice = Math.max(...productPrices);

	// Add this reactive declaration to track price changes
	$: priceChanged = minPrice !== initialMinPrice || maxPrice !== initialMaxPrice;

	// Set default price range based on products
	minPrice = initialMinPrice;
	maxPrice = initialMaxPrice;

	// Create lists of unique tags, categories, and artists
	let uniqueTags = [...new Set(products.flatMap(product => product.tags?.map(tag => tag.name)))];
	let uniqueCategories = [...new Set(products.flatMap(product => product.categories?.map(cat => cat.name)))];
	let uniqueArtists = [...new Set(
		products.flatMap(product => product.attributes
			.filter(attr => attr.name.toLowerCase() === 'artist')
			.flatMap(attr => attr.options)
		)
	)];

	// Filter and sort products
	$: filteredProducts = products.filter(product => {
		const matchesTag = !selectedTag || product.tags.some(tag => tag.name === selectedTag);
		const matchesCategory = !selectedCategory || product.categories.some(cat => cat.name === selectedCategory);
		const matchesArtist = !selectedArtist || product.attributes.some(attr => 
			attr.name.toLowerCase() === 'artist' && attr.options.includes(selectedArtist ?? '')
		);
		const matchesPrice = parseFloat(product.price) >= minPrice && parseFloat(product.price) <= maxPrice;

		return matchesTag && matchesCategory && matchesArtist && matchesPrice;
	}).sort((a, b) => {
		if (sortBy === 'newest') {
			return new Date(b.date_created).getTime() - new Date(a.date_created).getTime();
		}
		if (sortBy === 'price-low') return parseFloat(a.price) - parseFloat(b.price);
		if (sortBy === 'price-high') return parseFloat(b.price) - parseFloat(a.price);
		return 0;
	});

	// Pagination
	$: totalPages = Math.ceil(filteredProducts.length / itemsPerPage);
	$: paginatedProducts = filteredProducts.slice(
		(currentPage - 1) * itemsPerPage,
		currentPage * itemsPerPage
	);

	/**
	 * @param {string|null} tag
	 */
	function handleTagClick(tag) {
		selectedTag = selectedTag === tag ? null : tag;
		currentPage = 1;
	}

	/**
	 * @param {string|null} category
	 */
	function handleCategoryClick(category) {
		selectedCategory = selectedCategory === category ? null : category;
		currentPage = 1;
	}

	/**
	 * @param {string|null} artist
	 */
	function handleArtistClick(artist) {
		selectedArtist = selectedArtist === artist ? null : artist;
		currentPage = 1;
	}

	/**
	 * @param {Event} event
	 * @param {'min'|'max'} type
	 */
	function handlePriceChange(event, type) {
		const value = parseFloat(/** @type {HTMLInputElement} */ (event.target).value);
		if (type === 'min') {
			minPrice = Math.min(value, maxPrice);
		} else if (type === 'max') {
			maxPrice = Math.max(value, minPrice);
		}
		currentPage = 1;
	}

	/**
	 * @param {number} page
	 */
	function changePage(page) {
		if (page >= 1 && page <= totalPages) {
			currentPage = page;
		}
	}

	/**
	 * @param {import('$lib/utils/types').Product} product
	 */
	function navigateToProduct(product) {
		goto(getProductUrl(product.id));
	}
</script>

<div class="wrapper space-y-lg py-lg mb-[var(--spacing-xl)]">
	<div class="flex flex-col gap-lg">
		<!-- Filter Controls - Simplified -->
		<div class="filter-controls bg-background p-md rounded-lg">
			<div class="flex items-center justify-between">
				<!-- Active Filters -->
				<div class="tag-container flex-shrink-0">
					{#if selectedCategory}
						<span on:click={() => handleCategoryClick(selectedCategory)}>
							{selectedCategory} ×
						</span>
					{/if}
					{#if selectedTag}
						<span on:click={() => handleTagClick(selectedTag)}>
							{selectedTag} ×
						</span>
					{/if}
					{#if selectedArtist}
						<span on:click={() => handleArtistClick(selectedArtist)}>
							{selectedArtist} ×
						</span>
					{/if}
					{#if priceChanged}
						<span>
							€{minPrice} - €{maxPrice}
						</span>
					{/if}
				</div>

				<!-- Display Options -->
				<div class="flex items-center gap-md ml-auto">
					<select 
						id="sort-select"
						bind:value={sortBy}
						class="sort-select"
					>
						<option value="newest">Newest</option>
						<option value="price-low">Price: Low to High</option>
						<option value="price-high">Price: High to Low</option>
					</select>

					<select 
						id="items-select"
						bind:value={itemsPerPage}
						class="items-select"
						on:change={() => currentPage = 1}
					>
						{#each itemsPerPageOptions as option}
							<option value={option}>{option} per page</option>
						{/each}
					</select>
				</div>
			</div>
		</div>

		<div class="flex flex-col md:flex-row gap-lg">
			<!-- Sidebar Filters - More Compact -->
			<aside class="filter-sidebar w-full md:w-1/5 bg-background p-md rounded-lg">
				<div class="filter-container space-y-md">
					<!-- Category -->
					<details class="filter-section">
						<summary class="section-title cursor-pointer">Category</summary>
						<div class="pill-group mt-sm">
							{#each uniqueCategories as category}
								<button 
									on:click={() => handleCategoryClick(category)}
									class={selectedCategory === category ? 'pill-filled' : ''}
								>
									{category}
								</button>
							{/each}
						</div>
					</details>

					<!-- Tags -->
					<details class="filter-section">
						<summary class="section-title cursor-pointer">Tags</summary>
						<div class="pill-group mt-sm">
							{#each uniqueTags as tag}
								<button 
									on:click={() => handleTagClick(tag)}
									class={selectedTag === tag ? 'pill-filled' : ''}
								>
									{tag}
								</button>
							{/each}
						</div>
					</details>

					<!-- Artist -->
					<details class="filter-section">
						<summary class="section-title cursor-pointer">Artist</summary>
						<div class="pill-group mt-sm">
							{#each uniqueArtists as artist}
								<button 
									on:click={() => handleArtistClick(artist)}
									class={selectedArtist === artist ? 'pill-filled' : ''}
								>
									{artist}
								</button>
							{/each}
						</div>
					</details>

					<!-- Price Range -->
					<details class="filter-section">
						<summary class="section-title cursor-pointer">Price Range</summary>
						<div class="slider-container mt-sm space-y-sm">
							<div class="flex flex-col gap-xs">
								<input
									type="range"
									min={initialMinPrice}
									max={initialMaxPrice}
									bind:value={minPrice}
									on:input={(event) => handlePriceChange(event, 'min')}
									class="w-full"
								/>
								<span class="text-sm">Min: €{minPrice}</span>
							</div>
							<div class="flex flex-col gap-xs">
								<input
									type="range"
									min={initialMinPrice}
									max={initialMaxPrice}
									bind:value={maxPrice}
									on:input={(event) => handlePriceChange(event, 'max')}
									class="w-full"
								/>
								<span class="text-sm">Max: €{maxPrice}</span>
							</div>
						</div>
					</details>
				</div>
			</aside>

			<!-- Product Grid -->
			<div class="product-grid-container flex-1">
				<div class="product-grid">
					{#each paginatedProducts as product (product.id)}
						<div
							in:fly={{ y: 20, duration: 400, delay: 200, easing: quintOut }}
							out:fade={{ duration: 200 }}
							class="product-card"
							on:click={() => navigateToProduct(product)}
						>
							<div class="product-image-container">
								{#await handleImageLoad(getProductImageUrl(product)) then imageSrc}
									<img 
										src={imageSrc}
										alt={product.name} 
										class="product-image"
									/>
								{/await}
								<div class="product-overlay">
										<div class="tag-container">
											{#each product.tags as tag}
												<span>{tag.name}</span>
											{/each}
										</div>
										<div class="product-info">
											<h3 class="product-title">{product.name}</h3>
											<span class="tag">€{parseFloat(product.price).toFixed(2)}</span>
										</div>
								</div>
							</div>
						</div>
					{/each}
				</div>

				<!-- Pagination -->
				{#if totalPages > 1}
					<div class="pagination">
						<button 
							class="pagination-button" 
							disabled={currentPage === 1}
							on:click={() => changePage(currentPage - 1)}
						>
							Previous
						</button>
						
						{#each Array(totalPages) as _, i}
							<button 
								class="pagination-button ${currentPage === i + 1 ? 'active' : ''}"
								on:click={() => changePage(i + 1)}
							>
								{i + 1}
							</button>
						{/each}
						
						<button 
							class="pagination-button"
							disabled={currentPage === totalPages}
							on:click={() => changePage(currentPage + 1)}
						>
							Next
						</button>
					</div>
				{/if}
			</div>
		</div>
	</div>
</div>

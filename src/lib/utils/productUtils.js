/**
 * Organizes products by their categories
 * @param {import('./types').Product[]} products
 * @returns {Record<string, import('./types').Product[]>}
 */
export function organizeProductsByCategory(products) {
    /** @type {Record<string, import('./types').Product[]>} */
    const productsByCategory = Object.create(null);
    
    if (products) {
        products.forEach((product) => {
            product.categories.forEach((category) => {
                if (!productsByCategory[category.name]) {
                    productsByCategory[category.name] = [];
                }
                productsByCategory[category.name].push(product);
            });
        });
    }

    return productsByCategory;
}

/**
 * Gets a random product type and its latest product thumbnail
 * @param {import('./types').Product[]} products
 * @returns {{ randomType: string, thumbnail: string }}
 */
export function getRandomTypeAndThumbnail(products) {
    let randomType = '';
    let thumbnail = '';

    const uniqueTypes = [...new Set(products.map((product) => product.type || ''))];
    if (uniqueTypes.length > 0) {
        randomType = uniqueTypes[Math.floor(Math.random() * uniqueTypes.length)];
        const latestProductWithType = products.find((product) => product.type === randomType);
        thumbnail = latestProductWithType?.images[0]?.src || '';
    }

    return { randomType, thumbnail };
}

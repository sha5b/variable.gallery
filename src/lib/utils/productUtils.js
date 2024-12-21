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

import { fetchWooCommerceData } from '$lib/api';

export async function load() {
    try {
        // Fetch all products to have them available
        const products = await fetchWooCommerceData('products', {
            _fields: 'id,title,name'
        });
        return { products };
    } catch (error) {
        console.error('Error fetching products:', error);
        return { products: [] };
    }
} 
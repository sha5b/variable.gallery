import { fetchWooCommerceData } from '$lib/api';

export async function load() {
    try {
        const products = await fetchWooCommerceData('products');
        return { products };
    } catch (error) {
        console.error(error);
        return { products: [] }; // fallback in case of error
    }
}
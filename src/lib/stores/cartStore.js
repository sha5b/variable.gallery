import { writable } from 'svelte/store';

function persistedWritable(key, startValue) {
    const storedValue = typeof window !== 'undefined' ? JSON.parse(localStorage.getItem(key)) || startValue : startValue;
    const store = writable(storedValue);
    store.subscribe((value) => {
        if (typeof window !== 'undefined') {
            localStorage.setItem(key, JSON.stringify(value));
        }
    });
    return store;
}

export const cart = persistedWritable('cart', []);

export const addItem = (product) => {
    console.log('Adding item to cart:', {
        receivedProduct: product,
        id: product.id,
        name: product.name || product.title,
        price: product.price,
        images: product.images,
        variation: product.variation || null
    });

    const cartItem = {
        id: product.id,
        name: product.name || product.title,
        price: product.price,
        images: product.images,
        quantity: 1,
        variation: product.variation || null
    };

    cart.update((items) => {
        const existingItem = items.find((item) => item.id === cartItem.id);
        console.log('Existing cart items:', items);
        console.log('Found existing item:', existingItem);
        
        if (existingItem) {
            existingItem.quantity += 1;
            return [...items];
        } else {
            return [...items, cartItem];
        }
    });
};

// Function to remove an item from the cart
export const removeItem = (id) => {
  cart.update((items) => items.filter((item) => item.id !== id));
};

// Function to clear the cart
export const clearCart = () => {
  cart.set([]);
};

// Store to control whether the cart slider is open
export const isCartSliderOpen = writable(false);

// Function to toggle the cart slider
export const toggleCartSlider = () => {
  isCartSliderOpen.update(value => !value);
};

// Function to open the cart slider
export const openCartSlider = () => {
  isCartSliderOpen.set(true);
};

// Function to close the cart slider
export const closeCartSlider = () => {
  isCartSliderOpen.set(false);
};

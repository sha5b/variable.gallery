import { writable } from 'svelte/store';

let storedCart = [];

// Check if we're running in the browser (i.e., client-side)
if (typeof window !== 'undefined') {
  const cartFromLocalStorage = localStorage.getItem('cart');
  storedCart = cartFromLocalStorage ? JSON.parse(cartFromLocalStorage) : [];
}

// Initialize the cart store
export const cart = writable(storedCart);

// Subscribe to the cart store and update localStorage whenever the cart changes, only in the browser
cart.subscribe((value) => {
  if (typeof window !== 'undefined') {
    localStorage.setItem('cart', JSON.stringify(value));
  }
});

// Function to add an item to the cart
export const addItem = (product) => {
  cart.update((items) => {
    const existingItem = items.find((item) => item.id === product.id);
    if (existingItem) {
      existingItem.quantity += 1;
      return [...items];
    } else {
      return [...items, { ...product, quantity: 1 }];
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

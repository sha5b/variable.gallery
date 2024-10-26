import { writable } from 'svelte/store';

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

import { writable } from 'svelte/store';

export const productStore = writable({
  id: null,
  name: '',
});

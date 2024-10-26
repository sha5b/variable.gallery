import { writable } from 'svelte/store';

export const userInfo = writable({
  name: '',
  email: '',
  address: '',
  phone: '',
});
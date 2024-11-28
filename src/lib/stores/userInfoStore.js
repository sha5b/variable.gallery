import { writable } from 'svelte/store';

export const userInfo = writable({
	email: '',
	firstName: '',
	lastName: '',
	address: '',
	apartment: '',
	postalCode: '',
	city: '',
	phone: '',
	phoneCountryCode: '+43',
	country: 'AT',
	orderId: null
});

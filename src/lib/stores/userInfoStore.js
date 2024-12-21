import { writable } from 'svelte/store';

const defaultUserInfo = {
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
};

// Load initial data from sessionStorage if available
const storedUserInfo = typeof window !== 'undefined' 
	? sessionStorage.getItem('userInfo')
	: null;

const initialUserInfo = storedUserInfo 
	? JSON.parse(storedUserInfo)
	: defaultUserInfo;

const userInfoStore = writable(initialUserInfo);

// Subscribe to changes and update sessionStorage
if (typeof window !== 'undefined') {
	userInfoStore.subscribe(value => {
		sessionStorage.setItem('userInfo', JSON.stringify(value));
	});
}

export const userInfo = userInfoStore;

import data from './items.js';
import shortid from 'shortid';

export function getItems() {
    const localStorageKey = new Date().toDateString();
	let items = JSON.parse(localStorage.getItem(localStorageKey));
	if (!items) {
		localStorage.clear();
		items = data.map(name => ({id:'A'+shortid.generate(),name, qty: '', unit:''}));
		localStorage.setItem(localStorageKey, JSON.stringify(items));
    }
    return items;
}
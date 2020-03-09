import mockdata from './items.js';
import shortid from 'shortid';
const url = 'https://script.google.com/macros/s/AKfycbzn7GB0LV-iqSbJsGg1t7x2Lr7LIzVqgIWrAadsgx8wxhyuEyju/exec';

export async function getItems() {
    const response = await fetch(url);
    const json = await response.json();
    const items = json.map(item => ({ ...item, qty: '' }));
    persist(items);
    return items;
}

export function getCachedItems() {
    // const localStorageKey = new Date().toDateString();
    // let items = JSON.parse(localStorage.getItem(localStorageKey));
    // if (!items) {
        // localStorage.clear();
        let items = mockdata.map(name => ({ id: 'A' + shortid.generate(), name, qty: '', unit: '' }));
        // persist(items);
    // }
    console.log(items)
    return items;
}

export function persist(items) {
    const localStorageKey = new Date().toDateString();
    localStorage.setItem(localStorageKey, JSON.stringify(items));
}
import mockdata from './items.js';
import shortid from 'shortid';
const url = 'https://script.google.com/macros/s/AKfycbzn7GB0LV-iqSbJsGg1t7x2Lr7LIzVqgIWrAadsgx8wxhyuEyju/dev';

export async function getItems() {
    const response = await fetch(url);
    const json = await response.json();
    const items = json.map(item => ({ ...item, qty: '' }));
    persist(items);
    return items;
}

export function getCachedItems() {
    const localStorageKey = new Date().toDateString();
    let items = JSON.parse(localStorage.getItem(localStorageKey));
    if (!items) {
        localStorage.clear();
        let items = mockdata.map(name => ({ id: 'A' + shortid.generate(), name, qty: '', unit: '', notes: '' }));
        persist(items);
    }
    console.log(items)
    return items;
}

export function persist(items) {
    const localStorageKey = new Date().toDateString();
    localStorage.setItem(localStorageKey, JSON.stringify(items));
}

export async function complete(items) {
    
    const data = items.map(item => {
        const {name, qty, unit, notes} = item;
        return [ name, `${qty} ${unit}`.trim(), notes ]
    });
    const options = {
        method: 'POST',
        mode: 'no-cors',
        headers: {
            'Content-Type': 'application/json',
            'API-Key': 'AIzaSyAJRQTwl8HFeemLV1JfJTUa-ca4Im0LYQw',
        },
        body: JSON.stringify(data) // body data type must match "Content-Type" header
    };

    const response = fetch(url, options)
    return response;
    const json = await response.json();
    // , {
    //     method: 'GET',
    //     mode: 'no-cors'
    // });
    console.log(json)
    return json
}
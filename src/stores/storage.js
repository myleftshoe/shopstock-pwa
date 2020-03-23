import { jsonbin } from '../secrets'

import HashID from '../hashid.js';
const generateId = () => 'a' + HashID.generate()


function getFromLocalStorage(key) {
    const items = JSON.parse(localStorage.getItem(key))
    console.log('fetched items from local storage', items)
    return items
}

async function fetchFromJsonbin(binId, version = 'latest') {

    const url = `https://api.jsonbin.io/b/${binId}/${version}`

    const options = {
        method: 'GET',
        headers: {
            'secret-key': jsonbin.secretKey,
        },
    };

    const response = await fetch(url, options);
    const json = await response.json();

    const items = json;
    console.log('fetched items from jsonbin', items)
    return items;
}

import { writable, get } from 'svelte/store';

export function createStore(localStorageKey, binId) {
    const { subscribe, set, update } = writable(undefined, set => {
        set(getFromLocalStorage(localStorageKey));
        fetchFromJsonbin(binId).then(items => {
            items.length && set(items.map(item => ({ ...item, id: generateId(), qty: '2' })))
        });
        return function stop() { };
    });
    return {
        subscribe,
        update: () => {
            update(items => [...items])
            return items
        },
        persist: () => {
            localStorage.setItem(localStorageKey, JSON.stringify(get(items)));
            return items;
        }
    };
}



import mockdata from './items.js';
import shortid from 'shortid';
import { jsonbin } from './secrets.js';
const url = 'https://script.google.com/macros/s/AKfycbzn7GB0LV-iqSbJsGg1t7x2Lr7LIzVqgIWrAadsgx8wxhyuEyju/exec';

export async function getItems() {

    const binId = jsonbin.masterBinId;
    const version = 'latest'
    const url = `https://api.jsonbin.io/b/${binId}/${version}`

    const options = {
        method: 'GET',
        headers: {
            'secret-key': jsonbin.secretKey,
        },
    };

    const response = await fetch(url, options);
    const json = await response.json();

    const items = json.map(item => ({ ...item, qty: '' }));
    persist(items);

    return items;
}

function getLocalStorageKey() {
    // Current stock take is valid until midday the following day after
    // which it will be cleared the next time the app is started
    const today = new Date();
    today.setHours(today.getHours() - 12);
    return today.toDateString();
}

export function getCachedItems() {
    // const localStorageKey = new Date().toDateString();
    const localStorageKey = getLocalStorageKey();
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
//    const localStorageKey = new Date().toDateString();
    const localStorageKey = getLocalStorageKey();
    localStorage.setItem(localStorageKey, JSON.stringify(items));
}

export async function complete(items) {

    const binId = jsonbin.workingBinId;
    const url = `https://api.jsonbin.io/b/${binId}`

    const date = new Date().toDateString();

    const _items = items.map(item => {
        const { name, qty, unit, notes } = item;
        return [name, `${qty} ${unit}`.trim(), notes]
    });

    const data = { date , items: _items }

    const options = {
        method: 'PUT',
        headers: {
            'content-type': 'application/json',
            'secret-key': jsonbin.secretKey,
        },
        body: JSON.stringify(data)
    };

    const response = await fetch(url, options)
    // return response;
    const json = await response.json();
    // , {
    //     method: 'GET',
    //     mode: 'no-cors'
    // });
    console.log(json)
    return json
}
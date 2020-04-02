import { writable } from 'svelte/store';
import masterItems from './masterItems.js'
import { jsonbin } from '../secrets'


function toBoolean(value) {
    var result = false;
    try {
        result = !!JSON.parse(String(value).toLowerCase());
    } catch (e) { }
    return result;
}

function createIsComplete() {
    const { subscribe, set, update } = writable(toBoolean(localStorage.getItem('isComplete')));

    return {
        subscribe,
        set: boolean => {
            set(boolean)
            localStorage.setItem('isComplete', boolean)
        }
    };
}
const isComplete = createIsComplete()


async function notifyBackend() {
    const url = 'https://script.google.com/macros/s/AKfycbzn7GB0LV-iqSbJsGg1t7x2Lr7LIzVqgIWrAadsgx8wxhyuEyju/exec?complete=true';
    const response = await fetch(url)
    const text = await response.text();
    console.log('notifyBackend', text)
}


async function putItems(items) {

    const binId = jsonbin.workingBinId;
    const url = `https://api.jsonbin.io/b/${binId}`

    const data = items.filter(hasQty).map(item => {
        const { name, qty, unit, notes } = item
        return [name, qty, unit, notes]
    });

    if (!data.length) return

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
    console.log('items -> jsonbin', json)
    return json
}


async function putMasterItems(items) {

    const binId = jsonbin.masterBinId;
    const url = `https://api.jsonbin.io/b/${binId}`

    const data = items.map(({ name, unit, hidden }) => ({ name, unit, hidden }))

    if (!data.length) return

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
    console.log('masterItems -> jsonbin', json)
    return json
}




async function complete(items) {

    putItems(items);
    putMasterItems(items);
    notifyBackend();

}


// filter functions
const hasQty = item => item.qty.length > 0
const hidden = item => item.hidden
const notHidden = item => !item.hidden
const nameContains = string => ({ name }) => name.toLowerCase().includes(string.toLowerCase())
const nameStartsWith = string => ({ name }) => name.toLowerCase().startsWith(string.toLowerCase())

function smartFilter(items, searchValue) {
    if (!items || !items.length) return;

    let _items = [...items];
    if (!searchValue)
        _items = items.filter(notHidden)
    if (searchValue.startsWith('...')) {
        _items = items.filter(hidden)
        searchValue = searchValue.substr(3)
    }
    if (searchValue) {
        if (searchValue.length < 3)
            _items = _items.filter(nameStartsWith(searchValue))
        else
            _items = _items.filter(nameContains(searchValue))
    }

    return _items.sort(byName)
}

// sort functions
const byName = (a, b) => a.name.localeCompare(b.name)

// conversion functions
const textifyItem = ({ name, qty, unit }) => `${qty} x ${unit} ${name}`.replace(/ +/g, ' ').trim().replace(/^x /, '');
const textify = items => items.filter(hasQty).map(textifyItem).join('\r\n')
const htmlify = items => items.filter(hasQty).map(textifyItem).join('<br>')


export { masterItems, textify, htmlify, smartFilter, hasQty, complete, isComplete };



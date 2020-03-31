import masterItems from './masterItems.js'
import { jsonbin } from '../secrets'


async function notifyBackend() {
    const url = 'https://script.google.com/macros/s/AKfycbzn7GB0LV-iqSbJsGg1t7x2Lr7LIzVqgIWrAadsgx8wxhyuEyju/exec?complete=true';
    const response = await fetch(url)
    const text = await response.text();
    console.log(text)
}


async function complete(items) {

    const binId = jsonbin.workingBinId;
    const url = `https://api.jsonbin.io/b/${binId}`

    const data = items.filter(hasQty).map(item => {
        const { name, qty, unit, notes } = item
        return [name, qty, unit, notes]
    });

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
    notifyBackend()
    return json
}




// filter functions
const hasQty = item => item.qty.length > 0
const notHidden = item => !item.hidden
const nameContains = string => ({name}) => name.toLowerCase().includes(string.toLowerCase())
const nameStartsWith = string => ({name}) => name.toLowerCase().startsWith(string.toLowerCase())

function smartFilter(items, searchValue) {
    if (!items || !items.length) return;
    let _items = [...items];
    if (!searchValue) 
        _items = _items.filter(notHidden)
    else if (searchValue.length < 3) 
        _items = _items.filter(nameStartsWith(searchValue))
    else
        _items = _items.filter(nameContains(searchValue))
    return _items.sort(byName)
}

// sort functions
const byName = (a, b) => a.name.localeCompare(b.name)

// conversion functions
const textifyItem = ({ name, qty, unit }) => `${qty} x ${unit} ${name}`.replace(/ +/g, ' ').trim().replace(/^x /,'');
const textify = items => items.filter(hasQty).map(textifyItem).join('\r\n')
const htmlify = items => items.filter(hasQty).map(textifyItem).join('<br>')


export { masterItems, textify, htmlify, smartFilter, hasQty, complete};



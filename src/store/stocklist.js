import { writable, get } from 'svelte/store';
import UID, { alpha } from '../utils/uid.js';
import Cache from './cache.js'
import Jsonbin from './jsonbin.js'
import { isComplete } from './complete.js'

const LOCAL_STORAGE_KEY = 'items'
const JSONBIN_ID = '5e729cb6d3ffb01648aa44c6'

const cache = new Cache(LOCAL_STORAGE_KEY)
const storage = new Jsonbin(JSONBIN_ID)

const store = writable([]);

store.load = async function(cacheFirst = true) {
    if (cacheFirst) {
        const items = cache.get()
        if (Array.isArray(items)) {
            store.set(items)
        }
    }
    const items = await storage.read()
    store.set(items.map(reset))
    cache.set(store.get());
}

store.get = () => get(store) 

store.add = (itemToAdd = {}) => store.set([...store.get(), {
    id: new UID( {charset: alpha}).value,
    name: 'new item',
    qty: '',
    unit: '',
    ...itemToAdd
}])

store.remove = (itemToRemove = {}) => store.set(store.get().filter(item => item !== itemToRemove))

store.isComplete = get(isComplete);

Object.defineProperty(store, 'isComplete', {
    get() { return get(isComplete) },
    set(boolean) { isComplete.set(boolean) },
  });



const reset = item => ({ id: new UID({ charset: alpha }).value, ...item, qty: '' })

// filter functions
const keep = {
    validQuantities: item => item.qty.length > 0,
    hidden: item => item.hidden,
    namesWith: string => ({ name }) => name.toLowerCase().includes(string.toLowerCase()),
    namesStartingWith: string => ({ name }) => name.toLowerCase().startsWith(string.toLowerCase()), 
}

const discard = {
    hidden: item => !item.hidden,
}

// sort functions
const by = {
    name: (a, b) => a.name.localeCompare(b.name)
}

// conversion functions
const filter = function(items, searchValue) {
    if (!items || !items.length) 
        return items;
    let _items = [...items];
    if (!searchValue)
        _items = items.filter(discard.hidden)
    if (searchValue.startsWith('...')) {
        _items = items.filter(keep.hidden)
        searchValue = searchValue.substr(3)
    }
    if (searchValue) {
        if (searchValue.length < 3)
            _items = _items.filter(keep.namesStartingWith(searchValue))
        else
            _items = _items.filter(keep.namesWith(searchValue))
    }
    return _items.sort(by.name)
}

// conversion functions
const textifyItem = ({ name, qty, unit }) => `${qty} x ${unit} ${name}`.replace(/ +/g, ' ').trim().replace(/^x /, '');
const textify = items => items.filter(hasQty).map(textifyItem).join('\r\n')
const htmlify = items => items.filter(hasQty).map(textifyItem).join('<br>')


export default store
export { filter, keep, discard, textify, htmlify }



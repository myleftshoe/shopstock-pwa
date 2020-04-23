import { writable, get } from 'svelte/store'
import UID, { alpha } from '../utils/uid.js'
import Cache from './cache.js'
import Jsonbin from './jsonbin.js'
import { jsonbin } from '../secrets.js'

const LOCAL_STORAGE_KEY = 'items'
const MASTERBIN_ID = jsonbin.masterBinId
const WORKINGBIN_ID = jsonbin.workingBinId

const cache = new Cache(LOCAL_STORAGE_KEY)
const storage = new Jsonbin(MASTERBIN_ID)

const store = writable([])

store.load = async function (cacheFirst = true) {
    if (cacheFirst) {
        const items = cache.get()
        if (Array.isArray(items)) {
            store.set(items)
            return
        }
    }
    const items = await storage.read()
    store.set(items.map(reset).filter(keep.inStock).sort(by.name))
    cache.set(store.get())
}

store.get = () => get(store)

store.addItem = (item = {}) => {
    const items = [...store.get()]
    items.push({
        id: new UID({ charset: alpha }).value,
        name: 'new item',
        qty: '',
        unit: '',
        ...item
    })
    store.set(items)
    store.update();
}

store.updateItem = item => {
    const index = store.findItemIndex(item)
    store.get()[index] = {...item}
    store.update();
}

store.removeItem = item => {
    const items = store.get().filter(({id}) => id !== item.id)
    store.set(items)
    store.update()
}

store.update = () => {
    const items = [...store.get()]
    store.set(items)
    cache.set(items)
}

store.reset = () => {
    const items = [...store.get()]
    store.set(items.map(reset))
    store.update()
}

Object.defineProperty(store, 'completedItems', {
    get() {
        return [...store.get()].filter(keep.validQuantities)
    },
    set() { throw 'Cannot assign to property completedItems' },
})

store.filter = function (searchValue) {
    let items = [...store.get()]
    if (!items || !items.length)
        return items
    if (searchValue) {
        if (searchValue.length < 3)
            items = items.filter(keep.namesStartingWith(searchValue))
        else
            items = items.filter(keep.namesWith(searchValue))
    }
    return items
}


store.findItemIndex = itemToFind => store.get().findIndex(item => item.id === itemToFind.id)

store.findItemById = id => store.get().find(item => item.id === id)

const reset = item => ({ id: new UID({ charset: alpha }).value, ...item, whqty: String(item.whqty || ""), qty: '', unit: '' })

// filter functions
const keep = {
    validQuantities: item => item.qty.length > 0,
    inStock: item => item.whqty.length > 0,
    namesWith: string => ({ name }) => name.toLowerCase().includes(string.toLowerCase()),
    namesStartingWith: string => ({ name }) => name.toLowerCase().startsWith(string.toLowerCase()),
}

// sort functions
const by = {
    name: (a, b) => a.name.localeCompare(b.name)
}

// conversion functions
const textifyItem = ({ name, qty, unit, whunit, notes }) => `${qty} x ${unit || whunit} ${name}${notes ? ` (${notes})` : ''}`.replace(/ +/g, ' ').trim().replace(/^x /, '')
const textify = items => items.filter(keep.validQuantities).map(textifyItem).join('\r\n')
const htmlify = items => items.filter(keep.validQuantities).map(textifyItem).join('<br>')


export default store
export { keep, textify, htmlify }



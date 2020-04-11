import { writable, get } from 'svelte/store'
import UID, { alpha } from '../utils/uid.js'
import Cache from './cache.js'
import Jsonbin from './jsonbin.js'
import { jsonbin } from '../secrets.js'
import { isComplete } from './complete.js'

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
    store.set(items.map(reset))
    cache.set(store.get())
}

store.get = () => get(store)

store.add = (itemToAdd = {}) => store.set([...store.get(), {
    id: new UID({ charset: alpha }).value,
    name: 'new item',
    qty: '',
    unit: '',
    ...itemToAdd
}])

store.remove = (itemToRemove = {}) => store.set(store.get().filter(item => item !== itemToRemove))

store.hideOrDelete = function (item) {
    if (item.hidden === true) {
        store.remove(item)
        return
    }
    item.hidden = true
    item.qty = ''
    store.update()
}

store.update = (items = [...store.get()]) => {
    store.isComplete = false
    store.set(items)
    cache.set(items)
}

store.reset = () => store.set(store.get().map(reset))

store.complete = async () => {
    persistMaster()
    await persistWorking()
    notifyBackend()
    store.isComplete = true
}

async function persistMaster() {
    const items = store.get()
    if (!items) return
    const data = items.map(({ name, unit, hidden }) => ({ name, unit, hidden }))
    return storage.update(data)
}

async function persistWorking() {
    const items = store.get()
    if (!items) return
    const storage = new Jsonbin(WORKINGBIN_ID)
    const data = items.filter(keep.validQuantities).map(item => {
        const { name, qty, unit, notes } = item
        return [name, qty, unit, notes]
    })
    if (!data.length) return
    return storage.update(data)
}

async function notifyBackend() {
    const url = 'https://script.google.com/macros/s/AKfycbzn7GB0LV-iqSbJsGg1t7x2Lr7LIzVqgIWrAadsgx8wxhyuEyju/exec?complete=true'
    const response = await fetch(url)
    const text = await response.text()
    console.log('notifyBackend', text)
}

Object.defineProperty(store, 'isComplete', {
    get() { return get(isComplete) },
    set(boolean) { isComplete.set(boolean) },
})

Object.defineProperty(store, 'completedItems', {
    get() {
        return [...store.get()].filter(keep.validQuantities).filter(discard.hidden)
    },
    set() { throw 'Cannot assign to property completedItems' },
})

store.filter = function (searchValue) {
    let items = [...store.get()]
    console.log(items)
    if (!items || !items.length)
        return items
    if (!searchValue)
        items = items.filter(discard.hidden)
    if (searchValue.startsWith('-')) {
        items = items.filter(keep.hidden)
        searchValue = searchValue.substr(1)
    }
    if (searchValue.startsWith('#')) {
        items = items.filter(keep.validQuantities)
        searchValue = searchValue.substr(1)
    }
    if (searchValue) {
        if (searchValue.length < 3)
            items = items.filter(keep.namesStartingWith(searchValue))
        else
            items = items.filter(keep.namesWith(searchValue))
    }
    return items.sort(by.name)
}


store.findItemIndex = itemToFind => store.get().findIndex(item => item.id === itemToFind.id)

store.findItemById = id => store.get().find(item => item.id === id)

store.replaceItem = ({...item}) => {
    const index = store.findItemIndex(item)
    store.get()[index] = item
    return item
}


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
const textifyItem = ({ name, qty, unit }) => `${qty} x ${unit} ${name}`.replace(/ +/g, ' ').trim().replace(/^x /, '')
const textify = items => items.filter(keep.validQuantities).map(textifyItem).join('\r\n')
const htmlify = items => items.filter(keep.validQuantities).map(textifyItem).join('<br>')


export default store
export { keep, discard, textify, htmlify }



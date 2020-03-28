import PersistentStore from './persistentstore.js'
import { jsonbin } from '../secrets'

function getLocalStorageKey() {
    const today = new Date();
    today.setHours(today.getHours() - 0);
    return today.toDateString();
}

const masterItems = new PersistentStore( 'Master Items', jsonbin.masterBinId )
const workingItems = new PersistentStore( getLocalStorageKey(), jsonbin.workingBinId )

// filter functions
const hasQty = item => item.qty.length > 0
const notHidden = item => !item.hidden
const nameContains = string => ({name}) => name.toLowerCase().includes(string.toLowerCase())
const nameStartsWith = string => ({name}) => name.toLowerCase().startsWith(string.toLowerCase())

function smartFilter(items, searchValue) {
    if (!items || !items.length) return;
    let _items = [...items];
    if (searchValue.length < 3) {
        _items = _items.filter(notHidden).filter(nameStartsWith(searchValue))
    }
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


export { masterItems, workingItems, textify, htmlify, smartFilter};



import PersistentStore from './persistentstore.js'
import { jsonbin } from '../secrets'

function getLocalStorageKey() {
    const today = new Date();
    today.setHours(today.getHours() - 0);
    return today.toDateString();
}

const masterItems = new PersistentStore( 'Master Items', jsonbin.masterBinId )
const workingItems = new PersistentStore( getLocalStorageKey(), jsonbin.workingBinId )

const textifyItem = ({ name, qty, unit }) => `${qty} x ${unit} ${name}`.replace(/ +/g, ' ').trim().replace(/^x /,'');

const hasQty = (item) => trim(item.qty).length > 0

function textify(items) {
    return items.filter(hasQty).map(textifyItem).join('\r\n');
}

function htmlify(items) {
    return items.filter(hasQty).map(textifyItem).join('<br>');
}

export { masterItems, workingItems, textify, htmlify };



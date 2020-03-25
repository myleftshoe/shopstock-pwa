import PersistentStore from './persistentstore.js'
import { jsonbin } from '../secrets'

function getLocalStorageKey() {
    const today = new Date();
    today.setHours(today.getHours() - 0);
    return today.toDateString();
}

const masterItems = new PersistentStore( 'Master Items', jsonbin.masterBinId )
const workingItems = new PersistentStore( getLocalStorageKey(), jsonbin.workingBinId )

const textifyItem = ({ name, qty, unit }) => `${qty} x ${unit} ${name}`

function textify(items) {
    return items.reduce( (text, item) => `${text}${textifyItem(item)}\r\n`, "")
}

export { masterItems, workingItems, textify };



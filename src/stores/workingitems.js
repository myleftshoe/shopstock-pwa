import PersistentStore from './persistentstore.js'
import { jsonbin } from '../secrets'

function getLocalStorageKey() {
    const today = new Date();
    today.setHours(today.getHours() - 0);
    return today.toDateString();
}

const workingItems = new PersistentStore( getLocalStorageKey(), jsonbin.workingBinId )

export { workingItems };
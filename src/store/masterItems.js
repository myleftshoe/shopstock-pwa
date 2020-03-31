import PersistentStore from './persistentstore.js'
import { jsonbin } from '../secrets'
import UID, { alpha } from '../uid.js';

const store = new PersistentStore( 'Master Items', jsonbin.masterBinId )

const map = item => ({id: new UID({charset: alpha}).value, ...item, qty:''  })

store.getOrFetch = async (isComplete) => {
    if (!isComplete) {
        const cachedItems = store.get()
        if (Array.isArray(cachedItems)) {
            store.update(cachedItems)
            return store;        
        }
    }
    const fetchedItems = await store.fetch()
    store.update(fetchedItems.map(map))
    return store;
}

store.clearQuantities = () => {
    const items = store.get().map(item => ({...item, qty: ''}));
    store.update(items)
}

export default store;
import PersistentStore from './persistentstore.js'
import { jsonbin } from '../secrets'
import UID, { alpha } from '../uid.js';

const store = new PersistentStore( 'Master Items', jsonbin.masterBinId )

const map = item => ({id: new UID({charset: alpha}).value, ...item, qty:''  })

store.fetchCacheFirst = async () => {
    const cachedItems = store.get();
    store.update(cachedItems.map(map))
    const fetchedItems = await store.fetch();
    store.update(fetchedItems.map(map));
    return store;
}

export default store;
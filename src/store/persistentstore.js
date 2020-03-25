import UID, { alpha } from '../uid.js';
import { writable, get } from 'svelte/store';
import Jsonbin from './jsonbin.js'
import Cache from './cache.js'

export function PersistentStore( cacheKey, binId ) {

    const bin = new Jsonbin(binId)
    const cache = new Cache(cacheKey)

    const { subscribe, set, update } = writable();
    const store = {
        subscribe,
        get values() { 
            return get(store)
        },
        get() {
            set(cache.get())
            return store
        },
        async fetch() {
            const data = await bin.read();
            set([...data]);
            // bin.read().then(items => {
            //     items.length && set(items.map(item => ({ ...item, id: new UID({charset: alpha}).value })))
            // })
            return store;
        },
        update(data) {
            set([...data])
            return store;
        },
        cache() {
            cache.set(this.values);
            return store;
        },
        persist() {
            bin.update(this.values)
            return store;
        }
    }
    return store;
}

export default PersistentStore;
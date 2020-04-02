import { writable, get } from 'svelte/store';
import Jsonbin from './jsonbin.js'
import Cache from './cache.js'

export function PersistentStore(cacheKey, binId) {

    const bin = new Jsonbin(binId)
    const cache = new Cache(cacheKey)

    const { subscribe, set, update } = writable();
    const store = {
        subscribe,
        get values() {
            return get(store)
        },
        get() {
            return cache.get()
        },
        fetch() {
            return bin.read();
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
import { writable } from 'svelte/store'
import { toBoolean } from '../utils'

function createIsComplete() {
    const { subscribe, set } = writable(toBoolean(localStorage.getItem('isComplete')));

    return {
        subscribe,
        set: boolean => {
            set(boolean)
            localStorage.setItem('isComplete', boolean)
        }
    };
}

export const isComplete = createIsComplete()


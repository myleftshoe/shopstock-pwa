import { jsonbin } from '../secrets'

import { createStore } from './storage';

const localStorageKey = getLocalStorageKey()
const binId = jsonbin.workingBinId

function getLocalStorageKey() {
    const today = new Date();
    today.setHours(today.getHours() - 0);
    return today.toDateString();
}

export const workingItems = createStore(localStorageKey, binId);
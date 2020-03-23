import HashID from '../hashid.js';
import { jsonbin } from '../secrets'

import { createStore } from './storage';

const localStorageKey = 'Master Items'
const binId = jsonbin.masterBinId

export const masterItems = createStore(localStorageKey, binId);
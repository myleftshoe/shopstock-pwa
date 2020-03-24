import PersistentStore from './persistentstore.js'
import { jsonbin } from '../secrets'

const masterItems = new PersistentStore( 'Master Items', jsonbin.masterBinId )

export { masterItems };
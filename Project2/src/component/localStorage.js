// A global variable of storage
// mainly for storing uid

'use native'
import Storage from 'react-native-storage'
import { AsyncStorage } from 'react-native'

var storage = new Storage({
    storageBackend: AsyncStorage
})

export default global.storage = storage
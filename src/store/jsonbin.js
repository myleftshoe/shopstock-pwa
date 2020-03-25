import { jsonbin } from '../secrets'

const endpoint = 'https://api.jsonbin.io/b'
const secretKey = jsonbin.secretKey;

class Jsonbin {

    constructor(binId) {
        this.binId = binId;
    }

    static async create({name = '', isPrivate = false, data}) {

        const url = `${endpoint}/${this.binId}`
    
        const options = {
            method: 'POST',
            headers: {
                'content-type': 'application/json',
                'secret-key': secretKey,
                'private': isPrivate,
                'name': name,
            },
            body: JSON.stringify(data)
        };
    
        const response = await fetch(url, options)
        const json = await response.json()

        console.log(json)

        const result = json.success ? json.id : null
        return result
    }

    async read(version = 'latest') {

        const url = `${endpoint}/${this.binId}/${version}`

        const options = {
            method: 'GET',
            headers: {
                'secret-key': secretKey,
            },
        };
    
        const response = await fetch(url, options);
        const json = await response.json();
    
        console.log('fetched items from jsonbin', json)
        return json;
    }

    async update(data) {

        const url = `${endpoint}/${this.binId}`
    
        const options = {
            method: 'PUT',
            headers: {
                'content-type': 'application/json',
                'secret-key': secretKey,
            },
            body: JSON.stringify(data)
        };
    
        const response = await fetch(url, options)
        const json = await response.json();

        console.log(json)

        const result = json.success ? json.version : null
        return result;
    
    }

    async delete(version) {

    }

}


export default Jsonbin
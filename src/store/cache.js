class Cache {
    constructor(key) {
        this.key = key
    }
    get() {
        const data = JSON.parse(localStorage.getItem(this.key))
        console.log('fetched items from local storage', data)
        return data
    }
    set(data) {
        localStorage.setItem(this.key, JSON.stringify(data))
    }
}

export default Cache
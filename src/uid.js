const safe = '23456789abdegjkmnpqrvwxyz'
const alpha = 'bcdfghjklmnpqrstvwxyzBCDFGHJKLMNPQRSTVWXYZ'

class UID {
    constructor({ charset = safe, length = 8 } = {}) {
        this.charset = charset
        this.length = length
        this.excluded = new Set();
    }
    exclude(uids = []) {
        this.excluded = new Set(uids)
        return this
    }
    generate() {
        let result = ''
        for (let i = 0; i < this.length; i++) {
            result += this.charset.charAt(Math.floor(Math.random() * this.charset.length))
        }
        return result
    }
    get value() {
        let result = ''
        do {
            result = this.generate()
        } while (this.excluded.has(result))
        return result
    }
}

export { safe, alpha }
export default UID

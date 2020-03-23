const safe = '23456789abdegjkmnpqrvwxyz';
const alpha = 'bcdfghjklmnpqrstvwxyzBCDFGHJKLMNPQRSTVWXYZ'

const uid = { 
    generate(charset = safe, length = 8) {
        let result = '';
        for (let i = 0; i < length; i++) {
            result += charset.charAt(Math.floor(Math.random() * charset.length));
        }
        return result;
    }
}

export { safe, alpha };
export default uid;

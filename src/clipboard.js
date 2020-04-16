import Clipboard from 'awesome-clipboard'

const copy = async text => Clipboard.write(text)

export default { copy }

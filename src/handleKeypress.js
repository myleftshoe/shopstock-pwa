export default function handleKeypress({ type, key }, item) {
    let stop = true
    switch (type) {
        case 'header':
            item.unit = key
        case 'unit':
            item.unit = key
            break
        case 'fraction':
            item.qty = key
            break
        case 'clear':
            item.qty = ''
            item.unit = ''
            break
        default:
            stop = false
    }

    if (stop) return

    let qty = Number(item.qty)
    if (isNaN(qty)) return

    switch (type) {
        case 'increment':
            qty++
            break
        case 'decrement':
            qty = qty < 2 ? 0 : qty - 1
            break
        case 'number':
            qty = Number(`${qty}${key}`)
            break
    }
    item.qty = String(qty)

    if (item.qty) delete item.hidden

}

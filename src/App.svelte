<style>
    main {
        position: fixed;
        top:0;
        display: flex;
        flex-direction: column;
        width: 100vw;
        height: 100vh;
        overflow-y: scroll;
        -webkit-overflow-scrolling: touch;
    }
    footer {
        flex-basis: 50vh;
        flex-shrink: 0;
        display: flex;
        flex-direction: column;
        align-items: center;
        justify-content: space-around;
    }
    a {
        color: white;
    }
    .primary {
        background-color: yellowgreen;
    }
    .secondary {
        background-color: rosybrown;
    }
    button {
        background-color: yellowgreen;
        color: #ddd;
        min-width: 128px;
        margin: 16px;
        border: none;
        outline: none;
        text-transform: uppercase;
        font-size: 18px;
        padding: 16px;
        font-weight: bold;
        user-select: none;
        border-radius: 7px;
    }
    button:active {
        background-color: grey;
        color: #111;
    }
    button:disabled {
        background-color: grey;
        color: #111;
    }
</style>

<script>
    import { onMount, afterUpdate } from 'svelte'
    import { scrollTo } from 'svelte-scrollto'
    import { getCachedItems, getItems, persist, complete } from './store.js'
    import Keypad, { NUMERIC, UNIT } from './keypad.svelte'
    import Items from './items.svelte'
    import Spinner from './loader.svelte'
    import Edit from './edit.svelte'
    import mailTo from './mailto.js'

    let status = localStorage.getItem('status') || ''

    let editItem = false

    let items

    const hasQty = item => item.qty

    onMount(async () => {
        items = await getCachedItems()
        if (!Array.isArray(items) || !items.some(hasQty)) {
            items = await getItems()
        }
    })

    let selectedItem = {}

    let pointerDown = false

    let keypadType = NUMERIC
    let keypadVisible = false

    function handleQtyClick(e) {
        selectedItem = e.detail.item
        keypadType = NUMERIC
        keypadVisible = true
    }

    function handleItemClick(e) {
        if (e.detail.item === selectedItem && !keypadVisible) {
            editItem = true
        }
        selectedItem = e.detail.item
        keypadVisible = false
    }

    function updateItems() {
        status = ''
        items = [...items]
        persist(items)
    }

    function handleKeypadClick(e) {
        const { type, key } = e.target.dataset

        let stop = true
        switch (type) {
            case 'header':
                keypadType = keypadType === NUMERIC ? UNIT : NUMERIC
                return
            case 'unit':
                selectedItem.unit = key
                break
            case 'fraction':
                selectedItem.qty = key
                break
            case 'clear':
                selectedItem.qty = ''
                selectedItem.unit = ''
                break
            default:
                stop = false
        }

        if (stop) {
            updateItems()
            return
        }

        let qty = Number(selectedItem.qty)
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
        selectedItem.qty = qty
        updateItems()
    }

    function scrollIntoView(item) {
        scrollTo({
            container: '#container',
            element: `#${item.id}`,
            offset: -200,
        })
    }

    function ensureItemIsVisible(item) {
        const elementBottom = document
            .getElementById(item.id)
            .getBoundingClientRect().bottom
        const bodyMidpoint =
            document.getElementsByTagName('body')[0].getBoundingClientRect()
                .bottom / 2
        if (elementBottom > bodyMidpoint) scrollIntoView(item)
    }

    function handleKeypadOpen() {
        // keypadType = NUMERIC
        ensureItemIsVisible(selectedItem)
    }

    function findItemIndex(itemToFind) {
        return items.findIndex(item => item.id === itemToFind.id)
    }

    function replaceItem(item) {
        items[findItemIndex(item)] = { ...item }
    }

    function handleEditItemDone(e) {
        selectedItem = { ...e.detail.item }
        replaceItem(selectedItem)
        updateItems()
        editItem = false
    }

    function handleEditItemCancel(e) {
        editItem = false
    }

    async function doComplete() {
        status = 'working...'
        await complete(items)
        status = 'completed'
        localStorage.setItem('status', status)
        console.log('Complete!')
    }

    function startOver() {
        items.forEach(item => (item.qty = ''))
        updateItems()
    }

</script>

{#if !items}
    <Spinner />
{:else}
    {#if editItem}
        <Edit
            item={{ ...selectedItem }}
            on:done={handleEditItemDone}
            on:cancel={handleEditItemCancel}
        />
    {/if}
    <main
        id="container"
        class="container"
        on:pointerdown={() => (pointerDown = true)}
        on:pointerup={() => (pointerDown = false)}
    >
        <Items
            {items}
            {selectedItem}
            on:itemclick={handleItemClick}
            on:qtyclick={handleQtyClick}
        />
        <footer>
            {#if status === 'completed'}
                <button class="secondary" on:click={startOver}>
                    Start Over
                </button>
            {:else}
                <button
                    class="primary"
                    disabled={status === 'working...'}
                    on:click={doComplete}
                >
                    Done
                </button>
                <div>
                    <a href={mailTo()}>
                        Send email
                    </a>
                </div>
            {/if}
        </footer>
    </main>
    <Keypad
        bind:type={keypadType}
        bind:visible={keypadVisible}
        on:click={handleKeypadClick}
        on:open={handleKeypadOpen}
    />
{/if}

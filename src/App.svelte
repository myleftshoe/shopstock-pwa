<style>
    main {
        display: flex;
        flex-direction: column;
        width: 100vw;
        height: 100%;
        overflow-y: auto;
    }
    .autoscroll {
        overflow-y: hidden;
    }
    footer {
        flex-basis: 50vh;
        flex-shrink: 0;
        display: flex;
        align-items: center;
        justify-content: center;
        /* background-color: #232323; */
    }
    header {
        display: flex;
        align-items: center;
        justify-content: center;
        color: white;
        font-size: 16px;
        height: 60px;
    }
    a {
        color: white;
    }
</style>

<script async>
    import { onMount, afterUpdate } from 'svelte'
    import { scrollTo } from 'svelte-scrollto'
    import { getCachedItems, getItems, persist, complete } from './store.js'
    import Keypad, { NUMERIC, UNIT } from './keypad.svelte'
    import Items from './items.svelte'
    import Spinner from './loader.svelte'
    import Edit from './edit.svelte'

    let status = localStorage.getItem('status') || '';

    let editItem = false

    let items

    const hasQty = item => item.qty

    onMount(async () => {
        items = await getCachedItems()
        // console.log('edited', items.some(hasQty))
        if (!Array.isArray(items) || !items.some(hasQty))
            items = await getItems()
    })

    let selectedItem = {}

    let autoscroll = false
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

    function handleScroll() {
        if (!autoscroll && pointerDown) keypadVisible = false
    }

    function scrollIntoView(item) {
        autoscroll = true
        scrollTo({
            container: '#container',
            element: `#${item.id}`,
            offset: -200,
            onDone: () =>
                setTimeout(() => {
                    autoscroll = false
                }, 1000),
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
        keypadType = NUMERIC
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
        // localStorage.setItem('status', status)
        await complete(items)
        status = 'completed'
        localStorage.setItem('status', status)
        console.log('Complete!')
    }

    $: status = localStorage.getItem('status') || '';    

</script>

{#if !items}
    <Spinner/>
{:else}
    <header>
        {status}
    </header>
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
        class:autoscroll
        on:scroll={handleScroll}
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
            <button disabled={status === 'working...'} on:click={doComplete}>
                Mark complete and send email
            </button>
        </footer>
    </main>
    <Keypad
        bind:type={keypadType}
        bind:visible={keypadVisible}
        on:click={handleKeypadClick}
        on:open={handleKeypadOpen}
    />
{/if}
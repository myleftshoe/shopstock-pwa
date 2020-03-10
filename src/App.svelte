<style>
    .container {
        display: flex;
        flex-direction: column;
        width: 100vw;
        height: 100%;
        position: fixed;
        overflow-y: auto;
    }
    .autoscroll {
        overflow-y: hidden;
    }
    #spacer {
        flex-basis: 50vh;
        flex-shrink: 0;
        /* background-color: #232323; */
    }
</style>

<script async>
    import { onMount } from 'svelte'
    import { scrollTo } from 'svelte-scrollto'
    import { getCachedItems, persist } from './store.js'
    import Keypad, { NUMERIC, UNIT } from './keypad.svelte'
    import Items from './items.svelte'
    import Spinner from './spinner.svelte'
    import Edit from './edit.svelte'

    let editItem = false;

    let items = getCachedItems()
    // onMount(async () => {
    //     items = await getItems()
    // })

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
        keypadVisible = false
        if (e.detail.item === selectedItem) {
            editItem = true
        }
        selectedItem = e.detail.item
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

    function handleEditItemDone(e) {
        console.log(e.detail.item)
        updateItems();
        editItem=false;
    }
</script>

{#if !items}
    <p>...waiting</p>
    <Spinner />
{:else}
    <Edit
        bind:item={selectedItem}
        open={editItem}
        on:done={handleEditItemDone}
        on:cancel={() => (editItem = false)}
    />
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
        <div id="spacer" />

    </main>
    <Keypad
        bind:type={keypadType}
        bind:visible={keypadVisible}
        on:click={handleKeypadClick}
        on:open={handleKeypadOpen}
    />
{/if}

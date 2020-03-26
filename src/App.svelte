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
        justify-content: center;
    }
    a {
        color: white;
    }
</style>

<script>
    import dialogPolyfill from 'dialog-polyfill'
    import { onMount, onDestroy } from 'svelte'
    import { scrollTo } from 'svelte-scrollto'
    import { masterItems, workingItems, textify, htmlify } from './store'
    import { sendEmail, sendSMS } from './share.js'
    import Keypad, { NUMERIC, UNIT } from './keypad.svelte'
    import Items from './items.svelte'
    import Spinner from './loader.svelte'
    import Edit from './edit.svelte'
    import Button from './button.svelte'
    import IconButton from './iconbutton.svelte'
    import Dialog from './dialog.svelte'

    let status = localStorage.getItem('status') || ''

    let editItem = false


    const hasQty = item => item.qty

    let selectedItem = {}

    let pointerDown = false

    let keypadType = NUMERIC
    let keypadVisible = false


    onMount(async () => {
        document.addEventListener('copy', copyAsText);
        masterItems.get()
        await masterItems.fetch();
        masterItems.cache();
    });
    
    onDestroy(() => {
        document.removeEventListener('copy', copyAsText);        
    })

    function copyAsText(e) {
        e.preventDefault();
        e.clipboardData.setData('text', textify(items))
    }

    function execCopy(e) {
        document.execCommand('copy')
    } 

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
        console.log('dfssf')
        status = ''
        masterItems.update(items).cache()
        // masterItems.cache(items)
        // masterItems.persist(items)
        // items = [...items]
        // persist(items)
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
        // if (Array.isArray(masterItems))
        //     items = [...masterItems]
        // items.forEach(item => (item.qty = ''))
        // updateItems()
    }


    $: items = $masterItems;
    $: console.log(items)
    let dialog = null;
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
            <!-- {#if status === 'completed'}
                <Button secondary on:click={startOver}>
                    Start Over
                </Button>
            {:else}
                <Button primary disabled={status === 'working...'} on:click={doComplete}>
                    Done
                </Button>
            {/if} -->
            <Button on:click={execCopy}>Copy all</Button>
        </footer>
    </main>
        <!-- <Dialog bind:dialog={dialog}
            on:cancel={() => console.log('dialog cancel')} 
            on:close={() => console.log('dialog closed')}
        >
            {@html htmlify(items)}
        </Dialog> -->
    <Keypad
        bind:type={keypadType}
        bind:visible={keypadVisible}
        on:click={handleKeypadClick}
        on:open={handleKeypadOpen}
    />
{/if}

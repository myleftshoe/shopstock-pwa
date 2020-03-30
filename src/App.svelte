<script>
    import dialogPolyfill from 'dialog-polyfill'
    import { onMount, onDestroy } from 'svelte'
    import { scrollTo } from 'svelte-scrollto'
    import { masterItems, workingItems, textify, htmlify, smartFilter } from './store'
    import { sendEmail, sendSMS } from './share.js'
    import Keypad, { NUMERIC, UNIT } from './keypad.svelte'
    import Items from './items.svelte'
    import Item from './item.svelte'
    import Spinner from './loader.svelte'
    import Edit from './edit.svelte'
    import Button from './button.svelte'
    import IconButton from './iconbutton.svelte'
    import Dialog from './dialog.svelte'
    import Search from './search.svelte'
    import UID, { alpha } from './uid.js';


    const newItem = (name) => {
        const id = new UID({charset: alpha}).value
        return {
            id,
            name,
            qty: "",
            unit: ""
        }
    }

    let editItem = false
    let editMode = false;

    let selectedItem = {}

    let keypadType = NUMERIC
    let keypadVisible = false

    let copied = false;

    let dialog = null;

    let searchValue = "";

    onMount(async () => {
        document.addEventListener('copy', copyAsText);
        masterItems.get()
        // await masterItems.fetch()
        // masterItems.cache();
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
        copied = true;
        setTimeout(() => copied = false, 2000)
        masterItems.cache().persist()
    } 

    function handleQtyClick(e) {
        selectedItem = e.detail.item
        keypadType = NUMERIC
        keypadVisible = true
    }

    function handleHideClick(e) {
        selectedItem = e.detail.item
        selectedItem.hidden = !selectedItem.hidden;
        updateItems();
        console.log(selectedItem)
    }

    function handleDoneClick(e) {
        editMode = false;
        updateItems();
    }

    function handleItemClick(e) {
        if (e.detail.item === selectedItem && !keypadVisible) {
            editItem = true
        }
        selectedItem = e.detail.item
    }

    function updateItems() {
        masterItems.update($masterItems).cache()
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

        if (selectedItem.qty)
            delete selectedItem.hidden

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

    function handleEditItemClose(e) {
        editItem = false
    }

    function startOver() {
        const clearedItems = $masterItems.map(item => ({...item, qty: ''}))
        masterItems.update(clearedItems)
        masterItems.cache()
    }

    function handleTouchStart(e) { 
        const isQuantityElement =
            e.target.className.startsWith('quantity') ||
            e.target.parentElement.className.startsWith('quantity')
        
        if (keypadVisible && !isQuantityElement)
            keypadVisible = false
    }

    function handleAddClick() {
        masterItems.update([...$masterItems, newItem(searchValue)])
    }

    function handleDelete() {
        const newItems = $masterItems.filter(item => item.id !== selectedItem.id)
        masterItems.update(newItems)
    }

    $: items = smartFilter($masterItems, searchValue)
    $: console.log(items, $masterItems)

</script>

{#if !items}
    <Spinner />
{:else}
    {#if editItem}
        <Edit
            item={selectedItem}
            on:done={handleEditItemDone}
            on:close={handleEditItemClose}
            on:delete={handleDelete}
        />
    {/if}
    <div on:touchstart|stopPropagation|capture={handleTouchStart}>
        <header>
            <div class="left">
                <Search bind:value={searchValue}/>
                <!-- {#if searchValue.length}
                    <button on:click={() => searchValue=""}>clear</button>
                {/if} -->
            </div>        
            <div class="right">
                {#if items.length}
                    {#if editMode}
                        <button on:click={handleDoneClick}>done</button>
                    {:else}
                        <button on:click={() => editMode = true}>edit</button>
                    {/if}
                {:else}
                    <button on:click={handleAddClick}>add</button>
                {/if}

            </div>
        </header>
        <main
            id="container"
            class="container"
            on:contextmenu|preventDefault|stopPropagation
        >
            <Items
                {items}
                {selectedItem}
                on:itemclick={handleItemClick}
                on:qtyclick={handleQtyClick}
                on:hideclick={handleHideClick}
                {editMode}
            />
            <footer>
                <!-- {#if searchValue}
                    <Button on:click={() => dialog.showModal()}>Add item</Button>
                {:else} -->
                {#if !searchValue}
                    <Button primary on:click={execCopy} disabled={copied}>{copied ? `Copied ${items.length} items!` : 'Copy all'}</Button>
                    <Button on:click={startOver} style="margin-top:24px">Start over</Button>
                {/if}
            </footer>
        </main>
        <!-- <Dialog bind:dialog={dialog}
            on:cancel={() => console.log('dialog cancel')} 
            on:close={() => console.log('dialog closed')}
        >
            {@html htmlify(items)}
        </Dialog> -->
    </div>
    <Keypad
        bind:type={keypadType}
        bind:visible={keypadVisible}
        on:click={handleKeypadClick}
        on:open={handleKeypadOpen}
    />

{/if}

<!-- <svelte:body on:touchstart|stopPropagation|capture={handleTouchStart}/> -->


<style>
    main {
        position: fixed;
        top:48px;
        display: flex;
        flex-direction: column;
        width: 100vw;
        height: calc( 100vh - 48px );
        overflow-y: scroll;
        overflow-x: hidden;
        -webkit-overflow-scrolling: touch;
    }
    header {
        position: fixed;
        top:0;
        width:100vw;
        display:flex;
        justify-content: space-between;
        align-items: center;
        /* flex-basis: 24px; */
        height:48px;
        /* font-size:12px; */
        font-weight: bolder;
        text-transform: uppercase;
        z-index:100;
        background-color:#000;
        color:#fff;
    }
    header button {
        width:100%;
        padding: 2px 8px;
        border:none;
        outline:none;
        /* font-size:inherit; */
        font-weight: inherit;
        text-transform: inherit;
        background-color:transparent;
        color: #ddd;
        user-select: none;
    }
    header button:active {
        background-color:gray;
        color: #ddd;
        padding: 16px;
    }
    .left {
        flex: 100%;
        display:flex;
        /* justify-content: center; */
        align-items: center;
        margin-left: 8px;
    }
    .right {
        width:30vw;
        display:flex;
        justify-content: center;
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



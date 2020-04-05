<script>
    import dialogPolyfill from 'dialog-polyfill'
    import { onMount, onDestroy, tick } from 'svelte'
    import { scrollTo } from 'svelte-scrollto'
    import stocklist, { keep, discard, textify } from './store'
    import Keypad, { NUMERIC, UNIT } from './keypad'
    import Items from './items.svelte'
    import Item from './item.svelte'
    import Loader from './loader.svelte'
    import Edit from './edit.svelte'
    import Button from './button.svelte'
    import Dialog from './dialog.svelte'
    import Search from './search.svelte'
    import handleKeypress from './handleKeypress'
    import clipboard from './clipboard.js'

    let editItem = false

    let selectedItem = {}

    let keypadType = NUMERIC
    let keypadVisible = false

    let copied = false

    let dialog = null

    let searchValue = ''

    onMount(() => {
        stocklist.load()
    })

    function copyToClipboard() {
        clipboard.copy(textify(stocklist.completedItems))
        copied = true
        setTimeout(() => (copied = false), 2000)
        stocklist.complete()
    }

    function handleQtyClick(e) {
        selectItem(e.detail.item)
        keypadType = NUMERIC
        keypadVisible = true
    }

    function handleHideClick(e) {
        const item = stocklist.findItemById(e.detail.id)
        if (item.hidden === true) {
            stocklist.remove(item)
            return;
        }
        
        item.hidden = true
        updateItems()
    }

    function handleItemClick(e) {
        selectItem(e.detail.item)
    }

    function handleContextMenu(e) {
        editItem = true
    }

    function selectItem(item) {
        selectedItem = item
        ensureItemIsVisible(selectedItem)
    }

    function updateItems() {
        stocklist.update()
    }

    function handleKeypadClick(e) {
        const { type, key } = e.target.dataset
        if (type === 'header') {
            keypadType = keypadType === NUMERIC ? UNIT : NUMERIC
            return
        }
        handleKeypress({ type, key }, selectedItem)
        updateItems()
    }

    function scrollIntoView(item) {
        scrollTo({
            container: '#container',
            element: `#${item.id}`,
            offset: -100,
        })
    }

    function ensureItemIsVisible(item) {
        if (!keypadVisible) return
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

    function handleEditItemDone(e) {
        // selectedItem = { ...e.detail.item }
        // stocklist.replaceItem(selectedItem)
        updateItems()
        editItem = false
    }

    function handleEditItemClose(e) {
        editItem = false
    }

    function startOver() {
        // don't set stocklist.isComplete to false until item is edited
        // stocklist.isComplete = false
        // Clear quantities first in case offline, then force
        // fetch latest stocklist by passing stocklist.isComplete true
        stocklist.reset()
        stocklist.load(false)
    }

    function handleTouchStart(e) {
        const isQuantityElement =
            e.target.className.startsWith('quantity') ||
            e.target.parentElement.className.startsWith('quantity')

        if (keypadVisible && !isQuantityElement) keypadVisible = false
    }

    function handleAddClick() {
        stocklist.add({ name: searchValue })
    }

    function handleDelete() {
        stocklist.remove(selectedItem)
    }

    let main
    let savedScrollPos
    function handleSearchFocus() {
        if (!searchValue) savedScrollPos = main.scrollTop
    }

    async function handleSearchClear() {
        await tick()
        main.scrollTop = savedScrollPos
    }

    $: items = $stocklist.length && stocklist.filter(searchValue)
</script>

{#if !items}
    <Loader />
{:else}
    {#if editItem}
        <Edit
            item={selectedItem}
            on:done={handleEditItemDone}
            on:close={handleEditItemClose}
            on:delete={handleDelete}
        />
    {/if}
    <div on:touchstart|stopPropagation={handleTouchStart}>
        <header>
            <div class="left">
                <Search
                    bind:value={searchValue}
                    on:focus={handleSearchFocus}
                    on:clear={handleSearchClear}
                />
                <!-- {#if searchValue.length}
                    <button on:click={() => searchValue=""}>clear</button>
                {/if} -->
            </div>
            <div class="right">
                {#if !items.length && searchValue.length > 3}
                    <button on:click={handleAddClick}>add</button>
                {/if}

            </div>
        </header>
        <main
            bind:this={main}
            id="container"
            class="container"
            on:contextmenu|preventDefault|stopPropagation
        >
            <Items
                {items}
                {selectedItem}
                on:itemclick={handleItemClick}
                on:qtyclick={handleQtyClick}
                on:hide={handleHideClick}
                on:contextmenu={handleContextMenu}
            />
            <footer>
                {#if !searchValue}
                    <Button primary on:click={copyToClipboard} disabled={copied}>
                        {copied ? `Copied ${stocklist.completedItems.length} items!` : 'Complete'}
                    </Button>
                    <Button on:click={startOver} style="margin-top:24px">
                        Start over
                    </Button>
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
        top: 48px;
        display: flex;
        flex-direction: column;
        width: 100vw;
        height: calc(100vh - 48px);
        overflow-y: scroll;
        overflow-x: hidden;
        -webkit-overflow-scrolling: touch;
    }
    header {
        position: fixed;
        top: 0;
        width: 100vw;
        display: flex;
        justify-content: space-between;
        align-items: center;
        height: 48px;
        font-weight: bolder;
        text-transform: uppercase;
        z-index: 100;
        background-color: #000;
        color: #fff;
        -webkit-user-select: none;
        -moz-user-select: none;
        -ms-user-select: none;
    }
    header button {
        width: 100%;
        padding: 2px 8px;
        border: none;
        outline: none;
        font-weight: inherit;
        text-transform: inherit;
        background-color: transparent;
        color: #ddd;
    }
    header button:active {
        background-color: gray;
        color: #ddd;
        padding: 16px;
    }
    .left {
        flex: 100%;
        display: flex;
        align-items: center;
        margin-left: 8px;
    }
    .right {
        width: 30vw;
        display: flex;
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
</style>

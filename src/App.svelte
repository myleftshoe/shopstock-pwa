<script>
    import { onMount, onDestroy, tick } from 'svelte'
    import Toast from 'svelte-toast'
    import stocklist, { textify } from './store'
    import Scrollable, { saveScrollPosition, resetScrollPosition, scrollToElement } from './Scrollable.svelte'
    import Keypad, { keypad, NUMERIC, UNIT } from './keypad'
    import EditDialog from './EditDialog.svelte'
    import Main from './Main.svelte'
    import Header from './Header.svelte'
    import Footer from './Footer.svelte'
    import List from './List.svelte'
    import Loader from './Loader.svelte'
    import Button from './Button.svelte'
    import IconButton from './IconButton.svelte'
    import Search from './Search.svelte'
    import handleKeypress from './handleKeypress'
    import clipboard from './clipboard.js'

    let copiedText = ''
    let searchValue = ''
    let selectedItem = {}

    onMount(stocklist.load)

    function copyToClipboard() {
        const toast = new Toast({position: 'top-center'})
        const items = stocklist.completedItems
        copiedText = textify(items)
        clipboard.copy(copiedText)
        toast.success(`Copied ${items.length} items!`)        
        stocklist.complete()
    }

    function handleQtyClick(e) {
        selectItem(e.detail.item)
        keypad.open(NUMERIC)
    }

    function handleHideClick(e) {
        const item = e.detail.item
        if (item.hidden === true) {
            stocklist.remove(item)
            return
        }
        item.hidden = true
        item.qty = ''
        updateItems()
    }

    function handleItemClick(e) {
        selectItem(e.detail.item)
    }

    function handleEditClick(e) {
        editDialogOpen = true
    }

    function selectItem(item) {
        selectedItem = item
        autoscroll(selectedItem)
    }

    function updateItems() {
        stocklist.update()
    }

    function handleKeypadClick(e) {
        const { type, key } = e.target.dataset
        handleKeypress({ type, key }, selectedItem)
        updateItems()
    }

    function autoscroll(item) {
        if (!keypad.isVisible) return
        const element = `#${item.id}`
        if (keypad.isOverElement(element)) {
            scrollToElement(element, -100)
        }
    }

    function handleKeypadOpen() {
        autoscroll(selectedItem)
    }

    function handleEditItemDone(e) {
        Object.assign(selectedItem, e.detail.item)
        updateItems()
    }

    function startOver() {
        stocklist.reset()
        stocklist.load(false)
    }

    function handleTouchStart(e) {
        const isQuantityElement = e.target.closest(".quantity")
        if (!isQuantityElement) keypad.close()
    }

    function handleAddClick() {
        stocklist.add({ name: searchValue })
    }

    function handleDelete() {
        stocklist.remove(selectedItem)
    }

    function handleSearchFocus() {
        if (!searchValue) saveScrollPosition()
    }

    async function handleSearchClear() {
        await tick()
        resetScrollPosition();
    }

    let items, copied, started
    $: if ($stocklist.length) {
        items = stocklist.filter(searchValue)
        copied = copiedText === textify(stocklist.completedItems)
        started = Boolean(stocklist.completedItems.length)
    }

    let editDialogOpen = false;
</script>

{#if !items}
    <Loader />
{:else}
    <div on:touchstart|stopPropagation|passive={handleTouchStart}>
        <Header>
            <div slot="left">
                <Search
                    bind:value={searchValue}
                    on:focus={handleSearchFocus}
                    on:clear={handleSearchClear}
                />
            </div>
            <div slot="right">
                {#if !items.length && searchValue.length > 3}
                    <Button on:click={handleAddClick}>add</Button>
                {:else if started && !searchValue}
                    {#if copied}
                        <IconButton icon="clipboard-check" on:click={copyToClipboard} aria-label="copy"/>
                    {:else}
                        <IconButton icon="copy" on:click={copyToClipboard} aria-label="copy"/>
                    {/if}
                {/if}
            </div>
        </Header>
        <Scrollable>
            <Main>
                <List
                    {items}
                    {selectedItem}
                    on:itemclick={handleItemClick}
                    on:qtyclick={handleQtyClick}
                    on:hide={handleHideClick}
                    on:editclick={handleEditClick}
                />
                <Footer>
                    {#if !searchValue}
                        <Button on:click={startOver} style="margin-top:24px" disabled={!started}>
                            Start over
                        </Button>
                    {/if}
                </Footer>
            </Main>
        </Scrollable>
    </div>
    <Keypad on:click={handleKeypadClick} on:open={handleKeypadOpen} keypads={[ NUMERIC, UNIT ]}/>
{/if}
{#if editDialogOpen}
    <EditDialog
        bind:open={editDialogOpen}
        item={{...selectedItem}}
        on:done={handleEditItemDone}
        on:delete={handleDelete}
    />
{/if}

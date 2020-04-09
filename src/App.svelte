<script>
    import { onMount, onDestroy, tick } from 'svelte'
    import Toast from 'svelte-toast'
    import stocklist, { textify } from './store'
    import Scrollable, { scrollable } from './Scrollable.svelte'
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
    let editDialogOpen = false;

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
        stocklist.hideOrDelete(e.detail.item)
    }

    function handleItemClick(e) {
        selectItem(e.detail.item)
        keypad.open(NUMERIC)
    }

    function handleLongpress(e) {
        selectItem(e.detail.item)
    }

    function handleEditClick(e) {
        editDialogOpen = true
    }

    function selectItem(item) {
        selectedItem = item
        autoscroll(selectedItem)
    }

    function handleKeypadClick(e) {
        const { type, key } = e.target.dataset
        handleKeypress({ type, key }, selectedItem)
        stocklist.update()
    }

    function autoscroll(item) {
        if (!keypad.isVisible) return
        const element = `#${item.id}`
        if (keypad.isOverElement(element)) {
            scrollable.scrollToElement(element, -100)
        }
    }

    const pacify = { passive: true }
    function handleKeypadOpen() {
        autoscroll(selectedItem)
        scrollable.element.addEventListener('touchmove', handleTouchMove, pacify)
    }

    function handleEditItemDone(e) {
        Object.assign(selectedItem, e.detail.item)
        stocklist.update()
    }

    function startOver() {
        stocklist.reset()
        stocklist.load(false)
    }

    function handleTouchMove(e) {
        e.stopPropagation()
        scrollable.element.removeEventListener('touchmove', handleTouchMove, pacify)
        keypad.close()
    }

    function handleAddClick() {
        stocklist.add({ name: searchValue })
    }

    function handleDelete() {
        stocklist.remove(selectedItem)
    }

    function handleSearchFocus() {
        if (!searchValue) scrollable.saveScrollPosition()
    }

    async function handleSearchClear() {
        await tick()
        scrollable.resetScrollPosition();
    }

    let items, copied, started
    $: if ($stocklist.length) {
        items = stocklist.filter(searchValue)
        copied = copiedText === textify(stocklist.completedItems)
        started = Boolean(stocklist.completedItems.length)
    }

</script>

{#if !items}
    <Loader />
{:else}
    <Header on:touchstart={keypad.close}>
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
        <Main bind:ref={scrollable.element}>
            <List
                {items}
                {selectedItem}
                on:itemclick={handleItemClick}
                on:qtyclick={handleQtyClick}
                on:longpress={handleLongpress}
                on:editclick={handleEditClick}
                on:hide={handleHideClick}
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

<script>
    import { onMount, onDestroy, tick } from 'svelte'
    import Toast from 'svelte-toast'
    import stocklist, { textify } from './store'
    import { saveScrollPosition, resetScrollPosition, scrollToElement } from './scrollHelper.js'
    import Keypad, { keypad } from './Keypad'
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

    let main
    let copiedText = ''
    let searchValue = ''
    let selectedItem = {}
    let editDialogOpen = false

    onMount(stocklist.load)

    // Header handlers
    function handleSearchFocus() {
        if (!searchValue) saveScrollPosition(main)
    }
    async function handleSearchClear() {
        await tick()
        resetScrollPosition(main)
    }
    function handleCopy() {
        const toast = new Toast({ position: 'top-center' })
        const items = stocklist.completedItems
        copiedText = textify(items)
        clipboard.copy(copiedText)
        toast.success(`Copied ${items.length} items!`)
        stocklist.complete()
    }
    function handleAddClick() {
        stocklist.add({ name: searchValue })
    }

    // Item handlers
    function handleItemClick(e) {
        selectItem(e.detail.item)
        keypad.open()
    }
    function handleLongpress(e) {
        keypad.close()
        selectItem(e.detail.item)
    }
    function handleEditClick(e) {
        editDialogOpen = true
    }
    function handleHideClick(e) {
        stocklist.hideOrDelete(e.detail.item)
    }
    function handleEditItemDone(e) {
        Object.assign(selectedItem, e.detail.item)
        stocklist.update()
    }
    function handleDelete() {
        stocklist.remove(selectedItem)
    }

    // Keypad handlers
    function handleKeypadOpen() {
        autoscroll(selectedItem)
    }
    function handleKeypadClick(e) {
        const { type, key } = e.target.dataset
        handleKeypress({ type, key }, selectedItem)
        stocklist.update()
    }

    // Other functions
    function selectItem(item) {
        selectedItem = item
        autoscroll(selectedItem)
    }
    function autoscroll(item) {
        if (!keypad.isOpen) return
        const element = `#${item.id}`
        if (keypad.isOverElement(element)) {
            scrollToElement(main, element, -100)
        }
    }
    function startOver() {
        stocklist.reset()
        stocklist.load(false)
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
        <div>
            <Search bind:value={searchValue} on:focus={handleSearchFocus} on:clear={handleSearchClear} />
        </div>
        <div>
            {#if !items.length && searchValue.length > 3}
                <Button on:click={handleAddClick}>add</Button>
            {:else if started && !searchValue}
                {#if copied}
                    <IconButton icon="clipboard-check" on:click={handleCopy} aria-label="copy" />
                {:else}
                    <IconButton icon="copy" on:click={handleCopy} aria-label="copy" />
                {/if}
            {/if}
        </div>
    </Header>
    <Main bind:ref={main}>
        <List
            {items}
            {selectedItem}
            on:itemclick={handleItemClick}
            on:longpress={handleLongpress}
            on:editclick={handleEditClick}
            on:hideclick={handleHideClick}
        />
        <Footer>
            {#if !searchValue}
                <Button on:click={startOver} style="margin-top:24px" disabled={!started}>Start over</Button>
            {/if}
            {#if !items.length}
                <Button on:click={startOver} style="margin-top:24px" disabled>No results</Button>
            {/if}
        </Footer>
    </Main>
    <Keypad 
        on:click={handleKeypadClick} 
        on:open={handleKeypadOpen} 
        closeOn={[[main, 'touchmove']]}
    />
{/if}
{#if editDialogOpen}
    <EditDialog
        bind:open={editDialogOpen}
        item={{ ...selectedItem }}
        on:done={handleEditItemDone}
        on:delete={handleDelete}
    />
{/if}

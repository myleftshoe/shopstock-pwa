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
    import CopyIcon from './icons/Copy.svelte'
    import ClipboardCheckIcon from './icons/ClipboardCheck.svelte'
    import Search from './Search.svelte'
    import handleKeypress from './handleKeypress'
    import clipboard from './clipboard.js'

    let main, body
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
    async function handleCopy() {
        const toast = new Toast({ position: 'top-center' })
        const items = stocklist.completedItems
        copiedText = textify(items)
        await clipboard.copy(copiedText)
        toast.success(`Copied ${items.length} items!`)
        stocklist.complete()
    }
    function handleAddClick() {
        stocklist.addItem({ name: searchValue })
    }

    // Item handlers
    function handleItemClick(e) {
        selectItem(e.detail.item)
    }
    function handleQtyClick(e) {
        selectItem(e.detail.item)
        keypad.open()
    }
    function handleEditClick(e) {
        editDialogOpen = true
    }
    function handleHideClick(e) {
        stocklist.hideItem(e.detail.item)
    }
    function handleEditItemDone(e) {
        stocklist.updateItem(e.detail.item)
    }
    function handleDelete() {
        stocklist.removeItem(selectedItem)
    }

    // Keypad handlers
    function handleKeypadOpen() {
        autoscroll(selectedItem)
    }
    function handleKeypadClick(e) {
        handleKeypress(e.target.dataset, selectedItem)
        stocklist.updateItem(selectedItem)
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
    <div bind:this={body}>
        <Header>
            <Search bind:value={searchValue} on:focus={handleSearchFocus} on:clear={handleSearchClear} />
            {#if !items.length && searchValue.length > 3}
                <Button on:click={handleAddClick}>add</Button>
            {:else if started && !searchValue}
                {#if copied}
                    <IconButton on:click={handleCopy} aria-label="copy">
                        <ClipboardCheckIcon/>
                    </IconButton>
                {:else}
                    <IconButton on:click={handleCopy} aria-label="copy">
                        <CopyIcon/>
                    </IconButton>
                {/if}
            {/if}
        </Header>
        <Main bind:ref={main}>
            <List
                {items}
                {selectedItem}
                on:itemclick={handleItemClick}
                on:qtyclick={handleQtyClick}
                on:editclick={handleEditClick}
                on:hideclick={handleHideClick}
                on:deleteclick={handleDelete}
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
    </div>
    <Keypad 
        on:click={handleKeypadClick} 
        on:open={handleKeypadOpen}
        {body}
        closeExclusionSelectors={['.quantity']}
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

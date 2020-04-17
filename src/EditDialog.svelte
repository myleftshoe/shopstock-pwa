<script>
    export let item = {}
    export let open = false
    import Button from './Button.svelte'
    import IconButton from './IconButton.svelte'
    import TimesIcon from './icons/Times.svelte'
    import CheckIcon from './icons/Check.svelte'

    import { createEventDispatcher } from 'svelte'
    const dispatch = createEventDispatcher()

    function handleSubmit(e) {
        open = false
        if (item.notes) 
            item.notes = item.notes.trim()
        dispatch('done', { item })
    }

    function handleClose(e) {
        open = false
    }

    function handleDelete(e) {
        open = false
        dispatch('delete')
    }
</script>

<div class="container">
    <form on:submit|preventDefault|stopPropagation={handleSubmit}>
        <input
            id="itemname"
            required
            type="text"
            bind:value={item.name}
            placeholder="item name"
            aria-label="item name"
        />
        <textarea id="notes" rows="4" placeholder="notes" bind:value={item.notes} aria-label="notes" />
        <Button type="submit" aria-label="submit" size="2x" style="margin:16px 24px; font-size:1.33em">
            DONE
        </Button>
    </form>
    <div class="actions">
        <Button type="button" on:click={handleDelete} style="color: #777;">Delete this item permanently</Button>
    </div>
</div>

<style>
    .container {
        height: calc(100vh - 48px);
        width: 100vw;
        margin: 0;
        padding: 0;
        display: flex;
        flex-direction: column;
        justify-content: space-between;
        align-items: center;
        background-color: #f9f6ef;
        position: fixed;
        top: 48px;
        z-index: 101;
        overflow: hidden;
    }
    form {
        display: flex;
        flex-direction: column;
        justify-content: center;
        align-items: center;
    }
    input[type='text'] {
        font-size: x-large;
        text-align: center;
        align-self: center;
        background-color: transparent;
        border: none;
        border-bottom: 1px solid #ddd;
        outline: none;
        margin: 8px 16px;
        padding: 8px 0;
        padding-bottom: 12px;
        width: calc(100% - 32px);
    }
    input[type='text']:focus {
        border-bottom: 1px solid #777;
    }
    input[type='text']::-ms-clear {
        display: none;
    }
    textarea {
        font-size: large;
        background-color: transparent;
        border: none;
        outline: none;
        padding: 8px 16px;
        resize: none;
        width: calc(100vw - 32px);
    }
    .actions {
        display: flex;
        margin-bottom: 48px;
    }
</style>

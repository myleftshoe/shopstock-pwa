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

<form on:submit|preventDefault|stopPropagation={handleSubmit}>
    <div class="itemname">
        <input
            id="itemname"
            required
            type="text"
            bind:value={item.name}
            placeholder="item name"
            aria-label="item name"
        />
    </div>
    <textarea id="notes" rows="3" placeholder="NOTES" bind:value={item.notes} aria-label="notes" />
    <div class="actions">
        <Button type="submit" aria-label="submit" size="2x" style="color:#5fc9f8; margin:16px 24px">
            DONE
        </Button>
    </div>
    <Button type="button" on:click={handleDelete} style="color: #777;">Delete this item permanently</Button>
</form>

<style>
    form {
        height: calc(100vh - 48px);
        width: 100vw;
        margin: 0;
        padding: 0;
        display: flex;
        flex-direction: column;
        justify-content: flex-start;
        align-items: center;
        background-color: #f9f6ef;
        position: fixed;
        top: 48px;
        z-index: 101;
        overflow: hidden;
    }
    .itemname {
        display: flex;
        align-items: center;
        justify-items: center;
        background-color: transparent;
        width: 100%;
        margin: 8px;
    }
    input[type='text'] {
        font-size: x-large;
        text-align: center;
        align-self: center;
        background-color: transparent;
        border: none;
        border-bottom: 1px solid #ddd;
        outline: none;
        margin: 0 16px;
        padding: 8px 16px;
        width: 100%;
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
        margin-bottom: 16px;
    }
</style>

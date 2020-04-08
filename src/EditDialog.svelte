<script>
    export let item = {}
    export let open = false
    import Button from './Button.svelte'
    import { createEventDispatcher } from 'svelte'
    const dispatch = createEventDispatcher()

    function handleSubmit(e) {
        e.preventDefault()
        e.stopPropagation()
        open = false;
        dispatch('done', { item })
    }

    function handleClose(e) {
        e.preventDefault()
        e.stopPropagation()
        open = false;
        dispatch('close')
    }

    function handleDelete(e) {
        e.preventDefault()
        e.stopPropagation()
        open = false;
        dispatch('delete')
    }

    $: console.log('EditDialog rendering' )
</script>
<form on:submit|preventDefault|stopPropagation={handleSubmit}>
    <div class="itemname">
        <input
            id="itemname"
            required
            type="text"
            bind:value={item.name}
            placeholder="Enter item name"
        />
    </div>
    <textarea id="notes" rows="4" placeholder="Notes" bind:value={item.notes} />
    <div class="actions">
        <button
            on:click={handleClose}
        >
            <i class="fas fa-times" />
        </button>
        <button type="submit">
            <i class="fas fa-check" />
        </button>
    </div>
    <Button 
        on:click={handleDelete}
        style="color: #333;"
    >
        Delete this item permanently
    </Button>
</form>

<style>
    form {
        height: 100vh;
        width: 100vw;
        margin: 0;
        padding: 0;
        display: flex;
        flex-direction: column;
        justify-content: flex-start;
        align-items: center;
        background-color: #f9f6ef;
        position: fixed;
        top: 0;
        z-index: 101;
        overflow: hidden;
    }
    .itemname {
        flex-basis: 100px;
        display: flex;
        align-items: center;
        justify-items: center;
        background-color: transparent;
        width: 100%;
    }
    input[type='text'] {
        font-size: 24px;
        text-align: center;
        align-self: center;
        background-color: transparent;
        border: none;
        border-bottom: 1px solid #000;
        outline: none;
        margin: 0 16px;
        padding: 8px 16px;
        width: 100%;
    }
    input[type='text']:focus {
        border-bottom: 1px solid #000;
    }
    input[type='text']::-ms-clear {
        display: none;
    }
    textarea {
        font-size: 20px;
        background-color: transparent;
        /* border: 1px solid #777; */
        border:none;
        outline: none;
        padding: 8px 16px;
        resize: none;
        width: calc(100vw - 64px);
    }
    textarea:focus {
        /* border: 1px solid #000; */
    }
    .actions {
        display: flex;
    }
    button {
        border: none;
        outline: none;
        background: none;
        font-size: 32px;
        padding: 16px;
        margin: 16px;
        color: #333;
    }
</style>

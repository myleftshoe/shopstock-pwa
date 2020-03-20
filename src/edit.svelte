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
        background-color: #ddd;
        position: fixed;
        top: 0;
        z-index: 1;
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
        border: 2px solid yellowgreen;
        outline: none;
        margin: 0 16px;
        padding: 8px 16px;
        border-radius: 7px;
        width: 100%;
    }
    input[type='text']:focus {
        background-color: white;
    }
    input[type='text']::-ms-clear {
        display: none;
    }
    textarea {
        font-size: 20px;
        background-color: transparent;
        border: 2px solid yellowgreen;
        outline: none;
        padding: 8px 16px;
        border-radius: 7px;
        resize: none;
        width: calc(100vw - 64px);
    }
    textarea:focus {
        background-color: white;
    }
    .actions {
        flex-basis: 100px;
        display: flex;
    }
    .primary {
        font-weight: bold;
    }
    .secondary {
        opacity: 50%;
    }
    button {
        min-width: 128px;
        margin: 16px;
        border: none;
        outline: none;
        text-transform: uppercase;
        font-size: 18px;
        padding: 16px;
        font-weight: bold;
        user-select: none;
        border-radius: 7px;
    }
    button:active {
        background-color: grey;
    }
</style>

<script>
    export let item = {}

    import { scale } from 'svelte/transition'
    import { createEventDispatcher } from 'svelte'
    const dispatch = createEventDispatcher()

    // introduced cancelling to stop ms edge submitting after cancel
    let cancelling = false
    function handleSubmit(e) {
        if (!cancelling) dispatch('done', { item })
    }

    function handleCancel() {
        cancelling = true
        dispatch('cancel')
    }
</script>

<form transition:scale on:submit|preventDefault|stopPropagation={handleSubmit}>
    <div class="itemname">
        <input
            autofocus
            id="itemname"
            required
            type="text"
            bind:value={item.name}
            placeholder="Enter item name"
        />
    </div>
    <textarea
        id="notes"
        placeholder="Notes"
        rows="10"
        bind:value={item.notes}
    />
    <div class="actions">
        <!-- 
            For some reason pressing enter in the itemname input would fire the cancel button.
            Set form=donothing (a non-existing form) fixes it. Moving the cancel button after submit works also.
        -->
        <button class="secondary" form="donothing" on:click={handleCancel}>
            cancel
        </button>
        <button class="primary" type="submit">done</button>
    </div>
</form>

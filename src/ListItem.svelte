<script>
    export let item
    export let selected = false
    let timeout;

    import IconButton from './IconButton.svelte'

    import { createEventDispatcher, tick } from 'svelte'
    const dispatch = createEventDispatcher()

    const states = {
        init: { nextState: 'selected' },
        selected: { nextState: 'edit' },
        edit: { nextState: 'selected' },
    }

    async function handleItemClick(e) {
        dispatch('itemclick', { item })
        await tick()
        state = states[state].nextState
        if (state === 'edit') 
            timeout = setTimeout(() => state = 'selected', 2000)
        else 
            clearTimeout(timeout)
    }

    async function handleQtyClick(e) {
        dispatch('qtyclick', { item })
        await tick()
        state = 'selected'
    }

    function handleEditClick(e) {
        e.stopPropagation()
        dispatch('editclick', { item })
    }

    function animateRemove(element, onComplete) {
        requestAnimationFrame(() => {
            element.style.transform = 'scaleY(0)'
            element.style.transformOrigin = 'center'
            element.style.opacity = 0.3
            const handleTransitionend = () => {
                element.removeEventListener('transitionend', handleTransitionend)
                onComplete()
            }
            element.addEventListener('transitionend', handleTransitionend)
        })
    }

    function handleHideClick(e) {
        const element = e.target.closest('.row')
        animateRemove(element, () => dispatch('hideclick', { item }))
    }

    function handleDeleteClick(e) {
        const element = e.target.closest('.row')
        animateRemove(element, () => dispatch('deleteclick', { item }))
    }

    let div
    $: state = !selected ? 'init' : state
</script>

<svelte:options immutable={true} />
<div
    bind:this={div}
    id={item.id}
    data-name={item.name}
    class={`row ${state}`}
    style={item.hidden && 'opacity: .7'}
    on:contextmenu|preventDefault
>
    <div class="left" on:click={handleItemClick}>
        <div>{item.name}</div>
        {#if item.notes}
            <div class="notes">{item.notes}</div>
        {/if}
    </div>
    <div class="editbutton" class:visible={state === 'edit'} on:click={handleEditClick}>
        <IconButton solid={false} icon="edit" style="color: #333; pointer-events: none;" aria-label="edit item" />
    </div>
    {#if state === 'edit'}
        {#if item.hidden}
            <div class={`right hide unit ${state}`} on:click|stopPropagation={handleDeleteClick}>
                delete
            </div>
        {:else}
            <div class={`right hide unit ${state}`} on:click|stopPropagation={handleHideClick}>
                hide
            </div>
        {/if}
    {:else}
        <div class={`right ${state} quantity`} on:click={handleQtyClick}>
            {item.qty}
            <!-- <input type=number tabindex='0' class='quantity' on:click={handleQtyClick} value={item.qty}/> -->
            <div class="unit">{item.unit}</div>
        </div>
    {/if}
</div>

<style>
    .row {
        display: flex;
        flex-direction: row;
        justify-content: space-between;
        margin-top: 1px;
        flex: 0 0 auto;
        transition: transform 0.3s ease, opacity 0.3s ease;
        max-height: 100px;
        user-select: none;
        -webkit-user-select: none;
        -moz-user-select: none;
        -ms-user-select: none;
        background-color: #f9f6ef;
    }
    .left {
        padding: 16px 12px;
        border: none;
        flex-basis: 100%;
    }
    .right {
        display: flex;
        flex-direction: column;
        width: 30vw;
        /* flex-basis: content; */
        padding: 5px;
        justify-content: center;
        align-items: center;
        background-color: #aee1cd;
    }
    .selected {
        background-color: #aee1cd;
    }
    .edit {
        background-color: #aee1cd;
    }
    .editbutton {
        display: flex;
        align-items:center;
        justify-content: center;
        visibility: hidden;
    }
    .visible {
        visibility: visible;
    }
    .unit {
        font-size: 10px;
    }
    .notes {
        font-size: 12px;
        margin-top: 8px;
    }
    .hide {
        text-transform: uppercase;
        font-size: 10px;
    }
</style>

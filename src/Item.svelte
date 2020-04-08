<script>
    export let item
    export let selected = false

    import IconButton from './IconButton.svelte'

    import { createEventDispatcher, tick } from 'svelte'
    const dispatch = createEventDispatcher()

    const states = {
        init: { nextState: 'selected'},
        selected: { nextState: 'edit'},
        edit: { nextState: 'selected' } 
    }

    async function handleItemClick(e) {
        dispatch('itemclick', { item })
        await tick()
        state = 'selected';
    }

    async function handleQtyClick(e) {
        dispatch('qtyclick', { item })
        await tick()
        state = 'selected';
    }

    async function handleContextMenu(e) {
        dispatch('itemclick', { item })
        await tick()
        state = 'edit'
    }

    function handleEditClick(e) {
        dispatch('editclick', { item })
    }

    function handleHideClick(e) {
        const element = e.target.closest('.row')
        element.style.transform = 'scaleX(0)'
        element.style.opacity = 0.3;
        const dispatchHide = () => {
            element.removeEventListener('transitionend', dispatchHide);
            dispatch('hide', { item })
        }
        element.addEventListener('transitionend', dispatchHide);
    }
    
    $: state = !selected ? 'init' : state 
</script>

<div
    id={item.id}
    data-name={item.name}
    class={`row ${state}`}
    style={item.hidden && 'opacity: .7'}
    on:contextmenu|preventDefault={handleContextMenu}
>
    <div class="left" on:click|stopPropagation={handleItemClick}>
        <div>{item.name}</div>
        {#if item.notes}
            <div class="notes">{item.notes}</div>
        {/if}
    </div>
    <div class='editbutton' class:visible={state === 'edit'}>
        <IconButton solid={false} icon='edit' style="color: #333" on:click={handleEditClick}></IconButton>
    </div>
    {#if state === 'edit'}
        <div class={`right hide ${state}`} on:click|stopPropagation={handleHideClick}>
            <div class="unit">{item.hidden ? 'delete': 'hide'}</div>
        </div>
    {:else}
        <div class={`right ${state} quantity`} on:click|stopPropagation={handleQtyClick}>
            <div tabindex="0">{item.qty}</div>
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
        display:flex;
        align-items: center;
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

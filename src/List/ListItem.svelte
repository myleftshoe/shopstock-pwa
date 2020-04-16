<script>
    export let item
    export let selected = false
    let timeout

    const INIT = Symbol('init')
    const SELECTED = Symbol('selected')
    const EDIT = Symbol('edit')

    import IconButton from './IconButton.svelte'
    import EditIcon from './icons/Edit.svelte'
    import ListTextButton from './ListTextButton.svelte'
    import IconButton from '../IconButton.svelte'

    import { createEventDispatcher, tick } from 'svelte'
    const dispatch = createEventDispatcher()

    let state
    const { nextState, setState, select } = {
        nextState: {
            [INIT]: SELECTED,
            [SELECTED]: EDIT,
            [EDIT]: SELECTED,
        },
        setState(newState) { 
            state = newState 
        },
        select() {
            setState(SELECTED)
        }
    }

    async function handleItemClick(e) {
        dispatch('itemclick', { item })
        await tick()
        state = nextState[state]
        if (state === EDIT) timeout = setTimeout(select, 2000)
        else clearTimeout(timeout)
    }

    async function handleQtyClick(e) {
        dispatch('qtyclick', { item })
        await tick()
        select()
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
    $: state = !selected ? INIT : state
</script>

<svelte:options immutable={true} />
<div
    bind:this={div}
    id={item.id}
    data-name={item.name}
    class="row"
    class:selected={state !== INIT}
    style={item.hidden && 'opacity: .7'}
    on:contextmenu|preventDefault
    on:click={handleItemClick}
>
    <div class="item">
        <div>{item.name}</div>
        {#if item.notes}
            <div class="notes">{item.notes}</div>
        {/if}
    </div>
    <div class="actions" class:visible={state === EDIT}>
        <IconButton 
            aria-label="edit item" 
            on:click={handleEditClick} 
            color="#333" 
        >
            <EditIcon/>
        </IconButton>
    </div>
    <div class="quantity">
        {#if state === EDIT}
            {#if item.hidden}
                <ListTextButton subtext="DELETE" on:click={handleDeleteClick} />
            {:else}
                <ListTextButton subtext="HIDE" on:click={handleHideClick} />
            {/if}
        {:else}
            <ListTextButton text={item.qty} subtext={item.unit} on:click={handleQtyClick} />
            <!-- <input type=number tabindex='0' class='quantity' on:click={handleQtyClick} value={item.qty}/> -->
        {/if}
    </div>
</ListItemWrapper>

<style>
    .row {
        display: flex;
        flex-direction: row;
        justify-content: space-between;
        align-items: center;
        /* margin-top: 1px; */
        border-top: 1px solid #888;
        flex: 0 0 3.33em;
        transition: transform 0.3s ease, opacity 0.3s ease;
        max-height: 100px;
        user-select: none;
        -webkit-user-select: none;
        -moz-user-select: none;
        -ms-user-select: none;
        background-color: #f9f6ef;
    }
    .selected {
        background-color: #aee1cd;
    }
    .item {
        padding: 12px 12px;
        border: none;
        flex-basis: 100%;
    }
    .quantity {
        flex: 0 0 20vw;
        padding: 5px;
        background-color: #aee1cd;
        align-self: stretch;
    }
    .actions {
        visibility: hidden;
    }
    .visible {
        visibility: visible;
    }
    .notes {
        font-size: x-small;
        margin-top: 4px;
    }
</style>

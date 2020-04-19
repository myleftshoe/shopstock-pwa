<script>
    export let item
    export let selected = false
    let timeout

    const INIT = Symbol('init')
    const SELECTED = Symbol('selected')
    const EDIT = Symbol('edit')

    import IconButton from '../IconButton.svelte'
    import EyeSlashIcon from '../icons/EyeSlash.svelte'
    import TrashIcon from '../icons/Trash.svelte'
    import EditIcon from '../icons/Edit.svelte'
    import ListTextButton from './ListTextButton.svelte'

    import { createEventDispatcher, tick } from 'svelte'
    const dispatch = createEventDispatcher()

    let state
    const { nextState, setState, select } = {
        nextState: {
            [INIT]: EDIT,
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
    {#if state === EDIT}
        <div class="actions">
            {#if item.hidden}
                <IconButton aria-label="delete item" on:click={handleDeleteClick} color="#333"><TrashIcon/></IconButton>
            {:else}
                <IconButton aria-label="hide item" on:click={handleHideClick} color="#333"><EyeSlashIcon/></IconButton>
            {/if}
            <IconButton aria-label="edit item" on:click={handleEditClick} color="#333"><EditIcon/></IconButton>
        </div>
    {/if}
    <div class="quantity">
        <ListTextButton text={item.qty} subtext={item.unit} on:click={handleQtyClick} />
    </div>
</div>

<style>
    .row {
        display: flex;
        flex-direction: row;
        justify-content: space-between;
        align-items: center;
        border-top: 1px solid #888;
        flex: 0 0 3.33em;
        transition: transform 0.3s ease, opacity 0.3s ease;
        max-height: 100px;
        user-select: none;
        -webkit-user-select: none;
        -moz-user-select: none;
        -ms-user-select: none;
        background-color: var(--paper-color);
    }
    .selected {
        background-color: var(--primary-color);
    }
    .item {
        padding: 12px 12px;
        border: none;
        flex-basis: 100%;
    }
    .quantity {
        flex: 0 0 20vw;
        padding: 5px;
        background-color: var(--primary-color);
        align-self: stretch;
    }
    .actions {
        position: absolute;
        right: calc(20vw + 17px);
        display:flex;
        background-color: var(--primary-color);
        box-shadow: -20px 0 10px var(--primary-color);
    }
    .notes {
        font-size: x-small;
        margin-top: 4px;
    }
</style>

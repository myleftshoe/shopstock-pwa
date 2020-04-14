<script>
    export let item
    export let selected = false
    let timeout

    import ListItemWrapper from './ListItemWrapper.svelte'
    import ListTextButton from './ListTextButton.svelte'
    import IconButton from '../IconButton.svelte'

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
            timeout = setTimeout(() => (state = 'selected'), 2000)
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
<ListItemWrapper {item} selected={state !== 'init'}>
    <div class="left" on:click={handleItemClick}>
        <div>{item.name}</div>
        {#if item.notes}
            <div class="notes">{item.notes}</div>
        {/if}
    </div>
    <div class="actions" class:visible={state === 'edit'}>
        <IconButton
            icon="edit"
            solid={false}
            aria-label="edit item"
            on:click={handleEditClick}
            style="color: #333;"
        />
    </div>
    <div class="right">
        {#if state === 'edit'}
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
    .left {
        padding: 16px 12px;
        border: none;
        flex-basis: 100%;
    }
    .right {
        width: 30vw;
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
        font-size: 12px;
        margin-top: 8px;
    }
</style>

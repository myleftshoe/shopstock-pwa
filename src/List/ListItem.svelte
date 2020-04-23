<script>
    export let item
    export let selected = false

    import IconButton from '../IconButton.svelte'
    import EyeSlashIcon from '../icons/EyeSlash.svelte'
    import TrashIcon from '../icons/Trash.svelte'
    import EditIcon from '../icons/Edit.svelte'
    import ListTextButton from './ListTextButton.svelte'

    import { createEventDispatcher, tick } from 'svelte'
    const dispatch = createEventDispatcher()

    async function handleItemClick(e) {
        dispatch('itemclick', { item })
    }

    async function handleQtyClick(e) {
        dispatch('qtyclick', { item })
    }

</script>

<svelte:options immutable={true} />
<div
    id={item.id}
    data-name={item.name}
    class="row"
    class:selected
    on:contextmenu|preventDefault
    on:click={handleItemClick}
>
    <div class="item">
        <div>{item.name}</div>
        {#if item.notes}
            <div class="notes">{item.notes}</div>
        {/if}
    </div>
    <div class="quantity warehouse">
        <ListTextButton text={item.whqty} subtext={item.whunit} />
    </div>
    <div class="quantity shop">
        <ListTextButton text={item.qty} subtext={item.unit} on:click={handleQtyClick}/>
    </div>
</div>

<style>
    .row {
        display: flex;
        flex-direction: row;
        justify-content: space-between;
        align-items: center;
        border-top: 1px solid #aaa;
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
        align-self: stretch;
    }
    .shop {
        background-color: var(--primary-color);
    }
    .warehouse {
        background-color: none;        
    }
    .notes {
        font-size: x-small;
        margin-top: 4px;
    }
</style>

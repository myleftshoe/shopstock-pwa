<style>
    .row {
        display: flex;
        flex-direction: row;
        justify-content: space-between;
        margin-top: 1px;
        background-color: #f9f6ef;
        flex: 0 0 auto;
    }
    .selected {
        background-color: #aee1cd;
    }
    .item {
        padding: 16px 12px;
        border: none;
        background-color: transparent;
        flex-basis: 100%;
    }
    .quantity {
        display: flex;
        flex-direction: column;
        width: 30vw;
        padding: 5px;
        background-color: #aee1cd;
        justify-content: center;
        align-items: center;
    }
    .unit {
        font-size: 10px;
    }
    .notes {
        font-size: 12px;
        margin-top: 8px;
    }
</style>

<script>
    export let item
    export let selected = false

    import { createEventDispatcher } from 'svelte'
    const dispatch = createEventDispatcher()

    function handleItemClick(e) {
        const target = e.target
        if (selected) {
            target.readOnly = false
            target.focus()
        } else {
            target.readOnly = true
        }
        dispatch('itemclick', { item, target })
    }

    function handleQtyClick(e) {
        const target = e.target
        dispatch('qtyclick', { item, target })
    }
</script>

<div id={item.id} data-name={item.name} class="row" class:selected>
    <div class="item" on:click={handleItemClick}>
        <div>{item.name}</div>
        {#if item.notes}
            <div class="notes">{item.notes}</div>
        {/if}
    </div>
    <div class="quantity" on:click={handleQtyClick}>
        <div tabindex="0">{item.qty}</div>
        <!-- <input type=number tabindex='0' class='quantity' on:click={handleQtyClick} value={item.qty}/> -->
        <div class="unit">{item.unit}</div>
    </div>
</div>

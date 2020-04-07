<script>
    export let item
    export let selected = false
    let deleting    

    import { createEventDispatcher } from 'svelte'
    const dispatch = createEventDispatcher()

    function handleItemClick(e) {
        const target = e.target
        dispatch('itemclick', { item })
        if (selected)
            deleting = true
        else if (deleting)
            deleting = false
    }

    function handleQtyClick(e) {
        const target = e.target
        dispatch('qtyclick', { item })
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

    $: deletable = selected && deleting  
</script>

<div
    id={item.id}
    data-name={item.name}
    class="row"
    class:selected
    class:deletable
    on:click={handleItemClick}
    style={item.hidden && 'opacity: .7'}
    on:contextmenu|preventDefault
>
    <div class="left">
        <div>{item.name}</div>
        {#if item.notes}
            <div class="notes">{item.notes}</div>
        {/if}
    </div>
    {#if deletable}
        <div class="right hide deletable" on:click|stopPropagation={handleHideClick}>
            <div class="unit">hide</div>
        </div>
    {:else}
        <div class="right" on:click|stopPropagation={handleQtyClick}>
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
        background-color: #f9f6ef;
        flex: 0 0 auto;
        transition: transform 0.3s ease, opacity 0.3s ease;
        max-height: 100px;
        user-select: none;
        -webkit-user-select: none;
        -moz-user-select: none;
        -ms-user-select: none;
    }
    .selected {
        background-color: #aee1cd;
    }
    .left {
        padding: 16px 12px;
        border: none;
        background-color: transparent;
        flex-basis: 100%;
    }
    .right {
        display: flex;
        flex-direction: column;
        width: 30vw;
        padding: 5px;
        background-color: #aee1cd;
        justify-content: center;
        align-items: center;
    }
    .deletable {
        background-color: #f77;
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

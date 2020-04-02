<script>
    import { createEventDispatcher } from 'svelte'
    import {swipeToDelete} from './swipe-to-delete.js'
    import Item from './item.svelte'

    export let items = []
    export let selectedItem

    const dispatch = createEventDispatcher();

    function handleSwipeToDelete(e) {
        dispatch('hide', { id: e.detail.element.id })
    }

</script>
<div  use:swipeToDelete={".row"} on:swipecomplete={handleSwipeToDelete}>
    {#each items as item (item.id)}
        <Item {item} selected={selectedItem === item} on:itemclick on:qtyclick on:hideclick on:contextmenu/>
    {/each}
</div>
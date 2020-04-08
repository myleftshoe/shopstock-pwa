<script>
    import { swipeToDelete } from './swipe-to-delete.js'
    import Item from './Item.svelte'

    export let items = []
    export let selectedItem

</script>

{#each items as item (item.id)}
    <Item
        {item}
        selected={selectedItem === item}
        on:itemclick
        on:qtyclick
        on:hide
        on:editclick
    />
{/each}

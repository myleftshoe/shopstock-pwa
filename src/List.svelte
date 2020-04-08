<script>
    import Item from './ListItem.svelte'
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

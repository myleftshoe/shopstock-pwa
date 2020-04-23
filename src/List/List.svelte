<script>
    import Item from './ListItem.svelte'
    export let items = []
    export let selectedItem
</script>

{#each items as item (item.id)}
    <Item
        {item}
        selected={selectedItem.id === item.id}
        on:itemclick
        on:qtyclick
    />
{/each}

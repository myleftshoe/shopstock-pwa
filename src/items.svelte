<script>
    import Item from './item.svelte';
    export let items = []; 
    export let selectedItem;
</script>
{#each items as item, index}
    <Item {item} selected={selectedItem === item}
        on:itemclick
        on:qtyclick
    />
{/each}

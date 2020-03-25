<script>
	import { flip } from 'svelte/animate';

    import Item from './item.svelte'
    export let items = []
    export let selectedItem
</script>

{#each items as item (item.id)}
    <!-- <div
        animate:flip={{duration: 600}}
    > -->
        <Item {item} selected={selectedItem === item} on:itemclick on:qtyclick />
    <!-- </div> -->
{/each}

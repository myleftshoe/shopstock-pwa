<script>
	import { flip } from 'svelte/animate';
    import Item from './item.svelte'
    export let items = []
    export let selectedItem
    export let editMode = false;
</script>

{#each items as item (item.id)}
    <div
        animate:flip={{delay: 0, duration: 500}}
    >
        <Item {item} selected={selectedItem === item} on:itemclick on:qtyclick {editMode} on:hideclick/>
    </div>
{/each}

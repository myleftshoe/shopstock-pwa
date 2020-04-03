<script>
    import { onMount } from 'svelte'
    import items, { keep, discard } from './store/items.js'

    onMount(() => {
        items.load()
    })

    console.log($items)
</script>

{#each $items.filter(discard.hidden) as item (item.id)}
    <div>{item.name}</div>
{/each}


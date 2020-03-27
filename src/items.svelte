<script>
	import { quintOut } from 'eases-jsnext';
	// import { flip } from 'svelte/animate';
    import Item from './item.svelte'
    export let items = []
    export let selectedItem
    export let editMode = false;

    function flip(node, animation, params) {
        const dy = animation.from.top - animation.to.top;
        const d = Math.sqrt(dy * dy);

        return {
            duration: Math.sqrt(d) * 80,
            easing: quintOut,
            css: (t, u) => `transform: translateY(${u * dy}px)`
        };
    }

</script>

{#each items as item (item.id)}
    <div animate:flip>
        <Item {item} selected={selectedItem === item} on:itemclick on:qtyclick {editMode} on:hideclick/>
    </div>
{/each}

<script>
    import { onMount, onDestroy } from "svelte"
    import debounce from 'lodash-es/debounce'
    
    export let value=""
    
    let input;

    const debounced = debounce(e => value = e.target.value, 300)
    onMount(() => input.addEventListener('input', debounced))
    onDestroy(() => input.removeEventListener('input', debounced))
</script>

<input placeholder='Search' bind:this={input}>

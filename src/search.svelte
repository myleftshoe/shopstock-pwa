<script>
    import { onMount, onDestroy } from 'svelte'
    import debounce from 'lodash-es/debounce'

    export let value = ''

    let input = {}

    const debounced = debounce(e => (value = e.target.value), 300)
    onMount(() => input.addEventListener('input', debounced))
    onDestroy(() => input.removeEventListener('input', debounced))

    let placeholder = ''

    const showPlaceholder = () => (placeholder = 'SEARCH')
    const hidePlaceholder = () => (placeholder = '')
</script>

<i class="fas fa-search" on:click={() => input.focus()} />
<input
    bind:this={input}
    type="search"
    {placeholder}
    on:focus={showPlaceholder}
    on:blur={hidePlaceholder}
/>

<style>
    input {
        background: none;
        border: none;
        outline: none;
        padding: 4px;
        margin: 4px;
        color: #ddd;
        font-weight: 600;
    }
    input:focus {
        border-bottom: 1px solid #ddd;
    }
    i {
        padding: 8px;
    }
</style>

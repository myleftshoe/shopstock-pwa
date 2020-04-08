<script>
    import { onMount, onDestroy } from 'svelte'
    import debounce from 'lodash-es/debounce'
    import { createEventDispatcher } from 'svelte'
    import IconButton from './IconButton.svelte'

    const dispatch = createEventDispatcher()

    export let value = ''

    let input = {}

    const debounced = debounce(e => (value = e.target.value), 300)
    onMount(() => input.addEventListener('input', debounced))
    onDestroy(() => input.removeEventListener('input', debounced))

    let placeholder = ''

    const showPlaceholder = () => (placeholder = 'SEARCH')
    const hidePlaceholder = () => (placeholder = '')

    function handleFocus() {
        showPlaceholder()
        dispatch('focus')
    }

    function handleBackClick() {
        value = ''
        input.value = ''
    }

    function handleSearchClick() {
        input.focus()
    }

    $: if (!value) dispatch('clear')
    $: icon = value ? 'arrow-left' : 'search'
</script>

{#if value}
    <IconButton icon="arrow-left" on:click={handleBackClick} aria-label="back"/>
{:else}
    <IconButton icon="search" on:click={handleSearchClick} aria-label="search"/>
{/if}
<input
    bind:this={input}
    type="text"
    autocapitalize="none"
    {placeholder}
    on:focus={handleFocus}
    on:blur={hidePlaceholder}
    aria-label='search'
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

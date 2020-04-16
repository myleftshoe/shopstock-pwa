<script>
    import { onMount, onDestroy } from 'svelte'
    import debounce from 'lodash-es/debounce'
    import { createEventDispatcher } from 'svelte'
    import IconButton from './IconButton.svelte'
    import SearchIcon from './icons/Search.svelte'
    import ArrowLeftIcon from './icons/ArrowLeft.svelte'

    const dispatch = createEventDispatcher()

    export let value = ''

    let input = {}

    const debounced = debounce(e => (value = e.target.value), 300)
    onMount(() => input.addEventListener('input', debounced))
    onDestroy(() => input.removeEventListener('input', debounced))

    let placeholder = ''

    const showPlaceholder = () => (placeholder = 'search')
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
    $: console.log(value)
</script>
<div>
    {#if value}
        <!-- <IconButton icon="arreeeow-left" on:click={handleBackClick} aria-label="back"/> -->
        <IconButton on:click={handleBackClick} aria-label="back">
            <ArrowLeftIcon/>
        </IconButton>
    {:else}
        <IconButton on:click={handleSearchClick} aria-label="search">
            <SearchIcon/>
        </IconButton>
    {/if}
    <input
        {value}
        bind:this={input}
        type="text"
        autocapitalize="none"
        {placeholder}
        on:focus={handleFocus}
        on:blur={hidePlaceholder}
        aria-label='search'
    />
</div>
<style>
    div {
        display:flex;
        align-items:center;
    }
    input {
        background: none;
        border:none;
        outline: none;
        color: #ddd;
        font-size: large;
        width:50vw;
    }
    input:focus {
        border-bottom: 1px solid #555;
    }
</style>

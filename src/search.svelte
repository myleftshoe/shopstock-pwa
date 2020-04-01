<script>
    import { onMount, onDestroy } from 'svelte'
    import debounce from 'lodash-es/debounce'
    import { createEventDispatcher } from 'svelte'
    
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

    function handleClick() {
        if (value) {
            value = "";
            input.value = ""
        }
        else {
            input.focus()
        }
    }

    $: if (!value) dispatch('clear')
    
</script>

<div style="width:50px">
    <i class={value ? "fas fa-times" : "fas fa-search"} on:click={handleClick} />
</div>

<input
    bind:this={input}
    type="text"
    {placeholder}
    on:focus={handleFocus}
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

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

    function handleClick() {
        if (value) {
            value = ''
            input.value = ''
        } else {
            input.focus()
        }
    }

    $: if (!value) dispatch('clear')
    $: icon = value ? 'arrow-left' : 'search'
</script>


<IconButton {icon} on:click={handleClick}/>
<input
    bind:this={input}
    type="text"
    autocapitalize="none"
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

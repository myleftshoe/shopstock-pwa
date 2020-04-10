<script>
    export let icon = 'question'
    export let solid = true
    $: faClass = `${solid ? 'fas' : 'far'} fa-${icon}`
</script>

<button on:click on:contextmenu|preventDefault {...$$restProps}>
    <i class={faClass} />
</button>

<style>
    button {
        color: #fff;
        background: none;
        border: none;
        border-radius: 50%;
        outline: none;
        font-size: 1em;
        width: 3em;
        height: 3em;
    }
</style>

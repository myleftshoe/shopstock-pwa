<style>
    .primary {
        background-color: #aee1cd;
    }
    .secondary {
        background-color: rosybrown;
    }
    button {
        background-color: #aee1cd;
        color: #ddd;
        min-width: 128px;
        margin: 16px;
        border: none;
        outline: none;
        text-transform: uppercase;
        font-size: 18px;
        padding: 16px;
        font-weight: bold;
        user-select: none;
        border-radius: 7px;
    }
    button:active {
        background-color: grey;
        color: #111;
    }
    button:disabled {
        background-color: grey;
        color: #111;
    }
</style>
<script>
    export let primary = false;
    export let secondary = false;
</script>
<button  class:primary class:secondary on:click {...$$restProps}>
    <slot/>
</button>
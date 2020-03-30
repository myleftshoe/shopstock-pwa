<style>
    button {
        background-color: transparent;
        margin:16px;
        border: none;
        outline: none;
        border-radius: 7px;
        color:white;
        padding: 12px 16px;
        font-weight: 600;
        font-size: 16px;
        text-transform: uppercase;
        user-select: none;
    }
    .primary {
        background-color: #aee1cd;
    }
    .floating {
        position:fixed;
        bottom: 10%;
        left: 50%;
        transform: translate(-50%, -50%);
        margin: 0 auto;        
    }
    button:active {
        color: grey;
    }
    button:disabled {
        color: grey;
    }
</style>
<script>
    export let floating = false;
    export let primary = false;
</script>
<button class:floating class:primary on:click {...$$restProps}>
    <slot/>
</button>
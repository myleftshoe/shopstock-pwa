<style>
    button {
        background-color: #232323;
        border: none;
        border-radius: 7px;
        color:white;
        padding: 12px 16px;
        font-weight: 600;
        font-size: 16px;
        text-transform: uppercase;
    }
    .floating {
        position:fixed;
        bottom: 10%;
        left: 50%;
        transform: translate(-50%, -50%);
        margin: 0 auto;        
    }
    button:active {
        background-color: grey;
    }
    button:disabled {
        background-color: grey;
    }
</style>
<script>
    export let floating = false;
</script>
<button class:floating on:click {...$$restProps}>
    <slot/>
</button>
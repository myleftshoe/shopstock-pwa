<script>
    export let type
    export let value
</script>

<button on:click data-type={type} data-key={value}>
    <slot>{value}</slot>
</button>

<style>
    button {
        flex: 1;
        display:flex;
        justify-content: center;
        align-items: center;
        background-color: #333;
        border: 2px solid #111;
        outline: none;
        cursor: pointer;
        color: white;
        font-size: 4vh;
    }
    button:active {
        background-color: #777;
    }
</style>

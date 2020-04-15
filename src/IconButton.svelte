<button on:click on:contextmenu|preventDefault {...$$restProps}>
    <slot/>
</button>

<style>
    button {
        fill: white;
        background: none;
        border: none;
        border-radius: 50%;
        outline: none;
        font-size: 1em;
        width: 3em;
        height: 3em;
        padding:1em;
    }
</style>

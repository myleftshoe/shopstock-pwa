<button on:click on:contextmenu|preventDefault {...$$restProps}>
    <div><slot/></div>
</button>

<style>
    button {
        fill: white;
        background: none;
        border: none;
        border-radius: 50%;
        outline: none;
        width: 3em;
        height: 3em;
        /* margin:8px; */
    }
    div {
        height:1.5em;
    }
</style>

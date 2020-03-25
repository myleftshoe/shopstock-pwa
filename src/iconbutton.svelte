<style>
    div {
        display:flex;
        flex-direction: row;
        justify-content: flex-start;
        align-items:center;
        width:100vw;
    }
    button {
        display: flex;
        align-items: center;
        justify-content: center;
        width: 2em;
        height: 2em;
        font-size:3em; 
        margin:.25em;
        padding:.5em;
        border: none;
        /* background-color: transparent; */
        border-radius: 50%;
    }
    button:active {
        background-color: #aee1cd;
    }

</style>
<script>
    export let icon = "";
</script>
<div>
    <button on:contextmenu|preventDefault on:click>
        <i class={icon}/>
    </button>
    <slot/>
</div>

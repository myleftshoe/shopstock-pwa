<script>
    export let text = ''
    export let subtext = ''
</script>

<button on:click|stopPropagation>
    <span class="text">{text}</span>
    {#if text && subtext}
        <div class="spacer" />
    {/if}
    <span class="subtext" class:empty={subtext === ''}>{subtext}</span>
</button>

<style>
    button {
        display: flex;
        flex-direction: column;
        align-items: center;
        justify-content: center;
        width: 100%;
        height: 100%;
        border: none;
        outline: none;
        background-color: transparent;
    }
    .text {
        font-size: large;
    }
    .subtext {
        font-size: 10px;
    }
    .spacer {
        flex: 0 0 2px;
    }
</style>

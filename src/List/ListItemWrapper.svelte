<script>
    export let item = {}
    export let selected = false
    let div
</script>

<div
    bind:this={div}
    id={item.id}
    data-name={item.name}
    class:selected
    style={item.hidden && 'opacity: .7'}
    on:contextmenu|preventDefault
>
    <slot />
</div>

<style>
    div {
        display: flex;
        flex-direction: row;
        justify-content: space-between;
        align-items: center;
        margin-top: 1px;
        flex: 0 0 auto;
        transition: transform 0.3s ease, opacity 0.3s ease;
        max-height: 100px;
        user-select: none;
        -webkit-user-select: none;
        -moz-user-select: none;
        -ms-user-select: none;
        background-color: #f9f6ef;
    }
    .selected {
        background-color: #aee1cd;
    }
</style>

<script>
    import Icon from './Icon.svelte'
</script>
<div on:click on:contextmenu|preventDefault {...$$restProps}>
    <Icon {...$$restProps}><slot/></Icon>
</div>

<style>
    div {
        display:inline-block;
        border: none;
        border-radius: 50%;
        outline: none;
        padding:.75em;
    }
</style>

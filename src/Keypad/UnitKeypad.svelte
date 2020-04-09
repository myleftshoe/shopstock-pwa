<script>
    import KeyRow from './KeyRow.svelte'
    import Key from './Key.svelte'
    const type = 'unit'
</script>

<KeyRow>
    <Key {type} value="bags" />
    <Key {type} value="black tubs" />
</KeyRow>
<KeyRow>
    <Key {type} value="boxes" />
    <Key {type} value="trays" />
</KeyRow>
<KeyRow>
    <Key {type} value="bin" />
    <Key {type} value="shelf" />
</KeyRow>

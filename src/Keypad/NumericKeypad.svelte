<script>
    import KeyRow from './KeyRow.svelte'
    import Key from './Key.svelte'
    import Icon from '../Icon.svelte'
    import BackspaceIcon from '../icons/Backspace.svelte'
</script>

<KeyRow>
    <Key type="number" value="1" />
    <Key type="number" value="2" />
    <Key type="number" value="3" />
    <Key type="fraction" value="&frac14" />
</KeyRow>
<KeyRow>
    <Key type="number" value="4" />
    <Key type="number" value="5" />
    <Key type="number" value="6" />
    <Key type="fraction" value="&frac12" />
</KeyRow>
<KeyRow>
    <Key type="number" value="7" />
    <Key type="number" value="8" />
    <Key type="number" value="9" />
    <Key type="fraction" value="&frac34" />
</KeyRow>
<KeyRow>
    <Key type="increment" value="+" />
    <Key type="number" value="0" />
    <Key type="decrement" value="-">&minus</Key>
    <Key type="clear" value="X"><Icon><BackspaceIcon/></Icon></Key>
</KeyRow>

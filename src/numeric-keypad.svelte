
<script>
    import KeyRow from './keyrow.svelte';
    import Key from './key.svelte';
</script>
<KeyRow>
    <Key type='number' value='1'/>
    <Key type='number' value='2'/>
    <Key type='number' value='3'/>
    <Key type='fraction' value='1/4'/>
</KeyRow>
<KeyRow>
    <Key type='number' value='4'/>
    <Key type='number' value='5'/>
    <Key type='number' value='6'/>
    <Key type='fraction' value='1/2'/>
</KeyRow>
<KeyRow>
    <Key type='number' value='7'/>
    <Key type='number' value='8'/>
    <Key type='number' value='9'/>
    <Key type='fraction' value='3/4'/>
</KeyRow>
<KeyRow>
    <Key type='increment' value='+'/>
    <Key type='number' value='0'/>
    <Key type='decrement' value='-'/>
    <Key type='clear' value='X'/>
</KeyRow>

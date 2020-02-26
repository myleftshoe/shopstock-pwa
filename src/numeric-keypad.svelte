
<script>
    import KeyRow from './keyrow.svelte';
    import Key from './key.svelte';
</script>
<KeyRow>
    <Key type='number'>1</Key>
    <Key type='number'>2</Key>
    <Key type='number'>3</Key>
    <Key type='fraction'>1/4</Key>
</KeyRow>
<KeyRow>
    <Key type='number'>4</Key>
    <Key type='number'>5</Key>
    <Key type='number'>6</Key>
    <Key type='fraction'>1/2</Key>
</KeyRow>
<KeyRow>
    <Key type='number'>7</Key>
    <Key type='number'>8</Key>
    <Key type='number'>9</Key>
    <Key type='fraction'>3/4</Key>
</KeyRow>
<KeyRow>
    <Key type='increment'>+</Key>
    <Key type='number'>0</Key>
    <Key type='decrement'>-</Key>
    <Key type='clear'>X</Key>
</KeyRow>

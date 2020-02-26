<style>
    .container { 
        background-color: #000;
        position:absolute;
        bottom:0;
        display: flex;
        flex-direction: column;
        justify-content:flex-end;
        height:50vh;
        width:100vw;
        transition: transform .3s ease;
    }
    .hidden {
        transform:translateY(50vh)
    }
    .unit {
        position: relative;
        display:flex;
        align-items: center;
        justify-content: center;
        /* background: red; */
        /* flex-shrink:1; */
        height:7vh;
        width:100vw;
        color:white;
    }
</style>
<script context='module'>
    // keypad store
    import { writable, get } from 'svelte/store';
    const { subscribe, update } = writable({visible:false, type: 'numeric'});
    export const keypad = {
        subscribe,
        open() { update(current => ({...current, visible:true})) },
        close() { update(current => ({...current, visible:false})) },
        set type(type) { update(current => ({...current, type})) },
        get type() { return get(keypad).type },
        NUMERIC: 'numeric',
        UNIT: 'unit'
    };
</script>
<script>
    import { createEventDispatcher } from 'svelte';
    import NumericKeypad from './numeric-keypad.svelte';
    import UnitKeypad from './unit-keypad.svelte';

    let container;
    
    const dispatch = createEventDispatcher();
    const handleTransitionEnd = () => dispatch($keypad.visible ? 'open' : 'close');
    
    const toggleType = () => keypad.type = $keypad.type === keypad.NUMERIC ? keypad.UNIT : keypad.NUMERIC;

    $:headerText = $keypad.type === keypad.NUMERIC ? 'Choose unit ...' : '';
    $:keypadComponent = $keypad.type === keypad.NUMERIC ? NumericKeypad : UnitKeypad;
</script>

<div bind:this={container} class='container' class:hidden={!$keypad.visible} on:click on:transitionend={handleTransitionEnd}>
    <div class='unit' data-type='header' on:click={toggleType}>{headerText}</div>
    <svelte:component this={keypadComponent} />
</div>

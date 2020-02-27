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
    export const NUMERIC = 'numeric';
    export const UNIT = 'unit';
</script>
<script>
    export let type = NUMERIC;
    export let visible = false;
    import { createEventDispatcher } from 'svelte';
    import NumericKeypad from './numeric-keypad.svelte';
    import UnitKeypad from './unit-keypad.svelte';

    let container;
    
    const dispatch = createEventDispatcher();
    const handleTransitionEnd = () => dispatch(visible ? 'open' : 'close');
    
    const toggleType = () => type = type === NUMERIC ? UNIT : NUMERIC;

    $:headerText = type === NUMERIC ? 'Choose unit ...' : '';
    $:keypadComponent = type === NUMERIC ? NumericKeypad : UnitKeypad;
</script>

<div bind:this={container} class='container' class:hidden={!visible} on:click on:transitionend={handleTransitionEnd}>
    <div class='unit' data-type='header' on:click={toggleType}>{headerText}</div>
    <svelte:component this={keypadComponent} />
</div>

<style>
    .container {
        background-color: #000;
        position: fixed;
        bottom: 0;
        display: flex;
        flex-direction: column;
        justify-content: flex-end;
        height: 50vh;
        width: 100vw;
        transition: transform 0.3s ease;
    }
    .hidden {
        transform: translateY(50vh);
    }
    .unit {
        position: relative;
        display: flex;
        align-items: center;
        justify-content: center;
        height: 7vh;
        width: 100vw;
        color: white;
        -webkit-user-select: none;
        -ms-user-select: none;
        user-select: none;
    }
</style>

<script context="module">
    import NumericKeypad from './numeric-keypad.svelte'
    import UnitKeypad from './unit-keypad.svelte'
    export const NUMERIC = NumericKeypad
    export const UNIT = UnitKeypad
</script>

<script>
    export let type = NUMERIC
    export let visible = false
    import { createEventDispatcher } from 'svelte'

    let container

    const dispatch = createEventDispatcher()
    const handleTransitionEnd = () => dispatch(visible ? 'open' : 'close')

    $: headerText = type === NUMERIC ? 'Choose unit ...' : '[ back ]'
</script>

<div
    id="keypad"
    bind:this={container}
    class="container"
    class:hidden={!visible}
    on:click
    on:transitionend={handleTransitionEnd}
>
    <div class="unit" data-type="header">{headerText}</div>
    <svelte:component this={type} />
</div>

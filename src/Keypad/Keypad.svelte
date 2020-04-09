<script context="module">
    import { writable, get } from 'svelte/store'
    import NumericKeypad from './NumericKeypad.svelte'
    import UnitKeypad from './UnitKeypad.svelte'
    import Button from '../Button.svelte'
    export const NUMERIC = NumericKeypad
    export const UNIT = UnitKeypad
    export const keypad = {
        open(type) {
            if (type) keypad.type = type
            open.set(true)
        },
        close() {
            open.set(false)
        },
        get isOpen() {
            return get(open)
        },
        get type() {
            return get(_type)
        },
        set type(type) {
            _type.set(type)
        },
        isOverElement(element) {
            const elementBottom = document.querySelector(element).getBoundingClientRect().bottom
            const keypadTop = document.getElementById('keypad').getBoundingClientRect().top
            return elementBottom > keypadTop
        },
    }
    const open = writable(false)
    const _type = writable(NUMERIC)
</script>

<script>
    import { createEventDispatcher } from 'svelte'

    const dispatch = createEventDispatcher()
    const handleTransitionEnd = () => dispatch($open ? 'open' : 'close')

    export let keypads = [NUMERIC]
    function handleHeaderClick(e) {
        e.stopPropagation()
        // if (keypads.indexOf(keypads.type) + 1)
        $_type = keypads[keypads.indexOf($_type) + 1] || keypads[0]
    }
</script>

<div id="keypad" class="container" class:hidden={!$open} on:click on:transitionend={handleTransitionEnd}>
    <!-- <div class="header" data-type="header" on:click={handleHeaderClick}> -->
    <div class="header">
        {#each ['bags', 'boxes', 'black tubs', 'trays', 'bin', 'shelf'] as unit}
            <Button data-type="header" data-key={unit} style="text-transform: lowercase; font-weight: 400;">
                {unit}
            </Button>
        {/each}
    </div>
    <svelte:component this={$_type} />
</div>

<style>
    .container {
        background-color: #111;
        position: fixed;
        bottom: 0;
        display: flex;
        flex-direction: column;
        justify-content: flex-end;
        height: 46vh;
        width: 100vw;
        transition: transform 0.3s ease;
    }
    .hidden {
        transform: translateY(50vh);
    }
    .header {
        position: relative;
        display: flex;
        align-items: center;
        /* justify-content: center; */
        height: 8vh;
        width: 100vw;
        color: white;
        -webkit-user-select: none;
        -ms-user-select: none;
        user-select: none;
        overflow-x: scroll;
        overflow-y: hidden;
        -webkit-overflow-scrolling: touch;
        overscroll-behavior-x: none;
        -ms-overscroll-behavior-x: none;
        -ms-scroll-chaining: none;
        -ms-overflow-style: none;
        touch-action: pan-x;
        -ms-touch-action: pan-x;
    }
</style>

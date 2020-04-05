<script context="module">
    import { writable, get } from 'svelte/store'
    import NumericKeypad from './numeric-keypad.svelte'
    import UnitKeypad from './unit-keypad.svelte'
    export const NUMERIC = NumericKeypad
    export const UNIT = UnitKeypad
    export const keypad = {
        open(type) {
            if (type) keypad.type = type
            visible.set(true)
        },
        close() {
            visible.set(false)
        },
        get isVisible() {
            return get(visible)
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
        }
    }
    const visible = writable(false)
    const _type = writable(NUMERIC)
</script>

<script>
    import { createEventDispatcher } from 'svelte'

    const dispatch = createEventDispatcher()
    const handleTransitionEnd = () => dispatch(visible ? 'open' : 'close')

    $: headerText = $_type === NUMERIC ? 'Choose unit ...' : '[ back ]'
</script>

<div
    id="keypad"
    class="container"
    class:hidden={!$visible}
    on:click
    on:transitionend={handleTransitionEnd}
>
    <div class="unit" data-type="header">{headerText}</div>
    <svelte:component this={$_type} />
</div>

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

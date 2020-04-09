<button on:click {...$$restProps}>
    <slot />
</button>

<style>
    button {
        display:flex;
        align-items: center;
        justify-content: center;
        background-color: transparent;
        border: none;
        outline: none;
        border-radius: 7px;
        color: white;
        padding: 12px 16px;
        font-weight: 600;
        font-size: 16px;
        text-transform: uppercase;
        white-space: nowrap;
        -webkit-user-select: none;
        -moz-user-select: none;
        -ms-user-select: none;
    }
    button:active {
        color: grey;
    }
    button:disabled {
        color: grey;
    }
</style>

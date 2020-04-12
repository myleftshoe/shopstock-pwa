<header>
    <slot />
</header>

<style>
    header {
        position: fixed;
        top: 0;
        width: 100vw;
        display: flex;
        justify-content: space-between;
        align-items: center;
        height: 48px;
        font-weight: bolder;
        text-transform: uppercase;
        z-index: 100;
        background-color: #111;
        color: #fff;
        -webkit-user-select: none;
        -moz-user-select: none;
        -ms-user-select: none;
    }
</style>

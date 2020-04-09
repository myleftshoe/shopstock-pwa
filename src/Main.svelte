<style>
    main {
        position: fixed;
        top: 48px;
        display: flex;
        flex-direction: column;
        width: 100vw;
        height: calc(100vh - 48px);
        overflow-y: scroll;
        overflow-x: hidden;
        -webkit-overflow-scrolling: touch;
        overscroll-behavior-y: none;
        -ms-overscroll-behavior-y: none;
        -ms-scroll-chaining: none;
        -ms-overflow-style: none;
        touch-action:pan-y;
        -ms-touch-action: pan-y;
    }
</style>
<script>
    export let ref = undefined
</script>
<main bind:this={ref}>
    <slot/>
</main>
<script context="module">
    import { scrollTo } from 'svelte-scrollto'

    let ref
    let savedScrollPosition

    function saveScrollPosition() {
        const container = ref.firstChild
        savedScrollPosition = container.scrollTop
    }

    function resetScrollPosition() {
        const container = ref.firstChild
        container.scrollTop = savedScrollPosition
    }

    function scrollToElement(element) {
        scrollTo({ element, container: ref.firstChild, offset: -100 })
    }

    export const scrollable = {
        saveScrollPosition,
        resetScrollPosition,
        scrollToElement,
    }
</script>

<div bind:this={ref}>
    <slot />
</div>

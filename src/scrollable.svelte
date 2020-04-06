<script context="module">
    import { scrollTo } from 'svelte-scrollto'
    let ref;
    let savedScrollPosition
    export function saveScrollPosition() {
        const container = ref.firstChild;
        savedScrollPosition = container.scrollTop;                
    }
    export function resetScrollPosition() {
        const container = ref.firstChild;
        container.scrollTop = savedScrollPosition;                
    }
    export function scrollToElement(element) {
        scrollTo({element, container: ref.firstChild, offset: -100 })
    }
</script>
<div bind:this={ref}>
    <slot/>
</div>

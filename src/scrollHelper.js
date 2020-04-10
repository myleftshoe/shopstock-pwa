import { scrollTo } from 'svelte-scrollto'

const savedScrollPositions = new Map()

export function saveScrollPosition(container) {
    savedScrollPositions.set(container, container.scrollTop)
}

export function resetScrollPosition(container) {
    container.scrollTop = savedScrollPositions.get(container)
}

export function scrollToElement(container, element) {
    scrollTo({ element, container, offset: -100 })
}

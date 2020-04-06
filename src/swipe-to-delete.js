const pacify = { passive: true }

export function swipeToDelete(node, selector, threshold = 50) {
    let x;
    let swiped;
    let maxX = 100;
    let element;

    function handleTouchstart(e) {
        swiped = false;
        x = e.touches[0].clientX;
        if (x > maxX) return;
        element = e.target.closest(selector);
        console.log(element)
        node.addEventListener('touchmove', handleTouchmove, pacify);
        node.addEventListener('touchend', handleTouchend, pacify);
        node.dispatchEvent(new CustomEvent('swipestart', {
            detail: { element }
        }));
    }

    function handleTouchmove(e) {
        if (swiped) return
        const dx = e.touches[0].clientX - x;
        if (dx < 0 && Math.abs(dx) > threshold) {
            swiped = true;
            doSwipe()
        }
    }

    function doSwipe() {
        function handleTransitionEnd(e) {
            element.removeEventListener('transitionend', handleTransitionEnd);
            if (e.propertyName === 'transform') {
                node.dispatchEvent(new CustomEvent('swipecomplete', {
                    detail: { element }
                }));
            }
        }
        element.style.transform = 'translateX(-100%)';
        element.addEventListener('transitionend', handleTransitionEnd);
    }

    function handleTouchend(e) {
        node.removeEventListener('touchmove', handleTouchmove, pacify);
        node.removeEventListener('touchend', handleTouchend, pacify);
    }

    node.addEventListener('touchstart', handleTouchstart, pacify);

    return {
        destroy() {
            node.removeEventListener('touchstart', handleTouchstart, pacify);
        }
    };
}
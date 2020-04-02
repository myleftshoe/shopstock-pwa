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
		node.addEventListener('touchmove', handleTouchmove);
        node.addEventListener('touchend', handleTouchend);
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
		node.removeEventListener('touchmove', handleTouchmove);
		node.removeEventListener('touchend', handleTouchend);
	}

	node.addEventListener('touchstart', handleTouchstart);

	return {
		destroy() {
			node.removeEventListener('touchstart', handleTouchstart);
		}
	};
}
export function longpress(node, duration = 500) {
	let timer;
	
	const handleTouchstart = () => {
		timer = setTimeout(() => {
			node.dispatchEvent(
				new CustomEvent('longpress')
			);
		}, duration);
	};
	
	const handleTouchend = () => {
		clearTimeout(timer)
	};

	node.addEventListener('touchstart', handleTouchstart);
	node.addEventListener('touchend', handleTouchend);

	return {
		update(newDuration) {
			duration = newDuration;
		},
		destroy() {
			node.removeEventListener('touchstart', handleTouchstart);
			node.removeEventListener('touchend', handleTouchend);
		}
	};
}
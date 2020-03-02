<style>
	.container {
		display: flex;
		flex-direction: column;
		width:100vw;
		height:100vh;
		overflow-y: auto;
	}
	.autoscroll {
		overflow-y:hidden;
	}
	#spacer {
		flex-basis:50vh;
		flex-shrink:0;
		/* background-color: #232323; */
	}
</style>
<script>
	import { scrollTo } from "svelte-scrollto";
	import { getItems, persist } from './store.js';
	import Keypad, { NUMERIC, UNIT } from './keypad.svelte';
	import Items from './items.svelte';

	let items = getItems();
	console.table(items);

	let selectedItem = {};

	let autoscroll = false;
	let pointerDown = false;

	let keypadType = NUMERIC;
	let keypadVisible = false;

	function handleQtyClick(e) {
		selectedItem = e.detail.item;
		keypadType = NUMERIC;
		keypadVisible = true;
	}

	function handleItemClick(e) {
		selectedItem = e.detail.item;
		keypadVisible = false;
	}

	function updateItems() {
		items = [...items];
		persist(items); 
	}

	function handleKeypadClick(e) {

		const {type, key} = e.target.dataset;

		switch (type) {
			case 'header': {
				keypadType = keypadType === NUMERIC ? UNIT : NUMERIC;
				return;
			}
			case 'unit': {
				selectedItem.unit = key;
				updateItems();
				// keypad.type = keypad.NUMERIC;
				return;
			}
			case 'fraction': {
				selectedItem.qty = key;
				updateItems();
				return;
			}
			case 'clear': {
				selectedItem.qty = '';
				selectedItem.unit = '';
				updateItems();
				return;
			}
		}

		let qty = Number(selectedItem.qty);
		if (isNaN(qty)) return;

		switch (type) {
			case 'increment': {
				qty++;
				break;
			}
			case 'decrement': {
				qty = qty < 2 ? 0 : qty - 1;
				break;
			}
			case 'number': { 
				qty = Number(`${qty}${key}`);
				break;
			}
		}
		selectedItem.qty =  qty;
		updateItems();
	}

	function handleScroll() {
		if (!autoscroll && pointerDown) 
			keypadVisible = false;
	}

	function ensureItemIsVisible(item) {
		const elementBottom = document.getElementById(item.id).getBoundingClientRect().bottom;
		const bodyMidpoint = document.getElementsByTagName('body')[0].getBoundingClientRect().bottom / 2;
		if (elementBottom > bodyMidpoint) {
			autoscroll = true;
			scrollTo({
				container: '#container', 
				element: `#${item.id}`,
				offset: -200,
				onDone: () => setTimeout(() => {autoscroll = false},1000)
			});
		}
	}

	function handleKeypadOpen() {
		keypadType = NUMERIC;
		ensureItemIsVisible(selectedItem);
	}

</script>
<main id='container' class='container' class:autoscroll 
	on:scroll={handleScroll} 
	on:pointerdown={() => pointerDown = true}
	on:pointerup={() => pointerDown = false}	
>
	<Items {items} {selectedItem} on:itemclick={handleItemClick} on:qtyclick={handleQtyClick}/>
	<div id='spacer'></div>
</main>
<Keypad
	bind:type={keypadType}
	bind:visible={keypadVisible}
	on:click={handleKeypadClick} 
	on:open={handleKeypadOpen}
/>

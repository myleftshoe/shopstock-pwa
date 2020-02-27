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
	import shortid from 'shortid';
	import data from './items.js';
	import Keypad, { NUMERIC, UNIT } from './keypad.svelte';
	import Item from './item.svelte';

	let items = data.map(name => ({id:'A'+shortid.generate(),name, qty: '', unit:''}));
	let selectedItem = {};

	let autoscroll = false;
	let pointerDown = false;

	let keypadType = NUMERIC;
	let keypadVisible = false;

	console.table(items)

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
	}

	function handleKeypadClick(e) {

		const {type, key} = e.target.dataset;

		switch (type) {
			case 'header': {
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

	function handleUnitChange(e) {
		selectedItem.unit = e.target.value;
		updateItems();
	}

	function handleScroll() {
		if (!autoscroll && pointerDown) 
			keypadVisible = false;
	}

	function ensureSelectedItemIsVisible() {
		const selectedElement = document.getElementById(selectedItem.id);
		const bodyElement = document.getElementsByTagName('body')[0];
		console.log(selectedElement);
		const boundingRect = selectedElement.getBoundingClientRect();
		const bodyBoundingRect = bodyElement.getBoundingClientRect();
		console.log(boundingRect.bottom,  bodyBoundingRect.bottom );
		if (boundingRect.bottom > bodyBoundingRect.bottom/2) {
			autoscroll = true;
			scrollTo({
				container: '#container', 
				element: `#${selectedItem.id}`,
				offset: -200,
				onDone: () => setTimeout(() => {autoscroll = false},1000)
			});
		}
	}

	function handleKeypadOpen() {
		keypadType = NUMERIC;
		ensureSelectedItemIsVisible(selectedItem);
	}

</script>
<main id='container' class='container' class:autoscroll 
	on:scroll={handleScroll} 
	on:pointerdown={() => pointerDown = true}
	on:pointerup={() => pointerDown = false}	
>
	{#each items as item, index}
		<Item {item} selected={selectedItem === item}
			on:itemclick={handleItemClick}
			on:qtyclick={handleQtyClick}
		/>
	{/each}
	<div id='spacer'></div>
</main>
<Keypad
	bind:type={keypadType}
	bind:visible={keypadVisible}
	on:click={handleKeypadClick} 
	on:open={handleKeypadOpen}
	on:change={handleUnitChange}
/>

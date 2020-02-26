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
	export let selectedItem = {};

	import { scrollTo } from "svelte-scrollto";
	import shortid from 'shortid';
	import data from './items.js';
	import Keypad, { keypad } from './keypad.svelte';
	import Item from './item.svelte';

	let items = data.map(name => ({id:'A'+shortid.generate(),name, qty: '', unit:''}));
	let autoscroll = false;
	let pointerDown = false;

	console.table(items)

	const findItemById = id => items.find(item => item.id === id) 

	function handleQtyClick(e) {
		selectedItem = findItemById(e.currentTarget.parentNode.id);
		keypad.type = keypad.NUMERIC;
		keypad.open();
	}

	function handleItemClick(e) {
		keypad.close();
		const el = e.target;
		if (selectedItem.id !== el.parentNode.id) {
			el.readOnly = true;
		}
		else {
			el.readOnly = false;
			el.focus();
			el.select();
		}
		selectedItem = findItemById(el.parentNode.id);
	}

	function updateItems() {
		items = [...items];
	}

	function handleKeypadClick(e) {

		const key = e.target.innerText;
		const type = e.target.dataset.type;

		switch (type) {
			case 'header': {
				return;
			}
			case 'unit': {
				selectedItem.unit = key;
				updateItems();
				keypad.type = keypad.NUMERIC;
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
				if (qty < 2)
					qty = 0;
				else
					qty--;
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
			keypad.close();
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
		keypad.type = keypad.NUMERIC;
		ensureSelectedItemIsVisible(selectedItem);
	}

</script>
<div id='container' class='container' class:autoscroll 
	on:scroll={handleScroll} 
	on:pointerdown={() => pointerDown = true}
	on:pointerup={() => pointerDown = false}	
>
	{#each items as item, index}
		<Item {item} selected={selectedItem.id === item.id}
			onItemClick={handleItemClick}
			onQtyClick={handleQtyClick}
		/>
	{/each}
	<div id='spacer'></div>
</div>
<Keypad 
	on:click={handleKeypadClick} 
	on:open={handleKeypadOpen}
	on:change={handleUnitChange}
/>

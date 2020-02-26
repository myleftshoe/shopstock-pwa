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
	.row {
		display:flex;
		flex-direction: row;
		justify-content: space-between;
		margin:1px;
		background-color: #ddd
	}
	.selected {
		background-color: yellowgreen;
	}
	.item { 
		padding: 16px 12px;
		border:none;
		background-color: transparent;
		flex-basis:100%;
		/* pointer-events: none; */
	}
	.quantity {
		display:flex;
		flex-direction: column;
		width: 30vw;
		/* height:100%; */
		padding:5px;
		background-color: yellowgreen;
		justify-content:center;
		align-items:center;
	}
	.unit { 
		font-size: 10px;
	}
</style>
<script>
	export let name;
	export let selectedItem = {};

	import {afterUpdate} from 'svelte'
	import * as animateScroll from "svelte-scrollto";
	import shortid from 'shortid';
	import data from './items.js';
	import Keypad, {keypad} from './keypad.svelte';
	// import {count} from './store.js';
	import EditItem from './edit-item.svelte';

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

	function handleKeypadClick(e) {
		const key = e.target.innerText;
		const type = e.target.dataset.type;
		if (type==='header')
			return;
		if (type === 'unit') {
			selectedItem.unit = key;
			items = [...items];
			keypad.type = keypad.NUMERIC;
			return;
		}
		if (['1/4', '1/2', '3/4'].includes(key)) {
			selectedItem.qty = key;
			items = [...items];
			return;
		}
		if (key === 'X') {
			selectedItem.qty = '';
			selectedItem.unit = '';
			items = [...items];
			return;
		}

		let qty = Number(selectedItem.qty);
		if (isNaN(qty))
			return;
		switch (key) {
			case '+': {
				qty++;
				break;
			}
			case '-': {
				if (qty < 2)
					qty = 0;
				else
					qty--;
				break;
			}
			default: 
				if ('0123456789'.includes(key)) 
					qty = Number(`${qty}${key}`);
		}
		selectedItem.qty =  qty;
		items = [...items]
	}

	function handleUnitChange(e) {
		selectedItem.unit =  e.target.value;
		items = [...items]
	}

	function handleScroll() {
		if (!autoscroll && pointerDown) {
			keypad.close();
		}
	}

	function handleKeypadOpen() {
		keypad.type = keypad.NUMERIC;
		const selectedElement = document.getElementById(selectedItem.id);
		const bodyElement = document.getElementsByTagName('body')[0];
		console.log(selectedElement);
		const boundingRect = selectedElement.getBoundingClientRect();
		const bodyBoundingRect = bodyElement.getBoundingClientRect();
		console.log(boundingRect.bottom,  bodyBoundingRect.bottom );
		if (boundingRect.bottom > bodyBoundingRect.bottom/2) {
			autoscroll = true;
			animateScroll.scrollTo({
				container: '#container', 
				element: `#${selectedItem.id}`,
				offset:-200,
				onDone: () => setTimeout(() => {autoscroll = false},1000)
			});
		}

	}
</script>
<div id='container' class='container' class:autoscroll 
	on:scroll={handleScroll} 
	on:pointerdown={() => pointerDown = true}
	on:pointerup={() => pointerDown = false}	
>
	{#each items as item, index}
		<div id={item.id} data-name={item.name} 
			class='row' 
			class:selected={selectedItem.id === item.id} 
		>
			<input type=text readonly class='item' value={item.name} on:click={handleItemClick}/>
			<div class='quantity' on:click={handleQtyClick} >
				<div tabindex='0'>{item.qty}</div>
				<!-- <input type=number tabindex='0' class='quantity' on:click={handleQtyClick} value={item.qty}/> -->
				<div class='unit'>{item.unit}</div>
				
			</div>
		</div>
	{/each}
	<div id='spacer'></div>
</div>
<Keypad 
	on:click={handleKeypadClick} 
	on:open={handleKeypadOpen}
	on:change={handleUnitChange}
/>

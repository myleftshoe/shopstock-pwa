<style>
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
    export let item;
    export let selected = false;
    export let onItemClick = () => {};
    export let onQtyClick = () => {};
</script>
<div id={item.id} data-name={item.name} class='row' class:selected>
    <input type=text readonly class='item' value={item.name} on:click={onItemClick}/>
    <div class='quantity' on:click={onQtyClick} >
        <div tabindex='0'>{item.qty}</div>
        <!-- <input type=number tabindex='0' class='quantity' on:click={handleQtyClick} value={item.qty}/> -->
        <div class='unit'>{item.unit}</div>
    </div>
</div>

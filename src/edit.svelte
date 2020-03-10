<style>
    .container {
        height: 100vh;
        width: 100vw;
        display: flex;
        flex-direction: column;
        align-items: center;
        justify-content: center;
        background-color: #ddd;
        position: fixed;
        top: 0;
        z-index: 1;
    }
    input[type='text'] {
        /* enlarge by 16/12 = 133.33% */
        border-radius: 6.666666667px;
        font-size: 16px;
        line-height: 26.666666667px;
        padding: 6.666666667px;
        width: 133.333333333%;

        /* scale down by 12/16 = 75% */
        transform: scale(0.75);
        transform-origin: left top;

        /* remove extra white space */
        margin-bottom: -10px;
        margin-right: -33.333333333%;

        font-size: 32px;
        text-align: center;
        border: none;
        background-color: transparent;
        outline: none;
    }
    .actions {
        display: flex;
    }
</style>

<script>
    export let item = {}
    export let open = true


    import { scale } from 'svelte/transition'
    import { createEventDispatcher } from 'svelte'
    const dispatch = createEventDispatcher()


    function handleSubmit() {
        console.log('submut!!')
        dispatch('done', {item});
    }

    $:  _item = {...item}
    $: { console.log(_item, "cccc", item) }
</script>

{#if open}
    <form class="container" transition:scale on:submit|preventDefault={handleSubmit}>
        <input type=text bind:value={item.name} />
        <div class="actions">
            <button  on:click={() => dispatch('cancel')}>cancel</button>
            <button type=submit on:click={() => dispatch('done', {item})}>done</button>
        </div>
    </form>
{/if}

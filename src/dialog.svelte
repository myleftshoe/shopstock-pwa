<style>
    dialog {
        background-color: f9f6ef;
        /* border: 1px solid #000;
        border-radius: 7px; */
        margin:0;
        padding:0;
    }
    .content{
        display: flex;
        flex-direction: column;
        justify-content: space-around;
        align-items: center;
        width:100vw;
        height:100vh;
    }
    section {
        display:flex;
        flex-direction: column;
        justify-items: space-between;
        align-items: flex-start;
    }
    footer {
        display:flex;
        justify-content: flex-end;
    }
    dialog::backdrop {

    }

</style>

<script>
    export let dialog = {};
    import dialogPolyfill from 'dialog-polyfill'
    import Button from './button.svelte'
    import { onMount } from 'svelte'

    onMount(() => dialogPolyfill.registerDialog(dialog))
</script>

<dialog id="dialog" bind:this={dialog} on:close on:cancel>
    <div class=content>
        <h3>SHARE</h3>
        <section>
            <slot />
        </section>
        <footer>
            <Button on:click={() => dialog.close()}>Done</Button>
        </footer>
    </div>
</dialog>

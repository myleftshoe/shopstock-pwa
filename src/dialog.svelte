<style>
    dialog {
        background-color: #f9f6ef;
        /* border: 1px solid #000;
        border-radius: 7px; */
        border:none;
        outline:none;
        margin:0;
        height: 100vh;
        width:100vw;
        overflow:scroll
        
    }
    footer {
        height:50vh;
    }
</style>

<script>

    export let dialog = {};
    import dialogPolyfill from 'dialog-polyfill'
    import Fab from './fab.svelte'
    import { onMount } from 'svelte'

    let textarea;
    onMount(() => {
        dialogPolyfill.registerDialog(dialog)
        // selectAll()
        window.history.pushState({page: 1}, "", "");
        window.addEventListener('popstate', function(e) {
            e.preventDefault(); 
            clearSelection();
            dialog.close()
        }, false)
    })
    function selectAll() {
        const range = document.createRange();
        range.selectNodeContents(textarea);
        const selection = window.getSelection();
        selection.removeAllRanges();
        selection.addRange(range);  
        // document.execCommand("copy");
    }
    function clearSelection() {
        console.log('on copy')
        const selection = window.getSelection();
        selection.removeAllRanges();
    }

</script>

<dialog id="dialog" bind:this={dialog} on:close on:cancel>
    <div class=content bind:this={textarea} contenteditable="false"  on:copy={clearSelection}>
        <slot />
    </div>
    <footer/>
    <!-- <Fab floating on:click={selectAll}>Copy All</Fab> -->
</dialog>

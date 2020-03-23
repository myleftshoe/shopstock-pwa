<script>
    
    import { onMount } from 'svelte';

    onMount(async () => {
        items = getCurrentItems(); // synchronous from localStorage
        getMasterItems(); // async from jsonbin
        if (!Array.isArray(items) || !items.some(hasQty)) {
            items = [...masterItems]
        }
    })

</script>
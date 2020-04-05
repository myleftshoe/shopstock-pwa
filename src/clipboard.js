function copy(text) {
    
    document.addEventListener('copy', handleCopy)
    document.execCommand('copy')

    function handleCopy(e) {
        e.preventDefault()
        e.stopPropagation()
        e.clipboardData.setData('text', text);
        document.removeEventListener('copy', handleCopy)
    }
}

export default { copy }

function getSelectedText() {
    let selectedText = "";
    if (window.getSelection) {
        selectedText = window.getSelection().toString();
    } else if (document.selection && document.selection.type != "Control") {
        // For older IE versions (prior to IE 9)
        selectedText = document.selection.createRange().text;
    }
    return selectedText;
}

document.addEventListener('mouseup', function() {
    const selectedText = getSelectedText();
    if (selectedText !== "") {
        console.log("Selected text: ", selectedText);
        // You can do whatever you want with the selected text here
    }
});


console.log("loaded")
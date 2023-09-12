// TODO: combine with the content js script.
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

function saveContent(url, highlight, note) {
    let ms = Date.now();
    const tooltip = document.getElementById('tooltip-iroh-wiki-ext');
    chrome.storage.local.get('highlightdata', (result) => {
        // console.log(result)
        if (Object.keys(result).length == 0) {
            const storage = {
                'highlightdata': {
                    url: [{
                        'note': note,
                        'highlight': highlight,
                        'time': ms
                    }]
                }
            };
            chrome.storage.local.set(storage);
            // remove after sabing
            document.body.removeChild(tooltip);
        } else {
            if (result['highlightdata'][url]) {
                result['highlightdata'][url].push({
                    'note': note,
                    'highlight': highlight,
                    'time': ms
                });
                chrome.storage.local.set(result);
            } else {
                result['highlightdata'][url] = [{
                    'note': note,
                    'highlight': highlight,
                    'time': ms
                }];
                chrome.storage.local.set(result);
                // remove after saving
                document.body.removeChild(tooltip);
            }
        }
    });
}

function displaySaveTooltip(selectedText, event) {
    // console.log(event);
    // The save tooltip element
    const tooltip = document.createElement("div");
    tooltip.id = "tooltip-iroh-wiki-ext";
    tooltip.class = "tooltip-iroh-wiki-ext-class";
    tooltip.style.position = "absolute";
    tooltip.style.backgroundColor = "rgba(255, 255, 255, 0.9)";
    tooltip.style.padding = "5px";
    tooltip.style.border = "1px solid #ccc";
    tooltip.style.borderRadius = "5px";
    tooltip.style.boxShadow = "2px 2px 5px rgba(0, 0, 0, 0.2)";
    tooltip.style.top = `${event.pageY}px`;
    tooltip.style.left = `${event.pageX}px`;

    // The textarea element
    const textarea = document.createElement("textarea");
    textarea.textContent = "Enter to save, Esc to close tooltip"; // Use textContent to set the content for textarea
    textarea.classList = ['tooltip-iroh-wiki-ext-textarea']
    tooltip.appendChild(textarea);
    document.body.appendChild(tooltip);

    function keydownHandler(event) {
        // save contents
        if (event.code === 'Enter') {
            const url = window.location.href;
            const highlight = selectedText;
            const note = textarea.value;
            saveContent(url, highlight, note);
        }
        // cancel
        if (event.code === 'Escape' && document.body.contains(tooltip)) {
            tooltip.parentNode.removeChild(tooltip);
            // Remove the event listener to prevent memory leaks and unexpected behaviors
        }
        document.removeEventListener("keydown", keydownHandler);
    }
    document.addEventListener("keydown", keydownHandler);
}

document.addEventListener('mouseup', function (event) {
    const selectedText = getSelectedText();
    if (selectedText !== "") {
        displaySaveTooltip(selectedText, event);
    }
});

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
    chrome.storage.local.get('highlightdata', (result) => {  
        // console.log(result)
        if (Object.keys(result).length == 0) {
          const storage = {
            'highlightdata': {
                url : [{
                    'note': note, 
                    'highlight': highlight, 
                    'time': ms
                }]
            }
          };
          chrome.storage.local.set(storage);
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
        }
        }
        document.body.removeChild(tooltip); 
      });
}

function displaySaveTooltip(selectedText, event) {
    // The save tooltip element
    const tooltip = document.createElement("div");
    tooltip.id = "tooltip-iroh-wiki-ext";
    tooltip.style.position = "absolute";
    tooltip.style.backgroundColor = "rgba(255, 255, 255, 0.9)";
    tooltip.style.padding = "5px";
    tooltip.style.border = "1px solid #ccc";
    tooltip.style.borderRadius = "5px";
    tooltip.style.boxShadow = "2px 2px 5px rgba(0, 0, 0, 0.2)";
    tooltip.style.top = `${event.layerY}px`;
    tooltip.style.left = `${event.layerX}px`;

    // The textarea element
    const textarea = document.createElement("textarea");
    textarea.textContent = "Enter to save, Esc to close tooltip"; // Use textContent to set the content for textarea
    tooltip.appendChild(textarea);
    document.body.appendChild(tooltip);

    // Save on enter 
    tooltip.addEventListener("keydown", function (event) {
        if (event.code === 'Enter') {
            const url = window.location.href;
            const highlight = selectedText;
            const note = textarea.value;
            saveContent(url, highlight, note)
        }
    });

    setTimeout(closeTooltip, 1000);
}

function closeTooltip() {
    let tooltip = document.getElementById('tooltip-iroh-wiki-ext')
    document.addEventListener('click', function(event) {
        // console.log(event)
        if (event.target !== 'div#tooltip-iroh-wiki-ext') {
            // console.log(tooltip)
            document.body.removeChild(tooltip)
            console.log("removed")
        }
    });
    tooltip.addEventListener("keydown", function (event) {
        if (event.code === 'Escape') {
            document.body.removeChild(tooltip); 
        }
    });
}

document.addEventListener('mouseup', function(event) {
    const selectedText = getSelectedText();
    if (selectedText !== "") {
        displaySaveTooltip(selectedText, event);
    }
});

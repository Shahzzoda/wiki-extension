const textarea = document.getElementById('notetextarea');
let typingTimeout;

// retrieves from chrome data and stores it in textarea
chrome.storage.local.get('notes', result => {
    textarea.value = result['notes'];
});

function saveTextToLocalStorage() {
    const text = textarea.value;
    const notes = {
        'notes':  text
      };
    chrome.storage.local.set(notes, function() {
        console.log('Text saved to local storage:', text);
    });
}

function handleInputEvent() {
    console.log("taking notes ...")
    // Clear any previous timeout
        clearTimeout(typingTimeout);
      
    // Set a new timeout to trigger the saving process after 1 second of inactivity
    typingTimeout = setTimeout(saveTextToLocalStorage, 1000);
}
  
document.getElementById('notes').addEventListener('input', handleInputEvent);

  
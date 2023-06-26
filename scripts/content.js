// On each page load, content.js scripts get injected
// So here, we just want to grab all the right information 
// and send it to background script. 

document.addEventListener("click", handleLinkClick);

function handleLinkClick(event) {
    if (event.target.tagName === "A") {
        var currentPageUrl = window.location.href;
        var targetUrl = event.target.href;
        const title = document.getElementById('firstHeading').children[0].innerHTML;        
        const desc = document.getElementsByClassName('shortdescription')[0].innerText;

        // Send a message to the background script with the navigation information
        chrome.runtime.sendMessage({ currentPageUrl, targetUrl, title, desc });
    }
}

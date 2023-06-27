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

        const data = {
            title: title,
            desc: desc,
            current_url: currentPageUrl,
            target_url: targetUrl
        };
        
        const storageData = {};
        storageData[currentPageUrl] = data;
      
        chrome.storage.local.set(storageData, () => {
          console.log("Value is set");
        });
      
        chrome.storage.local.get(currentPageUrl, (result) => {
          console.log(result);
        });
    }
}

// chrome.tabs.create({ url: chrome.runtime.getURL("newtab.html") });


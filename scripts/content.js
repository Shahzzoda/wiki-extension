// chrome.storage.local.clear(); // uncomment during developent to reset data 
// On each page load, content.js scripts get injected
// So here, we just want to store all the node information on visit
// and store a link information when they click anything on the site. 
// data: {
//   nodes: [
//     {id: "url", desc: "short desc", label: "title", time: x}
//   ],
//   links: [
//     { source: "url", target: "url", time: x}
//   ],
// exists: ["url1", "url2"]
// }
// where x is some int in unix time (ms since jan 01, 1970)
const title = document.getElementById('firstHeading').children[0].innerHTML;        
const desc = document.getElementsByClassName('shortdescription')[0].innerText;
var currtenPageUrl = window.location.origin + window.location.pathname; // avoid saving hash
let ms = Date.now();
const node = {
  label: title,
  desc: desc,
  id: currentPageUrl,
  time: ms,
};

chrome.storage.local.get('wikidata', (result) => {  
  if (Object.keys(result).length == 0) {
    const storage = {
      'wikidata': {
        'nodes': [node],
        'links': [],
        'exists': [currentPageUrl],
      }
    };
    chrome.storage.local.set(storage);
  } else {
    let existingNodes = new Set(result['wikidata']['exists']);
    if (!existingNodes.has(currentPageUrl)) {
      result['wikidata']['nodes'].push(node);
      result['wikidata']['exists'].push(currentPageUrl)
      chrome.storage.local.set(result)
    };
  }
});


document.addEventListener("click", handleLinkClick);
function handleLinkClick(event) {
  if (event.target.tagName === "A") {
    var targetUrl = event.target.href;
    let ms = Date.now();
    const link = {
      source: currentPageUrl,
      target: targetUrl,
      time: ms,
      type: 'licensing',
    };

    chrome.storage.local.get('wikidata', (result) => {  
      console.log(result);
      result['wikidata']['links'].push(link);
      chrome.storage.local.set(result)
    });
  }
}

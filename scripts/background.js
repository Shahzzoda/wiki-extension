// Background script 
const data = {
  nodes: [],
  links: [],
};

chrome.runtime.onMessage.addListener(function (message) {
    var currentPageUrl = message.currentPageUrl;
    var targetUrl = message.targetUrl;
    var title = message.title;
    var desc = message.desc

    data.nodes.push({
        id: title,
        desc: desc,
    });
    data.links.push({
        source: currentPageUrl,
        desc: targetUrl,
    });

    console.log("done:", data);
});

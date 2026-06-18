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
const headingEl = document.getElementById('firstHeading');
const title = headingEl ? headingEl.textContent.trim() : document.title;
const descEl = document.getElementsByClassName('shortdescription')[0];
const desc = descEl ? descEl.innerText : '';
// strip hash/query so a page always has one stable id (matches node ids)
const normalize = (url) => {
  try {
    const u = new URL(url);
    return u.origin + u.pathname;
  } catch (e) {
    return null;
  }
};

var currentPageUrl = window.location.origin + window.location.pathname; // avoid saving hash

// the page we arrived from — this, not click-tracking, is the rabbit-hole edge.
// recording on load (instead of on click) means the write can't be lost to navigation.
const referrer = normalize(document.referrer);

let ms = Date.now();
const node = {
  label: title,
  desc: desc,
  id: currentPageUrl,
  time: ms,
};

chrome.storage.local.get('data', (result) => {
  const data = result['data'] || { nodes: [], links: [], exists: [] };
  data.nodes = data.nodes || [];
  data.links = data.links || [];
  data.exists = data.exists || [];

  // store this page as a node, once per url
  if (!data.exists.includes(currentPageUrl)) {
    data.nodes.push(node);
    data.exists.push(currentPageUrl);
  }

  // connect referrer -> current page, but only if both are real visited nodes
  // (filters out external entry points like google) and the edge is new.
  if (referrer && referrer !== currentPageUrl && data.exists.includes(referrer)) {
    const dupe = data.links.some(
      (l) => l.source === referrer && l.target === currentPageUrl
    );
    if (!dupe) {
      data.links.push({
        source: referrer,
        target: currentPageUrl,
        time: ms,
        type: 'licensing',
      });
    }
  }

  chrome.storage.local.set({ data });
});
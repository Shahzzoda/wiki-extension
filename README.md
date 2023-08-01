# wiki-extension
a **chrome extension** that visualizes what youve been exploring on wikipedia and saves it as your new tab so you can recall more often. 
Looks like this:
<img width="1409" alt="new tab page" src="https://github.com/Shahzzoda/wiki-extension/blob/main/main.png">

# features
- time control so you can revisit and recollect the sites you explored last x days (1, 2, and 7 days -- if you know a bit of coding, its extremely easy to customize this)
- slider to control repulsion of wiki nodes
- the nodes are all links so you can click and revist thenm
- also draggable + fun ! :D
- all the settings (time controls and repulsion force) will be saved between session 
- note taking system to have your own notes and to save any highlights you have from any webpage

# how to try
1. download these files (git clone, etc)
2. open chrome and go to your extensions page
3. turn on developer mode with toggle
4. press load unpacked
5. go to this folder and open
Should look like this
<img width="1840" alt="extension page for devs" src="https://github.com/Shahzzoda/wiki-extension/blob/main/developer_ext.png">

# open tasks 
- if you open in a new tab and dont visit the site, node is null and therefore you wont see the graph. in chrome's developer console you can see which node is null and visit it to get around/unblock yourself locally
- i saved a short description, on `g` hover you can see it as a tooltip. however this is only if you can hit the 5px boder around textbox which is obviously hard to do. fixing this is an open task. cool possible feature: actual popup cards the way wikipedia does
- centering the arrows (`paths`) is nontrivial and perhaps worth the effort for a visually more appealing product.

tech: d3, js, svg, and some chrom api knowledge will help :)

# wiki-extension
a **chrome extension** that visualizes what youve been exploring on wikipedia and saves it as your new tab so you can recall more often. 
Looks like this:
<img width="1409" alt="Screenshot 2023-06-28 at 1 09 07 AM" src="https://github.com/Shahzzoda/wiki-extension/assets/19254083/d51855cb-c094-41ee-98c8-19dbc8c03e2c">

# features
- time control so you can revisit and recollect the sites you explored last x days (1, 2, and 7 days -- if you know a bit of coding, its extremely easy to customize this)
- slider to control repulsion of wiki nodes
- the nodes are all links so you can click and revist thenm
- also draggable + fun ! :D

# how to try
1. download these files (git clone, etc)
2. open chrome and go to your extensions page
3. turn on developer mode with toggle
4. press load unpacked
5. go to this folder and open
Should look like this
<img width="1840" alt="Screenshot 2023-06-28 at 1 14 38 AM" src="https://github.com/Shahzzoda/wiki-extension/assets/19254083/321e49a0-a93a-4a79-807c-a72427d3fe6e">

# open tasks 
- if you open in a new tab and dont visit the site, node is null and therefore you wont see the graph. in chrome's developer console you can see which node is null and visit it to get around
- saved short description and on `g` hover you can see it as a tooltip. however this is only. ifyou can hit the 5px boder around textbox. cool feature: actual popup cards the way wikipedia does
- centering the arrows (`paths`) is nontrivial and perhaps worth the effort for a visually more appealing product.

tech: d3, js, svg, and some chrom api knowledge will help :)

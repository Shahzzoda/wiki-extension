chrome.storage.local.get('highlightdata', (result) => {  
    const myObject = result['highlightdata']
    console.log(myObject)
    for (const url in myObject) {
        if (myObject.hasOwnProperty(url)) {
            console.log(url)
            for (const i in myObject[url]) {
                let note = myObject[url][i]['note'];
                let highlight = myObject[url][i]['highlight']
                createDiv(url, note, highlight)
            }
        }
    }
});



function createDiv(url, note, highlight) {
    // console.log(result);
    const sidebar = document.getElementById("highlights")
    const componentparent = document.createElement("div");
    componentparent.classList = ['card'];
    const component = document.createElement("div");
    component.classList = ['card-body'];

    let phighlight = document.createElement("p");
    phighlight.textContent = highlight;
    let a = document.createElement("a");
    a.href = url;
    a.appendChild(phighlight)
    let pnote = document.createElement("p");
    pnote.textContent = note

    component.appendChild(pnote)
    component.appendChild(a)
    componentparent.appendChild(component);
    
    sidebar.appendChild(componentparent);
}

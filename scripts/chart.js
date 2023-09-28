chrome.storage.local.get('data', result => {
    if (Object.keys(result).length === 0) {
        return;
    }

    const nodes = result['data']['nodes'];
    const links = result['data']['links'];

    chrome.storage.local.get("forceStrength", async result => {
        const strength = Object.keys(result).length === 0 ? -1200 : result['forceStrength']
        document.getElementById("range-slider__value").innerHTML = strength * -1;
        document.getElementById("range-slider__range").value = strength * -1;

        const radioButtons = document.getElementsByClassName('switch-field-input');
        let timeWindow = await chrome.storage.local.get("timeWindow");
        if (timeWindow['timeWindow']) {
            timeWindow = timeWindow['timeWindow']
        } else {
            timeWindow = 24 * 60 * 60 * 1000;
        }
        // default radio button should be blue
        let twValue = timeWindow / 60 / 60 / 1000;
        const check = document.querySelectorAll(`input[value="${twValue}"]`)[0];
        check.nextElementSibling.classList.add('checked')

        Array.from(radioButtons).forEach(function (radioButton) {

            radioButton.addEventListener('click', function (event) {
                let timeW = { "timeWindow": this.value * 60 * 60 * 1000 };
                chrome.storage.local.set(timeW);
                const newNodes = nodes.filter(function (node) {
                    return node['time'] > Date.now() - timeWindow
                });
                const newLinks = links.filter(function (link) {
                    return link['time'] > Date.now() - timeWindow
                });


                // remove unchecked
                const checked = document.getElementsByClassName('checked')[0];
                checked.classList.remove('checked');
                // check the right value
                const check = document.querySelectorAll(`input[value="${this.value}"]`)[0];
                check.nextElementSibling.classList.add('checked')

                drawSVG(newNodes, newLinks, strength);
            });
        });


        const newNodes = nodes.filter(function (node) {
            return node['time'] > Date.now() - timeWindow
        });
        const newLinks = links.filter(function (link) {
            return link['time'] > Date.now() - timeWindow
        });
        drawSVG(newNodes, newLinks, strength);

        const rangeSlider = document.getElementById("range-slider__range");
        const rangeValue = document.getElementById("range-slider__value");

        rangeSlider.addEventListener("input", function () {
            rangeValue.textContent = rangeSlider.value;
            const strength = -1 * rangeSlider.value
            drawSVG(newNodes, newLinks, strength);

            setTimeout(function () {
                const newForceStrength = { "forceStrength": strength };
                chrome.storage.local.set(newForceStrength);
            }, 500);
        });
    })
});

function drawSVG(nodes, links, forceStrength) {
    // Remove the existing SVG element if it exists
    const existingSVG = document.querySelector("svg");
    if (existingSVG) {
        existingSVG.remove();
    }

    const types = ["licensing", "suit", "resolved"];

    const height = window.innerHeight * 0.9;
    const width = window.innerWidth;
    const color = d3.scaleOrdinal(d3.schemeCategory10);

    function linkArc(d) {
        console.log(d)
        const distance = Math.hypot(d.target.x - d.source.x, d.target.y - d.source.y);
        return `
            M${d.source.x},${d.source.y}
            A${distance},${distance} 0 0,1 ${d.target.x},${d.target.y}
        `;
    }

    const drag = simulation => {
        const dragstarted = (event, d) => {
            if (!event.active) simulation.alphaTarget(0.5).restart();
            d.fx = d.x;
            d.fy = d.y;
        };

        const dragged = (event, d) => {
            d.fx = event.x;
            d.fy = event.y;
        };

        const dragended = (event, d) => {
            if (!event.active) simulation.alphaTarget(0);
            d.fx = null;
            d.fy = null;
        };

        return d3.drag()
            .on("start", dragstarted)
            .on("drag", dragged)
            .on("end", dragended);
    };

    const d_links = links.map(d => ({ ...d }));
    const d_nodes = nodes.map(d => ({ ...d }));

    const simulation = d3.forceSimulation(d_nodes)
        .force("link", d3.forceLink(d_links).id(d => d.id))
        .force("charge", d3.forceManyBody().strength(forceStrength))
        .force("x", d3.forceX())
        .force("y", d3.forceY());

    const svg = d3.create("svg")
        .attr("viewBox", [-width / 2, -height / 2, width, height])
        .style("font", "16px system-ui, sans-serif");

    svg.append("defs").selectAll("marker")
        .data(types)
        .join("marker")
        .attr("id", d => `arrow-${d}`)
        .attr("viewBox", "0 -5 10 10")
        .attr("refX", 15)
        .attr("refY", -0.5)
        .attr("markerWidth", 6)
        .attr("markerHeight", 6)
        .attr("orient", "auto")
        .append("path")
        .attr("fill", color)
        .attr("d", "M0,-5L10,0L0,5");

    const link = svg.append("g")
        .attr("fill", "none")
        .attr("stroke-width", 1.5)
        .selectAll("path")
        .data(d_links)
        .join("path")
        .attr("stroke", d => color(d.type))
        .attr("marker-end", d => `url(#arrow-${d.type})`);

    const node = svg.append("g")
        .attr("fill", "currentColor")
        .attr("stroke-linecap", "round")
        .attr("stroke-linejoin", "round")
        .selectAll("g")
        .data(d_nodes)
        .join("g")
        .call(drag(simulation));

    node.append("title").text(d => d.desc);

    const rect = node.append("rect")
        .attr("stroke", "white")
        .attr("stroke-width", 1.5)
        .attr("fill", "#8ecaf4b3");

    const text = node.append("text")
        .attr("x", 8)
        .attr("y", "0.31em")
        .attr("dx", -2)
        .attr("dy", 12)
        .append("a")
        .attr("xlink:href", d => d.id)
        .text(d => d.label);

    simulation.on("tick", () => {
        link.attr("d", linkArc);
        node.attr("transform", d => `translate(${d.x},${d.y})`);

        node.each(function (d) {
            const currentNode = d3.select(this);
            const rect = currentNode.select("rect");
            const text = currentNode.select("text");

            const textBBox = text.node().getBBox();
            const textWidth = textBBox.width;
            const textHeight = textBBox.height;

            rect.attr("width", textWidth + 15)
                .attr("height", textHeight + 10)
                .attr("rx", 5);
        });
    });

    document.getElementById("svg-container").appendChild(svg.node());
}



function handleVisualsForTime(newSelected) {
    console.log("butt pressed")
    const input = document.querySelectorAll('.switch-field-input:checked')
    const checked = input[0];
    const check = document.querySelectorAll(`input[value="${newSelected}"]`);
    checked.checked = false;
    check.checked = true;
}
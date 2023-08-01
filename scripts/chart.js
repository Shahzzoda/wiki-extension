chrome.storage.local.get('data', result => {
    if (Object.keys(result).length === 0) {
        return;
    }

    const nodes = result['data']['nodes'];
    const links = result['data']['links'];
    
    chrome.storage.local.get("forceStrength", result => {
        const strength = Object.keys(result).length === 0 ? -1200 :  result['forceStrength']
        document.getElementById("range-slider__value").innerHTML = strength * -1;
        document.getElementById("range-slider__range").value = strength * -1;

        const radioButtons = document.getElementsByClassName('switch-field-input');

        Array.from(radioButtons).forEach(function (radioButton) {
            radioButton.addEventListener('click', function () {
                const timeWindow = this.value * 60 * 60 * 1000; // hours -> ms
                const newNodes = nodes.filter(function (node) {
                    return node['time'] > Date.now() - timeWindow
                });
                const newLinks = links.filter(function (link) {
                    return link['time'] > Date.now() - timeWindow
                });
                drawSVG(newNodes, newLinks, strength);
            });
        });

        const timeWindow = 24 * 60 * 60 * 1000 // hours -> ms (default: 24)
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
                const newForceStrength = { "forceStrength" : strength };
                chrome.storage.local.set(newForceStrength);
            }, 500);
        });
    })
});

function drawSVG(nodes, links, forceStrength) {
    // before drawing new, delete old.
    const element = document.getElementsByTagName("svg")[0];
    if (element) {
        element.remove();
    }

    const types = ["licensing", "suit", "resolved"];

    const height = window.innerHeight * .9;
    const width = window.innerWidth;
    const color = d3.scaleOrdinal(d3.schemeCategory10);

    function linkArc(d) {
        // console.log(d);
        const distance = Math.hypot(d.target.x - d.source.x, d.target.y - d.source.y);
        return `
            M${d.source.x},${d.source.y}
            A${distance},${distance} 0 0,1 ${d.target.x},${d.target.y}
        `;
    }

    const drag = simulation => {
        function dragstarted(event, d) {
            if (!event.active) simulation.alphaTarget(0.5).restart();
            d.fx = d.x;
            d.fy = d.y;
        }

        function dragged(event, d) {
            d.fx = event.x;
            d.fy = event.y;
        }

        function dragended(event, d) {
            if (!event.active) simulation.alphaTarget(0);
            d.fx = null;
            d.fy = null;
        }

        return d3.drag()
            .on("start", dragstarted)
            .on("drag", dragged)
            .on("end", dragended);
    }

    const d_links = links.map(d => Object.create(d));
    const d_nodes = nodes.map(d => Object.create(d));

    const simulation = d3.forceSimulation(d_nodes)
        .force("link", d3.forceLink(d_links).id(d => d.id))
        .force("charge", d3.forceManyBody().strength(forceStrength))
        .force("x", d3.forceX())
        .force("y", d3.forceY());

    const svg = d3.create("svg")
        .attr("viewBox", [-width / 2, -height / 2, width, height])
        .style("font", "16px system-ui, sans-serif");

    // Per-type markers, as they don't inherit styles.
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
        .attr("marker-end", d => `url(${new URL(`#arrow-${d.type}`, location)})`);

    const node = svg.append("g")
        .attr("fill", "currentColor")
        .attr("stroke-linecap", "round")
        .attr("stroke-linejoin", "round")
        .selectAll("g")
        .data(d_nodes)
        .join("g")
        .call(drag(simulation));
    
    // kinda impossible to see, fix. 
    node.append("title").attr("innerHTML", d => d.desc);

    node.append("rect")
        .attr("stroke", "white")
        .attr("stroke-width", 1.5)
        .attr("fill", "#8ecaf4b3");

    node.append("text")
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
            const rect = d3.select(this).select("rect");
            const text = d3.select(this).select("text");

            const textBBox = text.node().getBBox();
            const textWidth = textBBox.width;
            const textHeight = textBBox.height;

            rect.attr("width", textWidth + 15) 
                .attr("height", textHeight + 10) 
                .attr("rx", 5);
            
        });

          
    });

    document.getElementById("svg-container").appendChild(svg.node());
};

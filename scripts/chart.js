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

    // cohesive minimalist palette (accent: #8ecaf4)
    const LINK_COLOR = "#c2d1e6";
    const LINK_HIGHLIGHT = "#5b8fb9";
    const NODE_FILL = "#eef6fd";
    const NODE_STROKE = "#8ecaf4";
    const NODE_STROKE_HIGHLIGHT = "#3f88c5";
    const TEXT_COLOR = "#334e68";

    function linkArc(d) {
        const distance = Math.hypot(d.target.x - d.source.x, d.target.y - d.source.y);
        // a gentle, flatter arc reads cleaner than a tight bow
        const r = distance * 1.6;
        return `
            M${d.source.x},${d.source.y}
            A${r},${r} 0 0,1 ${d.target.x},${d.target.y}
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

    const d_nodes = nodes.map(d => ({ ...d }));

    // d3.forceLink throws "node not found" if a link points to a page that was
    // clicked but never visited (so it was never stored as a node). Drop those
    // dangling links so one of them can't abort the whole render.
    const nodeIds = new Set(d_nodes.map(d => d.id));
    const linkId = end => (typeof end === "object" ? end.id : end);
    const d_links = links
        .filter(l => nodeIds.has(linkId(l.source)) && nodeIds.has(linkId(l.target)))
        .map(d => ({ ...d }));

    const simulation = d3.forceSimulation(d_nodes)
        .force("link", d3.forceLink(d_links).id(d => d.id))
        .force("charge", d3.forceManyBody().strength(forceStrength))
        .force("x", d3.forceX())
        .force("y", d3.forceY());

    const svg = d3.create("svg")
        .attr("viewBox", [-width / 2, -height / 2, width, height])
        .style("font", "15px system-ui, sans-serif");

    const defs = svg.append("defs");

    // soft drop shadow to lift node cards off the page
    const shadow = defs.append("filter")
        .attr("id", "node-shadow")
        .attr("x", "-50%").attr("y", "-50%")
        .attr("width", "200%").attr("height", "200%");
    shadow.append("feDropShadow")
        .attr("dx", 0).attr("dy", 1)
        .attr("stdDeviation", 2)
        .attr("flood-color", "#1f3a5f")
        .attr("flood-opacity", 0.18);

    defs.selectAll("marker")
        .data(types)
        .join("marker")
        .attr("id", d => `arrow-${d}`)
        .attr("viewBox", "0 -5 10 10")
        .attr("refX", 15)
        .attr("refY", -0.5)
        .attr("markerWidth", 5)
        .attr("markerHeight", 5)
        .attr("orient", "auto")
        .append("path")
        .attr("fill", LINK_COLOR)
        .attr("d", "M0,-5L10,0L0,5");

    const link = svg.append("g")
        .attr("fill", "none")
        .attr("stroke-width", 1.25)
        .attr("stroke-opacity", 0.7)
        .selectAll("path")
        .data(d_links)
        .join("path")
        .attr("stroke", LINK_COLOR)
        .attr("marker-end", d => `url(#arrow-${d.type})`);

    const node = svg.append("g")
        .attr("stroke-linecap", "round")
        .attr("stroke-linejoin", "round")
        .selectAll("g")
        .data(d_nodes)
        .join("g")
        .style("cursor", "pointer")
        .call(drag(simulation));

    node.append("title").text(d => d.desc);

    const rect = node.append("rect")
        .attr("fill", NODE_FILL)
        .attr("stroke", NODE_STROKE)
        .attr("stroke-width", 1.5)
        .attr("filter", "url(#node-shadow)");

    node.append("text")
        .attr("text-anchor", "middle")
        .attr("dominant-baseline", "central")
        .attr("fill", TEXT_COLOR)
        .append("a")
        .attr("xlink:href", d => d.id)
        .text(d => d.label);

    // adjacency for hover highlighting
    const linkedByIndex = new Set();
    d_links.forEach(d => linkedByIndex.add(`${d.source.index},${d.target.index}`));
    const isConnected = (a, b) =>
        a.index === b.index ||
        linkedByIndex.has(`${a.index},${b.index}`) ||
        linkedByIndex.has(`${b.index},${a.index}`);

    node.on("mouseenter", (event, d) => {
        node.transition().duration(150)
            .style("opacity", o => isConnected(d, o) ? 1 : 0.15);
        rect.transition().duration(150)
            .attr("stroke", o => isConnected(d, o) ? NODE_STROKE_HIGHLIGHT : NODE_STROKE);
        link.transition().duration(150)
            .attr("stroke", l => (l.source === d || l.target === d) ? LINK_HIGHLIGHT : LINK_COLOR)
            .attr("stroke-opacity", l => (l.source === d || l.target === d) ? 0.95 : 0.12);
        d3.select(event.currentTarget).raise();
    });

    node.on("mouseleave", () => {
        node.transition().duration(150).style("opacity", 1);
        rect.transition().duration(150).attr("stroke", NODE_STROKE);
        link.transition().duration(150)
            .attr("stroke", LINK_COLOR)
            .attr("stroke-opacity", 0.7);
    });

    simulation.on("tick", () => {
        link.attr("d", linkArc);
        node.attr("transform", d => `translate(${d.x},${d.y})`);

        node.each(function () {
            const currentNode = d3.select(this);
            const rect = currentNode.select("rect");
            const textBBox = currentNode.select("text").node().getBBox();

            const padX = 12;
            const padY = 7;
            const w = textBBox.width + padX * 2;
            const h = textBBox.height + padY * 2;

            // center the pill on the node origin so text + arrows align
            rect.attr("x", -w / 2)
                .attr("y", -h / 2)
                .attr("width", w)
                .attr("height", h)
                .attr("rx", h / 2);
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